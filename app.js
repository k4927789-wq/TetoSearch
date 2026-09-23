// MEMORIA RAM VOLÁTIL (Sin guardado en el disco de la computadora)
const MEMORIA_RAM = [];

// DOM
const searchForm = document.getElementById('teto-search-form');
const mainInput = document.getElementById('main-search-input');
const searchView = document.getElementById('search-view');
const resultsView = document.getElementById('results-view');
const resultsContent = document.getElementById('results-content');
const navUrlInput = document.getElementById('nav-url-input');

const btnHome = document.getElementById('btn-home');
const btnPanic = document.getElementById('btn-panic');
const btnRamHistory = document.getElementById('btn-ram-history');
const historyModal = document.getElementById('history-modal');
const closeHistory = document.getElementById('close-history');
const historyUl = document.getElementById('history-ul');
const btnPurgeRam = document.getElementById('btn-purge-ram');

// EJECUTAR BÚSQUEDA PRIVADA REAL
async function ejecutarBusqueda(query) {
  if (!query.trim()) return;

  // Registrar en memoria RAM
  MEMORIA_RAM.push(query);
  actualizarHistorialUI();

  searchView.classList.add('hidden');
  resultsView.classList.remove('hidden');
  navUrlInput.value = query;

  resultsContent.innerHTML = `<p style="color:var(--teto-pink)">Buscando resultados en tiempo real para: <b>${query}</b>...</p>`;

  try {
    // API libre de búsquedas para evitar el error de iframe triste
    const res = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&pretty=1`);
    const data = await res.json();

    resultsContent.innerHTML = "";

    if (data.AbstractText) {
      resultsContent.innerHTML += `
        <div class="result-card">
          <a href="${data.AbstractURL}" target="_blank" rel="noreferrer">${data.Heading}</a>
          <p>${data.AbstractText}</p>
        </div>
      `;
    }

    if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      data.RelatedTopics.forEach(topic => {
        if (topic.Text && topic.FirstURL) {
          resultsContent.innerHTML += `
            <div class="result-card">
              <a href="${topic.FirstURL}" target="_blank" rel="noreferrer">${topic.Text.split(' - ')[0] || 'Resultado'}</a>
              <p>${topic.Text}</p>
            </div>
          `;
        }
      });
    } else if (!data.AbstractText) {
      resultsContent.innerHTML = `
        <div class="result-card">
          <p>No se encontraron resultados directos API. <a href="https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}" target="_blank" rel="noreferrer">Haz clic aquí para abrir los resultados completos en pestaña privada</a></p>
        </div>
      `;
    }
  } catch (error) {
    resultsContent.innerHTML = `<p style="color:red">Error al consultar la red. Intenta de nuevo.</p>`;
  }
}

// MANEJO DE HISTORIAL EN MEMORIA RAM
function actualizarHistorialUI() {
  historyUl.innerHTML = "";
  MEMORIA_RAM.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${item}`;
    historyUl.appendChild(li);
  });
}

function limpiarTodoEnRAM() {
  MEMORIA_RAM.length = 0;
  actualizarHistorialUI();
  mainInput.value = "";
  navUrlInput.value = "";
  resultsContent.innerHTML = "";
  resultsView.classList.add('hidden');
  historyModal.classList.add('hidden');
  searchView.classList.remove('hidden');
  alert("TetoSearch: ¡Toda la memoria RAM ha sido destruida!");
}

// EVENTOS
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  ejecutarBusqueda(mainInput.value);
});

btnHome.addEventListener('click', () => {
  resultsView.classList.add('hidden');
  searchView.classList.remove('hidden');
});

btnRamHistory.addEventListener('click', () => historyModal.classList.remove('hidden'));
closeHistory.addEventListener('click', () => historyModal.classList.add('hidden'));
btnPanic.addEventListener('click', limpiarTodoEnRAM);
btnPurgeRam.addEventListener('click', limpiarTodoEnRAM);

