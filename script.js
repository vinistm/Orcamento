let orcamentoTotal = 0;
    let orcamentoAtual = 0;
    let mesSelecionado = "";
    let orcamentoPorMes = {};

    carregarDadosLocalStorage();
    atualizarOrcamento();
    atualizarPorcentagemTotal();
    adicionarEventosInput();


    function adicionarOrcamento() {
     
      const modalNovoOrcamento = document.getElementById('modalNovoOrcamento');
      modalNovoOrcamento.style.display = 'block';
      document.body.classList.add('modal-open');
      atualizarOrcamento();
      atualizarPorcentagemTotal();
      atualizarPorcentagemMes(mes);
      salvarDadosLocalStorage();
    }

   /* function adicionarEventosInput() {
      const inputOrcamento = document.getElementById('orcamento');
      inputOrcamento.addEventListener('input', atualizarComparacoes);

      const inputItem = document.getElementById('item');
      const inputValor = document.getElementById('valor');
      inputItem.addEventListener('input', atualizarComparacoes);
      inputValor.addEventListener('input', atualizarComparacoes);
    }*/

    function abrirModal(mes) {
      mesSelecionado = mes;
      document.body.classList.add('modal-open');
      document.getElementById('myModal').style.display = 'block';
      const mesSelecionadoTitulo = document.getElementById('mesSelecionadoTitulo');
      mesSelecionadoTitulo.innerText = `${mes}`;
      
      if (!orcamentoPorMes[mes]) {
        orcamentoPorMes[mes] = {
          orcamentoMes: orcamentoTotal,
          orcamentoAtualMes: 0,
          itens: []
        };
      }
      atualizarOrcamento();
      atualizarPorcentagemMes(mes);
      exibirItensDoMes(mes);
    }

    function adicionarItem() {
      const categoria = document.getElementById('categoria').value;
      let valorRaw = document.getElementById('valor').value;
    
      valorRaw = valorRaw.replace(/[^\d.,-]/g, '');
      valorRaw = valorRaw.replace(',', '.');
    
      const valor = parseFloat(valorRaw) || 0;
    
      if (isNaN(valor)) {
        alert("Por favor, insira um valor numérico para o item.");
        return;
      }
    
      if (valor <= (orcamentoTotal - orcamentoAtual)) {
        orcamentoAtual += valor;
    
        if (!orcamentoPorMes[mesSelecionado]) {
          orcamentoPorMes[mesSelecionado] = {
            orcamentoMes: orcamentoTotal,
            orcamentoAtualMes: 0,
            itens: []
          };
        }
    
        orcamentoPorMes[mesSelecionado].orcamentoAtualMes += valor;
        orcamentoPorMes[mesSelecionado].itens.push({ nome: categoria, valor });
        document.getElementById('valor').value = '';
    
        exibirItensDoMes(mesSelecionado);
        atualizarPorcentagemMes(mesSelecionado);
        atualizarPorcentagemTotal();
        salvarItensLocalStorage();
        salvarDadosLocalStorage();
        atualizarOrcamento();
      } else {
        alert("O valor do item excede o orçamento disponível.");
      }
    }
    
    function salvarItensLocalStorage() {
      localStorage.setItem('itensPorMes', JSON.stringify(orcamentoPorMes));
    }


    function carregarDadosLocalStorage() {
      orcamentoTotal = parseFloat(localStorage.getItem('orcamentoTotal')) || 0;
      orcamentoAtual = parseFloat(localStorage.getItem('orcamentoAtual')) || 0;
      const orcamentoPorMesString = localStorage.getItem('orcamentoPorMes');
      orcamentoPorMes = orcamentoPorMesString ? JSON.parse(orcamentoPorMesString) : {};

      console.log('orcamentoTotal:', orcamentoTotal);
      console.log('orcamentoAtual:', orcamentoAtual);
      console.log('orcamentoPorMes:', orcamentoPorMes);
    
      const itensPorMesString = localStorage.getItem('itensPorMes');
      const itensPorMes = itensPorMesString ? JSON.parse(itensPorMesString) : {};
      Object.keys(itensPorMes).forEach(mes => {
        if (!orcamentoPorMes[mes]) {
          orcamentoPorMes[mes] = {
            orcamentoMes: orcamentoTotal,
            orcamentoAtualMes: 0,
            itens: []
          };
        }
        orcamentoPorMes[mes].itens = itensPorMes[mes].itens;
      });
    
      if (orcamentoAtual < 0) {
        orcamentoAtual = 0;
      }
    
      atualizarPorcentagemTotal();
      atualizarOrcamento();
    }

   
   
  
    function exibirItensDoMes(mes) {
      const listaItensModal = document.getElementById('listaItensModal');
      listaItensModal.innerHTML = '';
    
      const orcamentoMes = orcamentoPorMes[mes].orcamentoMes;
    
      orcamentoPorMes[mes].itens.forEach(item => {
        const valorFormatado = item.valor.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        const porcentagemItem = ((item.valor / orcamentoMes) * 100).toFixed(2);
    
        const liModal = document.createElement('li');
        liModal.innerHTML = `${item.nome} : ${valorFormatado} (${porcentagemItem}%) <button onclick="excluirItem('${item.nome}')">Excluir</button>`;
        listaItensModal.appendChild(liModal);
      });
      atualizarOrcamento();
      console.log('Itens do mês', mes, ':', orcamentoPorMes[mes].itens);
    }


    function alternarMostrarPorcentagens() {
      const btnMostrarPorcentagens = document.getElementById('btnMostrarPorcentagens');
      const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];
    
      if (btnMostrarPorcentagens.innerText === 'Mostrar') {
        meses.forEach(mes => {
          atualizarPorcentagemMes(mes);
        });
        btnMostrarPorcentagens.innerText = 'Ocultar ';
      } else {
        meses.forEach(mes => {
          document.getElementById(`porcentagem${mes}`).innerText = '0%';
        });
        btnMostrarPorcentagens.innerText = 'Mostrar ';
      }
    }


    function compararMesesSelecionados() {
      const mes1 = document.getElementById('mes1').value;
      const mes2 = document.getElementById('mes2').value;
    
      const resultado = calcularDiferencaPorcentagens(mes1, mes2);
    
      const diferencaPorcentagens = resultado.diferencaPorcentagens;
      const itensDiferenca = resultado.itensDiferenca;
    
      const resultadoComparacao = document.createElement('div');
      resultadoComparacao.innerHTML = `<p>Diferença Total: ${diferencaPorcentagens}</p>`;
    
      for (const item in itensDiferenca) {
        const detalhesItem = document.createElement('p');
    
        const gastoMes1 = itensDiferenca[item].mes1 ? itensDiferenca[item].mes1 : '0.00';
        const gastoMes2 = itensDiferenca[item].mes2 ? itensDiferenca[item].mes2 : '0.00';
    
        detalhesItem.innerText = `${item}: ${mes1} - ${gastoMes1} (${itensDiferenca[item].porcentagemMes1}), ${mes2} - ${gastoMes2} (${itensDiferenca[item].porcentagemMes2}) - Diferença: ${itensDiferenca[item].diferenca}`;
        resultadoComparacao.appendChild(detalhesItem);
      }
    
      abrirModalComparacao(resultadoComparacao.innerHTML);
    }
    
    

    function fecharModal() {
      const modal = document.getElementById('myModal');
      modal.style.display = 'none';
      
    }

    function excluirItem(nomeItem) {
      const itemIndex = orcamentoPorMes[mesSelecionado].itens.findIndex(item => item.nome === nomeItem);
      const valorItemExcluido = orcamentoPorMes[mesSelecionado].itens[itemIndex].valor;

      orcamentoAtual -= valorItemExcluido;
      orcamentoPorMes[mesSelecionado].orcamentoAtualMes -= valorItemExcluido;
      orcamentoPorMes[mesSelecionado].itens.splice(itemIndex, 1);
     
      atualizarPorcentagemMes(mesSelecionado);
      exibirItensDoMes(mesSelecionado);
      atualizarPorcentagemTotal();
      salvarItensLocalStorage();
      salvarDadosLocalStorage();
      
    }

    function atualizarPorcentagemMes(mes) {
      if (orcamentoPorMes[mes]) {
        const orcamentoAtualMes = orcamentoPorMes[mes].orcamentoAtualMes;
        const orcamentoMes = orcamentoPorMes[mes].orcamentoMes;
    
        const porcentagemMes = orcamentoTotal > 0 ? ((orcamentoAtualMes / orcamentoMes) * 100).toFixed(2) : 0;
    
        const porcentagemNaoNegativa = Math.max(porcentagemMes, 0);
    
        const porcentagemElement = document.getElementById(`porcentagem${mes}`);
        porcentagemElement.innerText = porcentagemNaoNegativa + '%';
    
        if (porcentagemNaoNegativa <= 70) {
          porcentagemElement.style.color = 'green';
        } else if (porcentagemNaoNegativa > 70 && porcentagemNaoNegativa <= 90) {
          porcentagemElement.style.color = 'orange';
        } else {
          porcentagemElement.style.color = 'red';
        }
      }
    }
    
    
    
    function atualizarOrcamento() {
      const orcamentoFormatado = orcamentoTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
      document.getElementById('orcamento').innerText = orcamentoFormatado;
    
      const orcamentoDisponivel = (orcamentoTotal - orcamentoAtual).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
      document.getElementById('orcamentoDisponivel').innerText = orcamentoDisponivel;
    
      Object.keys(orcamentoPorMes).forEach(mes => {
        orcamentoPorMes[mes].orcamentoMes = orcamentoTotal;
        atualizarPorcentagemMes(mes);
      });
      atualizarPorcentagemTotal();
    }

    function atualizarPorcentagemTotal() {
      const porcentagemTotal = ((orcamentoAtual / orcamentoTotal) * 100).toFixed(2);
      document.getElementById('porcentagem').innerText = porcentagemTotal + '%';
    
      const porcentagemFloat = parseFloat(porcentagemTotal);
      const porcentagemElement = document.getElementById('porcentagem');
    
      if (porcentagemFloat <= 70) {
        porcentagemElement.style.color = 'green';
      } else if (porcentagemFloat > 70 && porcentagemFloat <= 90) {
        porcentagemElement.style.color = 'orange';
      } else {
        porcentagemElement.style.color = 'red';
      }
    }
    function salvarDadosLocalStorage() {
      localStorage.setItem('orcamentoTotal', orcamentoTotal);
      localStorage.setItem('orcamentoAtual', orcamentoAtual);
      localStorage.setItem('orcamentoPorMes', JSON.stringify(orcamentoPorMes));
    }

    function calcularDiferencaPorcentagens(mes1, mes2) {
      if (orcamentoPorMes[mes1] && orcamentoPorMes[mes2]) {
        const porcentagemMes1 = (orcamentoPorMes[mes1].orcamentoAtualMes / orcamentoPorMes[mes1].orcamentoMes) * 100;
        const porcentagemMes2 = (orcamentoPorMes[mes2].orcamentoAtualMes / orcamentoPorMes[mes2].orcamentoMes) * 100;
    
        const diferencaPorcentagens = (porcentagemMes2 - porcentagemMes1).toFixed(2);
    
        const itensDiferenca = {};
    
    
        orcamentoPorMes[mes1].itens.forEach(itemMes1 => {
          const nomeItem = itemMes1.nome;
          const valorItemMes1 = itemMes1.valor;
    
       
          const itemMes2 = orcamentoPorMes[mes2].itens.find(item => item.nome === nomeItem);
    
          if (itemMes2) {
       
            const porcentagemItemMes1 = (valorItemMes1 / orcamentoPorMes[mes1].orcamentoMes) * 100;
            const porcentagemItemMes2 = (itemMes2.valor / orcamentoPorMes[mes2].orcamentoMes) * 100;
    
       
            const diferencaItem = (porcentagemItemMes2 - porcentagemItemMes1).toFixed(2);
    
            itensDiferenca[nomeItem] = {
              porcentagemMes1: porcentagemItemMes1.toFixed(2) + '%',
              porcentagemMes2: porcentagemItemMes2.toFixed(2) + '%',
              diferenca: diferencaItem + '%',
              mes1: valorItemMes1.toFixed(2),
              mes2: itemMes2.valor.toFixed(2),
            };
          } else {
            const porcentagemItemMes1 = (valorItemMes1 / orcamentoPorMes[mes1].orcamentoMes) * 100;
    
            itensDiferenca[nomeItem] = {
              porcentagemMes1: porcentagemItemMes1.toFixed(2) + '%',
              porcentagemMes2: '0.00%',
              diferenca: porcentagemItemMes1.toFixed(2) + '%',
              mes1: valorItemMes1.toFixed(2),
              mes2: '0.00',
            };
          }
        });
    
   
        orcamentoPorMes[mes2].itens.forEach(itemMes2 => {
          const nomeItem = itemMes2.nome;
    
        
          if (!itensDiferenca[nomeItem]) {
            const valorItemMes2 = itemMes2.valor;
    
  
            const porcentagemItemMes2 = (valorItemMes2 / orcamentoPorMes[mes2].orcamentoMes) * 100;
    
            itensDiferenca[nomeItem] = {
              porcentagemMes1: '0.00%',
              porcentagemMes2: porcentagemItemMes2.toFixed(2) + '%',
              diferenca: (-porcentagemItemMes2).toFixed(2) + '%',
              mes1: '0.00',
              mes2: valorItemMes2.toFixed(2),
            };
          }
        });
    
        return {
          diferencaPorcentagens: diferencaPorcentagens + '%',
          itensDiferenca: itensDiferenca
        };
      } else {
        return {
          diferencaPorcentagens: '0.00%',
          itensDiferenca: {}
        };
      }
    }
    
    

    function confirmarZerarTudo() {
      const confirmacao = window.confirm("Tem certeza de que deseja apagar todos os dados? Esta ação não pode ser desfeita.");
    
      if (confirmacao) {
        zerarTudo();
      }
    }
    function exibirItensTooltip(mes) {
      const itens = obterItensFormatados(mes);
      document.getElementById('select1').title = `Contas de ${mes}:\n${itens}`;
      document.getElementById('select2').title = `Contas de ${mes}:\n${itens}`;
      document.getElementById('select3').title = `Contas de ${mes}:\n${itens}`;
      document.getElementById('select4').title = `Contas de ${mes}:\n${itens}`;
      document.getElementById('select5').title = `Contas de ${mes}:\n${itens}`;
      document.getElementById('select6').title = `Contas de ${mes}:\n${itens}`;
      document.getElementById('select7').title = `Contas de ${mes}:\n${itens}`;
      document.getElementById('select8').title = `Contas de ${mes}:\n${itens}`;
      document.getElementById('select9').title = `Contas de ${mes}:\n${itens}`;
      document.getElementById('select10').title = `Contas de ${mes}:\n${itens}`;
      document.getElementById('select11').title = `Contas de ${mes}:\n${itens}`;
      document.getElementById('select12').title = `Contas de ${mes}:\n${itens}`;
    }
    
    function obterItensFormatados(mes) {
      if (orcamentoPorMes[mes]) {
        const itens = orcamentoPorMes[mes].itens.map(item => `${item.nome}: ${item.valor.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`).join('\n');
        return itens;
      }
      return 'Nenhum item registrado.';
    }
    
    function zerarTudo() {
      orcamentoTotal = 0;
      orcamentoAtual = 0;
      orcamentoPorMes = {};
    
      Object.keys(orcamentoPorMes).forEach(mes => {
        orcamentoPorMes[mes].itens = [];
        orcamentoPorMes[mes].orcamentoAtualMes = 0;
      });
    
   
      atualizarOrcamento();
      atualizarPorcentagemTotal();
      atualizarOrcamento();
      salvarDadosLocalStorage();
    }



    function exportarParaExcel() {
      const dadosExportacao = prepararDadosParaExportacao();
    
      const ws = XLSX.utils.json_to_sheet(dadosExportacao);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Orçamento');
          XLSX.writeFile(wb, 'orcamento.xlsx');
    }
    
    

    function prepararDadosParaExportacao() {
      const dadosExportacao = [];
      const mesesDoAno = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];
    
      mesesDoAno.forEach(mes => {
        const orcamentoMes = orcamentoPorMes[mes] ? orcamentoPorMes[mes].orcamentoMes : 0;
        const orcamentoAtualMes = orcamentoPorMes[mes] ? orcamentoPorMes[mes].orcamentoAtualMes : 0;
    
        if (orcamentoPorMes[mes] && orcamentoPorMes[mes].itens) {
          orcamentoPorMes[mes].itens.forEach(item => {
            dadosExportacao.push({
              'Orçamento Total': orcamentoMes,
              'Mês': mes,
              'Orçamento usado': orcamentoAtualMes,
              'Item': item.nome,
              'Valor': item.valor
            });
          });
        } else {
          dadosExportacao.push({
            'Orçamento Total': orcamentoMes,
            'Mês': mes,
            'Orçamento usado': orcamentoAtualMes,
            'Item': '',
            'Valor': 0
          });
        }
      });
    
      return dadosExportacao;
    }

    function abrirModalComparacao(conteudo) {
      document.body.classList.add('modal-open');
      const modalComparacao = document.getElementById('modalComparacao');
      modalComparacao.style.display = 'block';
      const conteudoModalComparacao = document.getElementById('conteudoModalComparacao');
      conteudoModalComparacao.innerHTML = conteudo;
    }
    
    function fecharModalComparacao() {
      document.body.classList.remove('modal-open');
      const modalComparacao = document.getElementById('modalComparacao');
      modalComparacao.style.display = 'none';
    }

    function adicionarNovoOrcamento() {
      const novoOrcamentoInput = document.getElementById('novoOrcamento');
      const novoOrcamentoValor = parseFloat(novoOrcamentoInput.value) || 0;
    
      if (isNaN(novoOrcamentoValor) || novoOrcamentoValor < 0) {
        alert("Por favor, insira um valor válido para o novo orçamento.");
        return;
      }
    
      orcamentoTotal = novoOrcamentoValor;
      atualizarOrcamento();
      atualizarPorcentagemTotal();
      atualizarPorcentagemMes(mesSelecionado);
      salvarDadosLocalStorage();
    
  
      fecharModalNovoOrcamento();
    }
    
    function fecharModalNovoOrcamento() {
      const modalNovoOrcamento = document.getElementById('modalNovoOrcamento');
      modalNovoOrcamento.style.display = 'none';
      document.body.classList.remove('modal-open');
      
    }
    
   
    function fecharModalOrca() {
      const modal = document.getElementById('modalNovoOrcamento');
      modal.style.display = 'none';
      
    }