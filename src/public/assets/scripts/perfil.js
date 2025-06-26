let usuarios = [];
let usuarioCorrente = {};

// Verifica se há usuário logado ao carregar a página
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
  document.getElementById("nome-usuario").textContent = (usuario.nomecompleto || usuario.login || "").toUpperCase();
  
  const avatarSrc = usuario.foto_perfil || "assets/img/imglogin.png";
  document.getElementById("avatar").src = avatarSrc;
  if (document.getElementById("avatar-topo")) {
    document.getElementById("avatar-topo").src = avatarSrc;
  }

  if (document.getElementById("usuario-nome-topo")) {
    document.getElementById("usuario-nome-topo").textContent = usuario.login || "";
  }

  if (document.getElementById("nomelogin")) {
    document.getElementById("nomelogin").textContent = usuario.login.toUpperCase() || "";
  }
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
  const usuario = usuarios.find(u => u.id === id);
  if (!usuario) return;

  usuarioCorrente = usuario;
  sessionStorage.setItem("usuarioCorrente", JSON.stringify(usuarioCorrente));
  preencherFormulario(usuario);
}

function trocarUsuario() {
  const idSelecionado = parseInt(document.getElementById("usuario-seletor").value, 10);
  carregarPerfilPorId(idSelecionado);
}

function salvarAlteracoes(event) {
  event.preventDefault();

  // Atualiza o objeto com os dados do formulário
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
      usuarioCorrente = data;
      sessionStorage.setItem("usuarioCorrente", JSON.stringify(data));
      preencherFormulario(data);
      alert("Alterações salvas com sucesso! ✈🧡");
    })
    .catch(error => {
      console.error(error);
      alert("Falha ao salvar alterações.");
    });
}



function mudarFotoPorURL() {
  const novaURL = prompt("Digite a URL da nova imagem: ✈🧡");

  if (!novaURL) return;

  usuarioCorrente.foto_perfil = novaURL;

  fetch(`http://localhost:3000/usuarios/${usuarioCorrente.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ foto_perfil: novaURL })
  })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao atualizar imagem.");
      return res.json();
    })
    .then(data => {
      usuarioCorrente = data;
      sessionStorage.setItem("usuarioCorrente", JSON.stringify(data));
      preencherFormulario(data);
      alert("Imagem de perfil atualizada com sucesso! 🧡");
    })
    .catch(err => {
      console.error("Erro ao salvar imagem:", err);
      alert("Erro ao salvar imagem de perfil.");
    });
}