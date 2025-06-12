function alternarFavorito(idCidade) {
    const usuarioCorrente = JSON.parse(sessionStorage.getItem('usuarioCorrente'));
    if (!usuarioCorrente) {
        alert("Você precisa estar logado.");
        return;
    }

    const userId = usuarioCorrente.id;
    let favoritos = usuarioCorrente.favoritos || [];

    const index = favoritos.indexOf(idCidade);
    if (index === -1) {
        // Não está nos favoritos → adiciona
        favoritos.push(idCidade);
    } else {
        // Está nos favoritos → remove
        favoritos.splice(index, 1);
    }

    // Atualiza no servidor
    fetch(`http://localhost:3000/usuarios/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                favoritos
            })
        })
        .then(res => {
            if (!res.ok) throw new Error("Erro ao atualizar favoritos.");
            return res.json();
        })
        .then(() => {
            usuarioCorrente.favoritos = favoritos;
            sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrente));

            const btn = document.getElementById(`fav-${idCidade}`);
            if (favoritos.includes(idCidade)) {
                btn.classList.remove('btn-outline-danger');
                btn.classList.add('btn-danger');
                btn.innerText = "Nos Favoritos ";
            } else {
                btn.classList.remove('btn-danger');
                btn.classList.add('btn-outline-danger');
                btn.innerText = "Favoritar ";
            }
        })
        .catch(err => {
            console.error(err);
            alert("Erro ao atualizar favoritos.");
        });
};
