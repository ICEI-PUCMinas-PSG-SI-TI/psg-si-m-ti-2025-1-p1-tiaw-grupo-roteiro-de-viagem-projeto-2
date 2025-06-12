window.addEventListener("DOMContentLoaded", () => {
            const nomelogin = document.getElementById("nomelogin");
            const usuarioSalvo = sessionStorage.getItem("usuarioCorrente");

            if (usuarioSalvo) {
                const usuario = JSON.parse(usuarioSalvo);
                nomelogin.textContent = usuario.login || usuario.nomecompleto || "Usuário";
                nomelogin.style.cursor = "pointer";
                nomelogin.removeEventListener('click', irparaLogin);
                nomelogin.addEventListener('click', irparaPerfil);
            } else {
                nomelogin.textContent = "LOGIN";
                nomelogin.style.cursor = "pointer";
                nomelogin.addEventListener('click', irparaLogin);
            }
        });

        function irparaLogin() {
            window.location.href = "login.html";
        }
        function irparaPerfil(){
            window.location.href = "PerfilUsuario.html";
        }