let usuarios = [];
let usuarioCorrente = {};

if (!sessionStorage.getItem("usuarioCorrente")) {
  window.location.href = "login.html";
}

function carregarPerfis() {
  const usuarioSalvo = sessionStorage.getItem("usuarioCorrente");
  if (!usuarioSalvo) {
    window.location.href = "login.html";
    return;
  }

  const usuarioId = JSON.parse(usuarioSalvo).id;

  fetch(`http://localhost:3000/usuarios/${usuarioId}`)
    .then(res => res.json())
    .then(usuario => {
      usuarioCorrente = usuario;
      preencherFormulario(usuario);
    })
    .catch(err => {
      console.error("Erro ao carregar perfil:", err);
      alert("Não foi possível carregar seu perfil.");
    });
}

function preencherFormulario(usuario) {
  document.getElementById("login").value = usuario.login || "";
  document.getElementById("nomecompleto").value = usuario.nomecompleto || "";
  document.getElementById("email").value = usuario.email || "";
  document.getElementById("senha").value = usuario.senha || "";
  document.getElementById("nome-usuario").textContent = (usuario.nomecompleto || usuario.login).toUpperCase();
  document.getElementById("usuario-nome-topo").textContent = usuario.login || "";
  document.getElementById("avatar").src = usuario.foto_perfil || "assets/img/imglogin.png";
  document.getElementById("avatar-topo").src = usuario.foto_perfil || "assets/img/imglogin.png";
}

function preencherDropdownUsuarios() {
  const lista = document.getElementById("listaUsuarios");
  lista.innerHTML = '';

  usuarios.forEach(user => {
    const nomeExibir = user.nomecompleto || user.nome || user.login;
    const item = document.createElement("li");
    item.innerHTML = `
      <a class="dropdown-item" href="#" onclick="carregarPerfilPorId(${user.id})">
        ${nomeExibir} (ID ${user.id})
      </a>
    `;
    lista.appendChild(item);
  });
}

function carregarPerfilPorId(id) {
  const usuario = usuarios.find(u => u.id == id);
  if (!usuario) return;

  usuarioCorrente = usuario;
  sessionStorage.setItem("usuarioCorrente", JSON.stringify(usuario));

  document.getElementById("login").value = usuario.login;
  document.getElementById("nomecompleto").value = usuario.nomecompleto;
  document.getElementById("email").value = usuario.email;
  document.getElementById("senha").value = usuario.senha || "";
  document.getElementById("nome-usuario").textContent = (usuario.nomecompleto || usuario.nome || usuario.login).toUpperCase();
  document.getElementById("usuario-nome-topo").textContent = usuario.login;
  document.getElementById("avatar").src = usuario.foto_perfil;
  document.getElementById("avatar-topo").src = usuario.foto_perfil;
}

function trocarUsuario() {
  const idSelecionado = parseInt(document.getElementById("usuario-seletor").value);
  carregarPerfilPorId(idSelecionado);
}

function salvarAlteracoes(event) {
  event.preventDefault();

  usuarioCorrente.login = document.getElementById("login").value;
  usuarioCorrente.nomecompleto = document.getElementById("nomecompleto").value;
  usuarioCorrente.email = document.getElementById("email").value;
  usuarioCorrente.senha = document.getElementById("senha").value;

  fetch(`http://localhost:3000/usuarios/${usuarioCorrente.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(usuarioCorrente)
  })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao salvar no servidor.");
      return res.json();
    })
    .then(data => {
      document.getElementById("usuario-nome-topo").textContent = data.login;
      document.getElementById("nome-usuario").textContent = data.login.toUpperCase();
      sessionStorage.setItem("usuarioCorrente", JSON.stringify(data));

      const nomelogin = document.getElementById("nomelogin");
      if (nomelogin) nomelogin.textContent = data.login;

      alert("Alterações salvas com sucesso! ✈️🧡");
    })
    .catch(error => {
      console.error(error);
      alert("Falha ao salvar alterações.");
    });
}

function sairConta() {
  sessionStorage.removeItem("usuarioCorrente");
  usuarioCorrente = null;

  document.getElementById("login").value = "";
  document.getElementById("nomecompleto").value = "";
  document.getElementById("email").value = "";
  document.getElementById("senha").value = "";

  document.getElementById("nome-usuario").textContent = "";
  document.getElementById("usuario-nome-topo").textContent = "";
  document.getElementById("avatar").src = "assets/img/imglogin.png";
  document.getElementById("avatar-topo").src = "assets/img/imglogin.png";

  alert("Você saiu da conta.");
  window.location.href = "index.html";
}

//mudar imagem
function mudarFotoPorURL() {
  const novaURL = prompt("Digite a URL da nova imagem: ✈️🧡");

  if (!novaURL) return;

  document.getElementById("avatar").src = novaURL;
  document.getElementById("avatar-topo").src = novaURL;

  usuarioCorrente.foto_perfil = novaURL;

  fetch(`http://localhost:3000/usuarios/${usuarioCorrente.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ foto_perfil: novaURL }),
  })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao atualizar imagem.");
      return res.json();
    })
    .then(data => {
      sessionStorage.setItem("usuarioCorrente", JSON.stringify(data));
      alert("Imagem de perfil atualizada com sucesso! 🧡");
    })
    .catch(err => {
      console.error("Erro ao salvar imagem:", err);
      alert("Erro ao salvar imagem de perfil.");
    });
}
