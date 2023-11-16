let orcamentoTotal = 0;
    let orcamentoAtual = 0;
    let mesSelecionado = ""; // Adicione a variável global para o mês
    let orcamentoPorMes = {}; // Mapeamento de orçamento por mês
    carregarDadosLocalStorage(); // Adicione esta linha para carregar os dados do localStorage
atualizarOrcamento();
atualizarPorcentagemTotal();
    function adicionarOrcamento() {
      const valor = parseFloat(prompt("Informe o valor do orçamento:")) || 0;
      orcamentoTotal = valor;
      orcamentoAtual = 0;
      orcamentoPorMes = {}; // Zerar o mapeamento de orçamento por mês
      atualizarOrcamento();
      atualizarPorcentagemTotal();
      salvarDadosLocalStorage(); // Adicione esta linha para atualizar a porcentagem do orçamento total
    }

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

    function exibirItensDoMes(mes) {
  const listaItensModal = document.getElementById('listaItensModal');
  listaItensModal.innerHTML = '';

  orcamentoPorMes[mes].itens.forEach(item => {
    const valorFormatado = item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const liModal = document.createElement('li');
    liModal.innerHTML = `${item.nome}: ${valorFormatado} <button onclick="excluirItem('${item.nome}')">Excluir</button>`;
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