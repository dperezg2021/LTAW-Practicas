document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchSuggestions = document.getElementById('search-suggestions');
    const searchBtn = document.getElementById('search-btn');
    const noResultsMessage = document.getElementById('no-results-message');
    const searchContainer = document.getElementById('search-container');

 
    async function fetchSuggestions(query) {
        try {
            const response = await fetch(`http://localhost:8002/api/search?q=${encodeURIComponent(query)}`);
            
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error al obtener sugerencias:', error);
            return [];
        }
    }

    // Función para mostrar sugerencias
    function displaySuggestions(suggestions) {
        searchSuggestions.innerHTML = '';
        
        if (suggestions.length === 0) {
            noResultsMessage.classList.remove('hidden');
            searchSuggestions.classList.add('hidden');
            return;
        }
        
        noResultsMessage.classList.add('hidden');
        searchSuggestions.classList.remove('hidden');
        
        suggestions.forEach(product => {
            const li = document.createElement('li');
            li.textContent = product.nombre;
            li.addEventListener('click', () => {
                window.location.href = product.url;
            });
            searchSuggestions.appendChild(li);
        });
    }

    // Evento de input con debounce
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        
        clearTimeout(searchTimeout);
        
        if (query.length < 2) {
            searchSuggestions.innerHTML = '';
            searchSuggestions.classList.add('hidden');
            noResultsMessage.classList.add('hidden');
            return;
        }
        
        searchTimeout = setTimeout(async () => {
            const suggestions = await fetchSuggestions(query);
            displaySuggestions(suggestions);
        }, 300);
    });

    // Evento para el botón de búsqueda
    searchBtn.addEventListener('click', async function() {
        const query = searchInput.value.trim();
        
        if (query.length === 0) return;
        
        const suggestions = await fetchSuggestions(query);
        const exactMatch = suggestions.find(
            item => item.nombre.toLowerCase() === query.toLowerCase()
        );
        
        if (exactMatch) {
            window.location.href = exactMatch.url;
        } else {
            displaySuggestions(suggestions);
        }
    });

    // Ocultar sugerencias al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!e.target.closest('#search-container')) {
            searchSuggestions.classList.add('hidden');
        }
    });

    // Manejar tecla Enter
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
});