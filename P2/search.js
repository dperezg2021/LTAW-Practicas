document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchSuggestions = document.getElementById('search-suggestions');
    const searchBtn = document.getElementById('search-btn');
    const noResultsMessage = document.getElementById('no-results-message');
    const searchContainer = document.getElementById('search-container');

    // Cargar los productos desde el JSON local
    async function fetchProducts() {
        try {
            const response = await fetch('tienda.json');
            if (!response.ok) {
                throw new Error('Error al cargar los productos');
            }
            const data = await response.json();
            return data.productos || [];
        } catch (error) {
            console.error('Error al obtener productos:', error);
            return [];
        }
    }

    // Función para buscar coincidencias
    async function searchProducts(query) {
        const products = await fetchProducts();
        const lowerQuery = query.toLowerCase();
        
        return products.filter(product => 
            product.nombre.toLowerCase().includes(lowerQuery) ||
            product.artista.toLowerCase().includes(lowerQuery)
        )
        .map(product => ({
            id: product.id,
            nombre: product.nombre,
            artista: product.artista,
            url: `producto.html?id=${product.id}`,
            //imagen: `MEDIA/${product.imagen}`
        }));
    }

    // Función para mostrar sugerencias (modificada)
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
            li.className = 'suggestion-item'; // Clase para estilizar
            
            li.innerHTML = `
                <a href="${product.url}" class="suggestion-link">
                    <div class="suggestion-content">
                        <img src="${product.imagen}" alt="${product.nombre}" class="suggestion-img">
                        <div class="suggestion-text">
                            <div class="suggestion-title">${product.nombre}</div>
                            <div class="suggestion-artist">${product.artista}</div>
                        </div>
                    </div>
                </a>
            `;
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
            const suggestions = await searchProducts(query);
            displaySuggestions(suggestions);
        }, 300);
    });

    // Evento para el botón de búsqueda
    searchBtn.addEventListener('click', async function() {
        const query = searchInput.value.trim();
        
        if (query.length === 0) return;
        
        const suggestions = await searchProducts(query);
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