document.getElementById('search-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const query = document.getElementById('search-input').value.trim();
  const resultsContainer = document.getElementById('results');
  
  if (!query) return;

  resultsContainer.innerHTML = '<p>Buscando resultados...</p>';

  // Uso de JSONP para obtener respuesta de DuckDuckGo evitando errores de CORS
  const script = document.createElement('script');
  script.src = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&callback=handleResults`;
  document.body.appendChild(script);
});

// Función global que recibe la respuesta del servidor
function handleResults(data) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = '';

  const results = [];

  // Recopilar respuesta principal si existe
  if (data.AbstractText && data.AbstractURL) {
    results.push({
      title: data.Heading,
      text: data.AbstractText,
      url: data.AbstractURL
    });
  }

  // Recopilar temas relacionados (RelatedTopics)
  if (data.RelatedTopics && data.RelatedTopics.length > 0) {
    data.RelatedTopics.forEach(item => {
      if (item.Text && item.FirstURL) {
        results.push({
          title: item.Text,
          text: item.Text,
          url: item.FirstURL
        });
      }
    });
  }

  // Mostrar resultados o mensaje de no encontrado
  if (results.length === 0) {
    resultsContainer.innerHTML = '<p>No se encontraron resultados inmediatos. Puedes intentar buscar directamente en la web.</p>';
    return;
  }

  results.forEach(item => {
    const div = document.createElement('div');
    div.className = 'result-item';

    const link = document.createElement('a');
    link.href = item.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = item.title;

    const snippet = document.createElement('p');
    snippet.textContent = item.text;

    div.appendChild(link);
    div.appendChild(snippet);
    resultsContainer.appendChild(div);
  });
}
