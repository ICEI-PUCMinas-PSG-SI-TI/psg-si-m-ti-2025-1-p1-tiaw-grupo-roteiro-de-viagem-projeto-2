let usuarios = [];
let usuarioAtual = {};

async function carregarPerfis() {
  try {
    const res = await fetch("http://localhost:3000/usuarios");
    usuarios = await res.json();

    preencherDropdownUsuarios();
    if (usuarios.length > 0) {
      carregarPerfilPorId(usuarios[0].id);
    }
  } catch (err) {
    console.error("Erro ao carregar perfis:", err);
  }
}

function preencherDropdownUsuarios() {
  const lista = document.getElementById("listaUsuarios");
  lista.innerHTML = '';

  usuarios.forEach(user => {
    const item = document.createElement("li");
    item.innerHTML = `
      <a class="dropdown-item" href="#" onclick="carregarPerfilPorId(${user.id})">
        ${user.nome_abrev} (ID ${user.id})
      </a>
    `;
    lista.appendChild(item);
  });
}

async function carregarPerfilPorId(id) {
  try {
    const res = await fetch(`http://localhost:3000/usuarios/${id}`);
    const usuario = await res.json();

    if (!usuario) return;
    usuarioAtual = usuario;

    document.getElementById("nome").value = usuario.nome;
    document.getElementById("sobrenome").value = usuario.sobrenome;
    document.getElementById("email").value = usuario.email;
    document.getElementById("senha").value = usuario.senha || '';

    document.getElementById("nome-usuario").textContent = usuario.nome.toUpperCase();
    document.getElementById("usuario-nome-topo").textContent = usuario.nome_abrev;
    document.getElementById("avatar").src = usuario.foto_perfil;
    document.getElementById("avatar-topo").src = usuario.foto_perfil;
  } catch (err) {
    console.error("Erro ao carregar usuário por ID:", err);
  }
}

async function salvarAlteracoes(event) {
  event.preventDefault();
  if (!usuarioAtual) return;

  // Atualizar objeto local
  usuarioAtual.nome = document.getElementById("nome").value;
  usuarioAtual.sobrenome = document.getElementById("sobrenome").value;
  usuarioAtual.email = document.getElementById("email").value;
  usuarioAtual.senha = document.getElementById("senha").value;

  try {
    await fetch(`http://localhost:3000/usuarios/${usuarioAtual.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuarioAtual)
    });

    document.getElementById("nome-usuario").textContent = usuarioAtual.nome.toUpperCase();
    document.getElementById("usuario-nome-topo").textContent = usuarioAtual.nome_abrev;

    alert("Alterações salvas! ✈️🧡");
  } catch (err) {
    console.error("Erro ao salvar alterações:", err);
    alert("Erro ao salvar alterações.");
  }
}

function sairConta() {
  localStorage.removeItem("usuarioAtual");
  usuarioAtual = null;
  window.location.href = "login.html";
}
