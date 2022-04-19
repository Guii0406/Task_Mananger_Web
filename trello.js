const colunas = {
  Backlog: 'backlog-list',
  AFazer: 'todo-list',
  EmAndamento: 'inprogress-list',
  Aguardando: 'waiting-list',
  EmTeste: 'testing-list',
  Feito: 'done-list',
}

let colunaId = null

window.onload = () => {
  document.getElementById('cancel-btn').onclick = () => {
    fecharModal()
  }

  document.getElementById('edit-cancel-btn').onclick = () => {
    fecharModalDeEdicao()
  }

  document.getElementById('save-btn').onclick = () => {
    salvarTarefa()
  }

  document.getElementById('edit-save-btn').onclick = () => {
    editarTarefa()
  }
}

function salvarTarefa() {
  let nomeDaTarefa = document.getElementById('task-name').value
  let dataDeEntrega = document.getElementById('task-date').value

  if (!éVazioOuNulo(nomeDaTarefa) && !éVazioOuNulo(dataDeEntrega)) {
    let tarefa = gerarTemplate(nomeDaTarefa, dataDeEntrega, colunaId)

    inserirTarefaEmColuna(colunaId, tarefa)
    fecharModal()
  } else {
    alert('Preencha todos os campos')
    document.getElementById('task-name').focus()
  }
}

function editarTarefa() {
  let id = document.getElementById('task-id-edit').value
  let nomeDaTarefa = document.getElementById('task-name-edit').value
  let dataDeEntrega = document.getElementById('task-date-edit').value
  let colunaNova = document.getElementById('task-status-new').value
  let colunaAntiga = document.getElementById('task-status-old').value

  if (!éVazioOuNulo(nomeDaTarefa) && !éVazioOuNulo(dataDeEntrega)) {
    if (colunaNova !== colunaAntiga) {
      let tarefa = gerarTemplate(nomeDaTarefa, dataDeEntrega, colunaNova)
      removerTarefa(id)
      inserirTarefaEmColuna(colunaNova, tarefa)
    } else {
      let tarefa = gerarTemplate(nomeDaTarefa, dataDeEntrega, colunaNova)
      document.getElementById(id).outerHTML = tarefa.conteudo

      document.getElementById(`remove-task-${tarefa.id}`).addEventListener('click', (event) => {
        console.log('tarefa', tarefa)
        event.stopPropagation()
        removerTarefa(tarefa.id)
      })
    }

    fecharModalDeEdicao()
  } else {
    alert('Preencha todos os campos')
    document.getElementById('task-name').focus()
  }
}

function inserirTarefaEmColuna(colunaId, tarefa) {
  document.querySelector(`#${colunaId}`).insertAdjacentHTML('beforeend', tarefa.conteudo)

  document.getElementById(`remove-task-${tarefa.id}`).addEventListener('click', (event) => {
    console.log('tarefa', tarefa)
    event.stopPropagation()
    removerTarefa(tarefa.id)
  })
}

function gerarTemplate(nome, dataOriginal, coluna) {
  let id = Math.random().toString(16).slice(2, 16)
  let atrasado = false

  let data = new Date(dataOriginal)
  let dataAtual = new Date(Date.now())

  let configuracaoData = {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }

  if (data.getFullYear() !== dataAtual.getFullYear()) {
    configuracaoData.year = 'numeric'
  }

  if (data < dataAtual) {
    atrasado = true
  }

  let classe = atrasado ? 'list-item-date-late' : 'list-item-date-ontime'

  return {
    id: id,
    conteudo: `
    <li class='list-item' id="${id}" onclick="abrirModalDeEdicao('${id}', '${nome}', '${dataOriginal}', '${coluna}')">
      <span class="list-item-content">
        <p class='item-name'>${nome}</p>
        <div class="vertical-spacer-sm"></div>
        <span class="list-item-date-info ${classe}">
          <i class="fas fa-clock"></i>
          <p class='item-date'>${data.toLocaleDateString('pt-Br', configuracaoData)}</p>
          <input type="hidden" id="${id}" value="${dataOriginal}"/>
        </span>
      </span>
      <button id="remove-task-${id}">X</button>
    </li>
  `,
  }
}

function abrirModal(id) {
  document.getElementById('form').style.display = 'flex'
  document.getElementById('task-name').focus()
  colunaId = id
}

function fecharModal() {
  document.getElementById('form').style.display = 'none'
  document.getElementById('task-name').value = null
  document.getElementById('task-date').value = null
  colunaId = null
}

function abrirModalDeEdicao(id, nome, dataOriginal, coluna) {
  let date = new Date(dataOriginal)
  var dia = ('0' + date.getUTCDate()).slice(-2)
  var mes = ('0' + (date.getUTCMonth() + 1)).slice(-2)
  var data = date.getUTCFullYear() + '-' + mes + '-' + dia

  document.getElementById('edit-form').style.display = 'flex'
  document.getElementById('task-id-edit').value = id
  document.getElementById('task-name-edit').value = nome
  document.getElementById('task-date-edit').value = data
  document.getElementById('task-status-new').value = coluna
  document.getElementById('task-status-old').value = coluna
  document.getElementById('task-name-edit').focus()
}

function fecharModalDeEdicao() {
  document.getElementById('edit-form').style.display = 'none'
  document.getElementById('task-name-edit').value = null
  document.getElementById('task-date-edit').value = null
  document.getElementById('task-status-new').value = null
  document.getElementById('task-status-old').value = null
  colunaId = null
}

function removerTarefa(id) {
  let tarefa = document.getElementById(id)
  tarefa.remove()
}

function éVazioOuNulo(valor) {
  return !valor || 0 === valor.length
}
