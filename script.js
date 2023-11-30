let orcamentoTotal = 0;
    let orcamentoAtual = 0;
    let mesSelecionado = "";
    let orcamentoPorMes = {};

    carregarDadosLocalStorage();
    atualizarOrcamento();
    atualizarPorcentagemTotal();
    adicionarEventosInput();

    function adicionarOrcamento() {
      const valor = parseFloat(prompt("Informe o valor do orçamento:")) || 0;
      orcamentoTotal = valor;
      atualizarOrcamento();
      atualizarPorcentagemTotal();
      
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
    
      const resultadoComparacao = calcularDiferencaPorcentagens(mes1, mes2);
      document.getElementById('resultadoComparacao').innerText = resultadoComparacao + '%';
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
        return diferencaPorcentagens;
      } else {
        return 0;
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
    
    
      // Atualize a exibição no site
      atualizarOrcamento();
      atualizarPorcentagemTotal();
      atualizarOrcamento();
      // Salve os dados atualizados no armazenamento local
      salvarDadosLocalStorage();
    }

 