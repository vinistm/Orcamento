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
      if (!orcamentoPorMes[mes]) {
        orcamentoPorMes[mes] = {
          orcamentoMes: orcamentoTotal,
          orcamentoAtualMes: 0,
          itens: []
        };
      }

      atualizarPorcentagemMes(mes);
      exibirItensDoMes(mes);
    }

    function adicionarItem() {
      const item = document.getElementById('item').value;
      let valorRaw = document.getElementById('valor').value;
    
      // Remova caracteres não numéricos do valor
      valorRaw = valorRaw.replace(/[^\d.,-]/g, '');
    
      // Substitua vírgulas por pontos para garantir a formatação correta como número
      valorRaw = valorRaw.replace(',', '.');
    
      // Parse do valor para um número
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
        orcamentoPorMes[mesSelecionado].itens.push({ nome: item, valor });
        document.getElementById('item').value = '';
        document.getElementById('valor').value = '';
    
        exibirItensDoMes(mesSelecionado);
        atualizarPorcentagemMes(mesSelecionado);
        atualizarPorcentagemTotal();
        salvarItensLocalStorage();
        salvarDadosLocalStorage();
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
    
      // Carregue os itens do armazenamento local
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
        // Atualize os itens do mês com os itens salvos
        orcamentoPorMes[mes].itens = itensPorMes[mes].itens;
      });
    
      // Certifique-se de que o orçamento atual não seja negativo
      if (orcamentoAtual < 0) {
        orcamentoAtual = 0;
      }
    
      // Atualize a porcentagem total
      atualizarPorcentagemTotal();
    }

    function compararMesesSelecionados() {
      const mes1 = document.getElementById('mes1').value;
      const mes2 = document.getElementById('mes2').value;
    
      const resultadoComparacao = calcularDiferencaPorcentagens(mes1, mes2);
      document.getElementById('resultadoComparacao').innerText = resultadoComparacao + '%';
    }
    
  

    function exibirItensDoMes(mes) {
      const listaItensModal = document.getElementById('listaItensModal');
      listaItensModal.innerHTML = '';

      const orcamentoMes = orcamentoPorMes[mes].orcamentoMes;

      orcamentoPorMes[mes].itens.forEach(item => {
        const valorFormatado = item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const porcentagemItem = ((item.valor / orcamentoMes) * 100).toFixed(2);

        const liModal = document.createElement('li');
        liModal.innerHTML = `${item.nome}: ${valorFormatado} (${porcentagemItem}%) <button onclick="excluirItem('${item.nome}')">Excluir</button>`;
        listaItensModal.appendChild(liModal);
      });
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
        // Oculta as porcentagens definindo o texto como '0%'
        meses.forEach(mes => {
          document.getElementById(`porcentagem${mes}`).innerText = '0%';
        });
        btnMostrarPorcentagens.innerText = 'Mostrar ';
      }
    }
    

    function fecharModal() {
      document.getElementById('myModal').style.display = 'none';
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
        const porcentagemMes = ((orcamentoPorMes[mes].orcamentoAtualMes / orcamentoTotal) * 100).toFixed(2);
        document.getElementById(`porcentagem${mes}`).innerText = porcentagemMes + '%';
      }
    }
    function atualizarOrcamento() {
      const orcamentoFormatado = orcamentoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      document.getElementById('orcamento').innerText = orcamentoFormatado;
    
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
      // Exibe uma caixa de diálogo de confirmação
      const confirmacao = window.confirm("Tem certeza de que deseja apagar todos os dados? Esta ação não pode ser desfeita.");
    
      // Se o usuário clicar em "OK" (true), então zere tudo
      if (confirmacao) {
        zerarTudo();
      }
    }
    
    function zerarTudo() {
      // Reinicialize as variáveis
      orcamentoTotal = 0;
      orcamentoAtual = 0;
      orcamentoPorMes = {};
    
      // Atualize a exibição no site
      atualizarOrcamento();
      atualizarPorcentagemTotal();
    
      // Salve os dados atualizados no armazenamento local
      salvarDadosLocalStorage();
    }
