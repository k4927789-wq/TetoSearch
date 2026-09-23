/**
 * ESTADO EN MEMORIA RAM
 * No guarda datos en localStorage, sessionStorage ni Cookies de la computadora.
 */
const MEMORIA_TETO = {
  historial: [],
  posicion: -1
};

// DOM
const tetoHome = document.getElementById('teto-home');
const browserView = document.getElementById('browser-view');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const btnSearch = document.getElementById('btn-search');
const btnPanic = document.getElementById('btn-panic');

const webViewport = document.getElementById('web-viewport');
const browserUrlInput = document.getElementById('browser-url-input');

const btnBack = document.getElementById('btn-back');
const btnForward = document.getElementById('btn-forward');
const btnReload = document.getElementById('btn-reload');
const btnHome = document.getElementById('btn-home');

const historyPanel = document.getElementById('history-panel');
const openHistoryBtn = document.getElementById('open-history-btn');
const closeHistoryBtn = document.getElementById('close-history-btn');
const btnToggleHistory = document.getElementById('btn-toggle-history');
const historyList = document.getElementById('history-list');
const clearHistoryNow = document.getElementById('clear-history-now');

// MOTOR DE BÚSQUEDA REAL SIN BLOQUEO EN BLANCO
function procesarBusqueda(consulta) {
  if (!consulta.trim()) return;

  let urlDestino = "";
  const esUrlValida = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/.*)?$/i.test(consulta.trim());

  if (esUrlValida) {
    urlDestino = consulta.startsWith('http') ? consulta : `https://${consulta}`;
  } else {
    // Motor optimizado en HTML ligero que NO se bloquea en iframe
    urlDestino = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(consulta)}`;
  }

  // Cargar url
  tetoHome.classList.add('hidden');
  browserView.classList.remove('hidden');

  webViewport.src = urlDestino;
  browserUrlInput.value = urlDestino;

  guardarEnHistorialRAM(urlDestino);
}

// GUARDAR HISTORIAL SOLO EN MEMORIA RAM
function guardarEnHistorialRAM(url) {
  if (MEMORIA_TETO.posicion < MEMORIA_TETO.historial.length - 1) {
    MEMORIA_TETO.historial = MEMORIA_TETO.historial.slice(0, MEMORIA_TETO.posicion + 1);
  }

  MEMORIA_TETO.historial.push(url);
  MEMORIA_TETO.posicion = MEMORIA_TETO.historial.length - 1;

  actualizarListaHistorialUI();
}

function actualizarListaHistorialUI() {
  historyList.innerHTML = "";
  MEMORIA_TETO.historial.forEach((url, i) => {
    const li = document.createElement('li');
    li.textContent = `${i + 1}. ${url}`;
    li.onclick = () => {
      MEMORIA_TETO.posicion = i;
      webViewport.src = url;
      browserUrlInput.value = url;
    };
    historyList.appendChild(li);
  });
}

// BOTÓN DE PÁNICO (BORRA TODO DE LA RAM)
function destruccionPrivada() {
  MEMORIA_TETO.historial = [];
  MEMORIA_TETO.posicion = -1;
  historyList.innerHTML = "";
  webViewport.src = "about:blank";
  searchInput.value = "";
  browserUrlInput.value = "";
  
  browserView.classList.add('hidden');
  historyPanel.classList.add('hidden');
  tetoHome.classList.remove('hidden');
  
  alert("TetoSearch: ¡Historial y datos en memoria RAM eliminados!");
}

// LISTENERS
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  procesarBusqueda(searchInput.value);
});

btnSearch.addEventListener('click', () => {
  procesarBusqueda(searchInput.value);
});

browserUrlInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    procesarBusqueda(browserUrlInput.value);
  }
});

btnHome.addEventListener('click', () => {
  browserView.classList.add('hidden');
  tetoHome.classList.remove('hidden');
});

btnReload.addEventListener('click', () => {
  if (webViewport.src) webViewport.src = webViewport.src;
});

btnBack.addEventListener('click', () => {
  if (MEMORIA_TETO.posicion > 0) {
    MEMORIA_TETO.posicion--;
    const url = MEMORIA_TETO.historial[MEMORIA_TETO.posicion];
    webViewport.src = url;
    browserUrlInput.value = url;
  }
});

btnForward.addEventListener('click', () => {
  if (MEMORIA_TETO.posicion < MEMORIA_TETO.historial.length - 1) {
    MEMORIA_TETO.posicion++;
    const url = MEMORIA_TETO.historial[MEMORIA_TETO.posicion];
    webViewport.src = url;
    browserUrlInput.value = url;
  }
});

openHistoryBtn.addEventListener('click', () => historyPanel.classList.remove('hidden'));
btnToggleHistory.addEventListener('click', () => historyPanel.classList.toggle('hidden'));
closeHistoryBtn.addEventListener('click', () => historyPanel.classList.add('hidden'));
clearHistoryNow.addEventListener('click', destruccionPrivada);
btnPanic.addEventListener('click', destruccionPrivada);

