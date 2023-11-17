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
      orcamentoAtual = 0;
      orcamentoPorMes = {};
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

      if (!orcamentoPorMes[mes]) {
        orcamentoPorMes[mes] = {
          orcamentoMes: orcamentoTotal,
          orcamentoAtualMes: 0,
          itens: []
        };
      }

      atualizarPorcentagemMes(mes);
      document.getElementById('myModal').style.display = 'block';
      document.getElementById('mesSelecionado').innerText = mes;
      exibirItensDoMes(mes);
    }

    function adicionarItem() {
      const item = document.getElementById('item').value;
      let valorRaw = document.getElementById('valor').value;
      valorRaw = valorRaw.replace(/\\/g, '');
      const valor = parseFloat(valorRaw) || 0;

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
        
      } else {
        alert("O valor do item excede o orçamento disponível.");
      }
    }

   /* function atualizarComparacoes() {
      const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
      for (let i = 0; i < meses.length; i++) {
        for (let j = i + 1; j < meses.length; j++) {
          const mes1 = meses[i];
          const mes2 = meses[j];
          const diferenca = calcularDiferencaPorcentagens(mes1, mes2);
    
          const divComparacao = document.getElementById(`comparacao${mes1}${mes2}`);
          if (divComparacao) {
            divComparacao.innerText = `${mes1} - ${mes2}: ${diferenca}%`;
          }
        }
      }
    }
*/
    function compararJaneiroFevereiro() {
      document.getElementById('comparacaoJaneiroFevereiro').innerText = calcularDiferencaPorcentagens('Janeiro', 'Fevereiro') + '%';
    }
    
    function compararFevereiroMarco() {
      document.getElementById('comparacaoFevereiroMarco').innerText = calcularDiferencaPorcentagens('Fevereiro', 'Março') + '%';
    }

    function compararFevereiroMarco() {
      document.getElementById('comparacaoFevereiroMarco').innerText = calcularDiferencaPorcentagens('Fevereiro', 'Março') + '%';
    }

function compararMarcoAbril() {
      document.getElementById('comparacaoMarcoAbril').innerText = calcularDiferencaPorcentagens('Março','Abril') + '%';
    }

function compararAbrilMaio() {
      document.getElementById('comparacaoAbrilMaio').innerText = calcularDiferencaPorcentagens('Abril','Maio') + '%';
    }

function compararMaioJunho() {
      document.getElementById('comparacaoMaioJunho').innerText = calcularDiferencaPorcentagens('Maio','Junho') + '%';
    }

function compararJunhoJulho() {
      document.getElementById('comparacaoJunhoJulho').innerText = calcularDiferencaPorcentagens('Junho','Julho') + '%';
    }

function compararJulhoAgosto() {
      document.getElementById('comparacaoJulhoAgosto').innerText = calcularDiferencaPorcentagens('Julho','Agosto') + '%';
    }

function compararAgostoSetembro() {
      document.getElementById('comparacaoAgostoSetembro').innerText = calcularDiferencaPorcentagens('Agosto','Setembro') + '%';
    }

function compararSetembroOutubro() {
      document.getElementById('comparacaoSetembroOutubro').innerText = calcularDiferencaPorcentagens('Setembro','Outubro') + '%';
    }

function compararOutubroNovembro() {
      document.getElementById('comparacaoOutubroNovembro').innerText = calcularDiferencaPorcentagens('Outubro','Novembro') + '%';
    }
function compararNovembroDezembro() {
      document.getElementById('comparacaoNovembroDezembro').innerText = calcularDiferencaPorcentagens('Novembro','Dezembro') + '%';
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
      
    }

    function atualizarPorcentagemMes(mes) {
      const porcentagemMes = ((orcamentoPorMes[mes].orcamentoAtualMes / orcamentoTotal) * 100).toFixed(2);
      document.getElementById(`porcentagem${mes}`).innerText = porcentagemMes + '%';
    }

    function atualizarOrcamento() {
      const orcamentoFormatado = orcamentoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      document.getElementById('orcamento').innerText = orcamentoFormatado;
      atualizarPorcentagemTotal();
    }

    function atualizarPorcentagemTotal() {
      const porcentagemTotal = ((orcamentoAtual / orcamentoTotal) * 100).toFixed(2);
      document.getElementById('porcentagem').innerText = porcentagemTotal + '%';
    }

    function salvarDadosLocalStorage() {
      localStorage.setItem('orcamentoTotal', orcamentoTotal);
      localStorage.setItem('orcamentoAtual', orcamentoAtual);
      localStorage.setItem('orcamentoPorMes', JSON.stringify(orcamentoPorMes));
    }

    function carregarDadosLocalStorage() {
      orcamentoTotal = parseFloat(localStorage.getItem('orcamentoTotal')) || 0;
      orcamentoAtual = parseFloat(localStorage.getItem('orcamentoAtual')) || 0;
      const orcamentoPorMesString = localStorage.getItem('orcamentoPorMes');
      orcamentoPorMes = orcamentoPorMesString ? JSON.parse(orcamentoPorMesString) : {};
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