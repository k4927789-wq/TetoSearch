/**
 * SERVIDOR PROXY PARA DESBLOQUEO Y EVITACIÓN DE BLOQUEOS
 * Para eliminar restrinciones regionales y headers anti-iframe (X-Frame-Options),
 * las URLs pasan por un Web Proxy sin guardar registros.
 */
const PROXY_SERVER = "https://api.allorigins.win/raw?url="; 

// ESTADO EN MEMORIA VOLÁTIL (No utiliza localStorage, sessionStorage ni Cookies)
const RAM_STATE = {
  history: [],
  currentIndex: -1
};

// ELEMENTOS DEL DOM
const urlInput = document.getElementById('url-input');
const searchForm = document.getElementById('search-form');
const homeSearchForm = document.getElementById('home-search-form');
const homeSearchInput = document.getElementById('home-search-input');
const webViewport = document.getElementById('web-viewport');
const homeScreen = document.getElementById('home-screen');
const frameWrapper = document.getElementById('frame-wrapper');

const backBtn = document.getElementById('back-btn');
const forwardBtn = document.getElementById('forward-btn');
const reloadBtn = document.getElementById('reload-btn');
const homeBtn = document.getElementById('home-btn');

const historyToggleBtn = document.getElementById('history-toggle-btn');
const historyPanel = document.getElementById('history-panel');
const closeHistoryBtn = document.getElementById('close-history');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history-btn');

// NAVEGACIÓN Y PROCESAMIENTO DE BÚSQUEDAS
function navigate(query) {
  if (!query.trim()) return;

  let targetUrl = "";

  // Validar si es una dirección URL válida o una consulta de búsqueda
  const isUrl = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/.*)?$/i.test(query.trim());

  if (isUrl) {
    targetUrl = query.startsWith('http') ? query : `https://${query}`;
  } else {
    // Búsqueda directa simulando motor de búsqueda sin rastreo
    targetUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  }

  // Cargar mediante proxy para saltar restricciones geográficas y de cabeceras
  const proxiedUrl = PROXY_SERVER + encodeURIComponent(targetUrl);

  // Ocultar pantalla de inicio y mostrar viewport
  homeScreen.classList.add('hidden');
  frameWrapper.classList.remove('hidden');

  webViewport.src = proxiedUrl;
  urlInput.value = targetUrl;

  // Registrar en el historial en memoria RAM
  recordHistory(targetUrl);
}

// CONTROL DE HISTORIAL PRIVADO EN MEMORIA (RAM)
function recordHistory(url) {
  // Cortar ramas futuras si se navega desde un punto intermedio
  if (RAM_STATE.currentIndex < RAM_STATE.history.length - 1) {
    RAM_STATE.history = RAM_STATE.history.slice(0, RAM_STATE.currentIndex + 1);
  }

  RAM_STATE.history.push(url);
  RAM_STATE.currentIndex = RAM_STATE.history.length - 1;

  updateUI();
  renderHistoryUI();
}

function updateUI() {
  backBtn.disabled = RAM_STATE.currentIndex <= 0;
  forwardBtn.disabled = RAM_STATE.currentIndex >= RAM_STATE.history.length - 1;
}

function renderHistoryUI() {
  historyList.innerHTML = "";
  RAM_STATE.history.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${item}`;
    li.addEventListener('click', () => {
      RAM_STATE.currentIndex = index;
      webViewport.src = PROXY_SERVER + encodeURIComponent(item);
      urlInput.value = item;
      updateUI();
    });
    historyList.appendChild(li);
  });
}

// LISTENERS DE EVENTOS
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  navigate(urlInput.value);
});

homeSearchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  navigate(homeSearchInput.value);
});

backBtn.addEventListener('click', () => {
  if (RAM_STATE.currentIndex > 0) {
    RAM_STATE.currentIndex--;
    const previousUrl = RAM_STATE.history[RAM_STATE.currentIndex];
    webViewport.src = PROXY_SERVER + encodeURIComponent(previousUrl);
    urlInput.value = previousUrl;
    updateUI();
  }
});

forwardBtn.addEventListener('click', () => {
  if (RAM_STATE.currentIndex < RAM_STATE.history.length - 1) {
    RAM_STATE.currentIndex++;
    const nextUrl = RAM_STATE.history[RAM_STATE.currentIndex];
    webViewport.src = PROXY_SERVER + encodeURIComponent(nextUrl);
    urlInput.value = nextUrl;
    updateUI();
  }
});

reloadBtn.addEventListener('click', () => {
  if (webViewport.src) {
    webViewport.src = webViewport.src;
  }
});

homeBtn.addEventListener('click', () => {
  frameWrapper.classList.add('hidden');
  homeScreen.classList.remove('hidden');
  urlInput.value = "";
  homeSearchInput.value = "";
});

historyToggleBtn.addEventListener('click', () => {
  historyPanel.classList.toggle('hidden');
});

closeHistoryBtn.addEventListener('click', () => {
  historyPanel.classList.add('hidden');
});

clearHistoryBtn.addEventListener('click', () => {
  RAM_STATE.history = [];
  RAM_STATE.currentIndex = -1;
  renderHistoryUI();
  updateUI();
});

