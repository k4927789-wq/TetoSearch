// Limpieza contra mutaciones no deseadas causadas por extensiones
document.addEventListener('DOMContentLoaded', () => {
    // Desactivar autocompletados agresivos de extensiones de terceros
    const inputs = document.querySelectorAll('.ts-field');
    inputs.forEach(input => {
        input.setAttribute('data-lpignore', 'true'); // Ignora LastPass
        input.setAttribute('data-form-type', 'other');
    });
});

function executeSearch(source) {
    const inputId = source === 'home' ? 'ts-home-query' : 'ts-results-query';
    const query = document.getElementById(inputId).value.trim();

    if (!query) return;

    document.getElementById('ts-home-query').value = query;
    document.getElementById('ts-results-query').value = query;

    document.getElementById('ts-home-view').style.setProperty('display', 'none', 'important');
    document.getElementById('ts-results-view').style.setProperty('display', 'block', 'important');

    renderResults(query);
}

function handleKeyPress(event, source) {
    if (event.key === 'Enter') {
        executeSearch(source);
    }
}

function goHome() {
    document.getElementById('ts-results-view').style.setProperty('display', 'none', 'important');
    document.getElementById('ts-home-view').style.setProperty('display', 'flex', 'important');
    document.getElementById('ts-home-query').value = '';
}

function renderResults(query) {
    const stats = document.getElementById('ts-stats-counter');
    const list = document.getElementById('ts-feed-list');
    
    const startTime = performance.now();

    const mockData = [
        {
            site: "https://es.wikipedia.org › wiki › " + encodeURIComponent(query),
            title: query + " - Wikipedia, la enciclopedia libre",
            snippet: `Información completa, historia y detalles acerca de "${query}". Explora datos verificados, referenciados y actualizados por la comunidad global.`
        },
        {
            site: "https://www.youtube.com › results?search_query=" + encodeURIComponent(query),
            title: query + " - Videos e información en directo",
            snippet: `Encuentra los videos más populares, tutoriales y coberturas recientes sobre "${query}" en alta definición.`
        },
        {
            site: "https://news.google.com › search?q=" + encodeURIComponent(query),
            title: "Últimas noticias sobre " + query,
            snippet: `Titulares actualizados, análisis y reportajes sobre los acontecimientos más recientes relacionados con "${query}".`
        }
    ];

    const endTime = performance.now();
    const timeTaken = ((endTime - startTime) / 1000).toFixed(2);

    stats.innerHTML = `Aproximadamente 3,420,000 resultados (${timeTaken} segundos)`;

    list.innerHTML = mockData.map(item => `
        <article class="ts-item-card">
            <span class="ts-item-site">${item.site}</span>
            <a href="${item.site}" target="_blank" rel="noopener noreferrer" class="ts-item-title">${item.title}</a>
            <p class="ts-item-desc">${item.snippet}</p>
        </article>
    `).join('');
}

function switchTab(element) {
    document.querySelectorAll('.ts-tab').forEach(tab => tab.classList.remove('ts-tab-active'));
    element.classList.add('ts-tab-active');
}

function startVoiceSearch() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'es-ES';

        recognition.onstart = function() {
            document.getElementById('ts-home-query').placeholder = "Escuchando...";
        };

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.getElementById('ts-home-query').value = transcript;
            executeSearch('home');
        };

        recognition.onend = function() {
            document.getElementById('ts-home-query').placeholder = "Buscar en TetoSearch...";
        };

        recognition.start();
    } else {
        alert("La búsqueda por voz no está soportada en este navegador.");
    }
}

function luckySearch() {
    const query = document.getElementById('ts-home-query').value.trim();
    if (query) {
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}&btnI`;
    } else {
        alert("Escribe algo en la barra antes de probar suerte.");
    }
}

