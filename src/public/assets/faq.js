const API_URL = "http://localhost:3000/faqs";
let faqs = [];
let paginaAtual = 1;
const porPagina = 5;

async function carregarFAQs() {
  const res = await fetch(API_URL);
  const data = await res.json();
  faqs = data.faqs || data;
  mostrarFAQs();
}

function mostrarFAQs() {
  const inicio = (paginaAtual - 1) * porPagina;
  const pagina = faqs.slice(inicio, inicio + porPagina);

  const container = document.getElementById('faqAccordion');
  container.innerHTML = '';

  pagina.forEach((faq, i) => {
    container.innerHTML += `
      <div class="accordion-item mb-2">
        <h2 class="accordion-header" id="heading${i}">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${i}">
            ${faq.pergunta}
          </button>
        </h2>
        <div id="collapse${i}" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
          <div class="accordion-body">${faq.resposta}</div>
        </div>
      </div>
    `;
  });

  atualizarPaginacao();
}

function atualizarPaginacao() {
  const totalPaginas = Math.ceil(faqs.length / porPagina);
  const paginacao = document.getElementById("paginacao");
  paginacao.innerHTML = `
    <button class="btn paginaçao mx-1" ${paginaAtual === 1 ? 'disabled' : ''} onclick="mudarPagina(${paginaAtual - 1})">&laquo;</button>
    <span class="mx-2 align-middle">Página ${paginaAtual} de ${totalPaginas}</span>
    <button class="btn paginaçao mx-1" ${paginaAtual === totalPaginas ? 'disabled' : ''} onclick="mudarPagina(${paginaAtual + 1})">&raquo;</button>
  `;
}

function mudarPagina(novaPagina) {
  paginaAtual = novaPagina;
  mostrarFAQs();
}

function adicionarPergunta() {
  const input = document.getElementById("pergunta-input");
  const texto = input.value.trim();
  if (texto) {
    const nova = {
      pergunta: texto,
      resposta: "Obrigado pela sua pergunta! Em breve iremos analisar e responder."
    };
    faqs.push(nova);
    paginaAtual = Math.ceil(faqs.length / porPagina);
    mostrarFAQs();
    input.value = "";
  }
}

carregarFAQs();
