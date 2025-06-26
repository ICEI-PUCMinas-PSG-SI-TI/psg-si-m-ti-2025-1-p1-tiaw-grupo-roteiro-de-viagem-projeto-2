window.addEventListener("DOMContentLoaded", async () => {
  const nomelogin = document.getElementById("nomelogin");
  const painelLink = document.getElementById("painellink");
  const nomeusuario = document.getElementById("nomeUsuarioComentario");
  const darkToggle = document.getElementById("darkModeToggle");
  const usuarioSalvo = sessionStorage.getItem("usuarioCorrente");

  // Limpa qualquer tema ativo antes de aplicar o do usuário atual
  document.body.classList.remove("dark-mode");
  if (darkToggle) darkToggle.checked = false;

  if (!usuarioSalvo) {
    nomelogin.textContent = "LOGIN";
    nomelogin.style.cursor = "pointer";
    nomelogin.onclick = irparaLogin;
    if (painelLink) painelLink.style.display = "none";
    return;
  }

  const usuario = JSON.parse(usuarioSalvo);
  const login = (usuario.login || "").toLowerCase();

  nomelogin.textContent = login.toUpperCase();
  nomelogin.style.cursor = "pointer";
  nomelogin.removeEventListener('click', irparaLogin);
  nomelogin.addEventListener('click', irparaPerfil);
  if (nomeusuario) nomeusuario.textContent = login.toUpperCase();
  if (usuario.admin === false && painelLink) painelLink.style.display = "none";

  try {
    const res = await fetch(`http://localhost:3000/userPreferences?login=${login}`);
    const prefs = await res.json();
    let prefUsuario = prefs[0];

    // // Aplica tema salvo do usuário
    // if (prefUsuario?.theme === "dark") {
    //   document.body.classList.add("dark-mode");
    //   if (darkToggle) darkToggle.checked = true;
    // } else {
    //   document.body.classList.remove("dark-mode");
    //   if (darkToggle) darkToggle.checked = false;
    // }

    // // Remove event listeners antigos para não acumular
    // if (darkToggle) {
    //   const novoToggle = darkToggle.cloneNode(true);
    //   darkToggle.parentNode.replaceChild(novoToggle, darkToggle);

    //   novoToggle.addEventListener("change", async () => {
    //     const novoTema = novoToggle.checked ? "dark" : "light";
    //     document.body.classList.toggle("dark-mode", novoToggle.checked);

    //     if (prefUsuario) {
    //       await fetch(`http://localhost:3000/userPreferences/${prefUsuario.id}`, {
    //         method: "PUT",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({
    //           id: prefUsuario.id,
    //           login: login,
    //           theme: novoTema
    //         }),
    //       });
    //     } else {
    //       const novaPrefResponse = await fetch(`http://localhost:3000/userPreferences`, {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({
    //           login: login,
    //           theme: novoTema
    //         }),
    //       });
    //       const novaPrefJson = await novaPrefResponse.json();
    //       prefUsuario = novaPrefJson;
    //     }
    //   });
    // }

  } catch (error) {
    console.error("Erro ao carregar preferências do usuário:", error);
  }
});

function irparaLogin() {
  window.location.href = "login.html";
}

function irparaPerfil() {
  window.location.href = "PerfilUsuario.html";
}
