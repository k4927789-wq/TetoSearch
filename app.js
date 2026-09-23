document.getElementById('search-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const query = document.getElementById('search-input').value.trim();
  const statusMessage = document.getElementById('status-message');
  const resultsList = document.getElementById('results-list');

  if (!query) return;

  // Limpiar resultados anteriores y mostrar estado
  resultsList.innerHTML = '';
  statusMessage.textContent = 'Buscando resultados...';

  // Eliminar cualquier script de búsqueda previo si existe
  const oldScript = document.getElementById('ddg-script');
  if (oldScript) {
    oldScript.remove();
  }

  // Crear etiqueta de script para consulta JSONP (evita problemas de CORS)
  const script = document.createElement('script');
  script.id = 'ddg-script';
  script.src = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&callback=processSearchResults`;
  
  script.onerror = function () {
    statusMessage.textContent = 'Ocurrió un error al realizar la búsqueda. Inténtalo de nuevo.';
  };

  document.body.appendChild(script);
});

// Función global ejecutada automáticamente al recibir los datos de la API
function processSearchResults(data) {
  const statusMessage = document.getElementById('status-message');
  const resultsList = document.getElementById('results-list');
  resultsList.innerHTML = '';

  const items = [];

  // Extraer información del tema principal si existe
  if (data.AbstractText && data.AbstractURL) {
    items.push({
      title: data.Heading || 'Resultado principal',
      snippet: data.AbstractText,
      url: data.AbstractURL
    });
  }

  // Extraer resultados relacionados
  if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
    data.RelatedTopics.forEach(topic => {
      if (topic.Text && topic.FirstURL) {
        items.push({
          title: topic.Text.split(' - ')[0] || topic.Text,
          snippet: topic.Text,
          url: topic.FirstURL
        });
      } else if (topic.Topics && Array.isArray(topic.Topics)) {
        // En caso de temas agrupados
        topic.Topics.forEach(subTopic => {
          if (subTopic.Text && subTopic.FirstURL) {
            items.push({
              title: subTopic.Text.split(' - ')[0] || subTopic.Text,
              snippet: subTopic.Text,
              url: subTopic.FirstURL
            });
          }
        });
      }
    });
  }

  // Mostrar mensaje si no hay datos
  if (items.length === 0) {
    statusMessage.textContent = 'No se encontraron resultados directos para esta consulta.';
    return;
  }

  statusMessage.textContent = `Se encontraron ${items.length} resultados:`;

  // Renderizar la lista de resultados
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'result-item';

    const link = document.createElement('a');
    link.href = item.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = item.title;

    const snippet = document.createElement('p');
    snippet.textContent = item.snippet;

    card.appendChild(link);
    card.appendChild(snippet);
    resultsList.appendChild(card);
  });
}
