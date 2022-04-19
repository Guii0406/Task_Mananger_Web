window.onload = () => {
  localStorage.clear()
}

function registrar() {
  document.getElementById('registro-bg').style.display = 'flex'
}

function fecharcadastro() {
  document.getElementById('registro-bg').style.display = 'none'
}

function msg() {
  alert('Registrado com sucesso!!')
}

function login() {
  let usuario = document.getElementById('nome').value
  localStorage.setItem('usuario', usuario)
  location.replace('/')
}
