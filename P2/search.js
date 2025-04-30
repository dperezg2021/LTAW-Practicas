document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById("search-input");
    const searchSuggestions = document.getElementById("search-suggestions");
    const searchBtn = document.getElementById("search-btn");
    const noResultsMessage = document.getElementById("no-results-message");
    const searchContainer = document.getElementById("search-container");

    // Función para buscar productos (simulando AJAX con tu JSON local)
    async function fetchProducts(searchTerm) {
        try {
            // En un caso real, aquí harías fetch('tu-api-endpoint.json')
            // Simulamos la respuesta con tu JSON
            const mockResponse = {
                "productos": [
                    {
                        "nombre": "El Madrileño - C. Tangana",
                        "url": "Producto1.html"
                    },
                    // ... resto de tus productos
                ]
            };
            
            return mockResponse.productos.filter(producto => 
                producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
            );
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    }

    // Muestra sugerencias mientras el usuario escribe
    searchInput.addEventListener("input", async function() {
        const query = this.value.trim();
        searchSuggestions.innerHTML = "";
        noResultsMessage.classList.add("hidden");

        if (query.length < 2) {
            searchSuggestions.classList.add("hidden");
            return;
        }

        const matches = await fetchProducts(query);

        if (matches.length > 0) {
            searchSuggestions.classList.remove("hidden");
            matches.forEach(producto => {
                const li = document.createElement("li");
                li.textContent = producto.nombre;
                li.addEventListener("click", () => {
                    window.location.href = producto.url;
                });
                searchSuggestions.appendChild(li);
            });
        } else {
            searchSuggestions.classList.add("hidden");
            if (query.length >= 2) {
                noResultsMessage.classList.remove("hidden");
            }
        }
    });

    // Redirigir al hacer clic en el botón de búsqueda
    searchBtn.addEventListener("click", async function() {
        const query = searchInput.value.trim();
        
        if (!query) return;

        const matches = await fetchProducts(query);
        const exactMatch = matches.find(p => 
            p.nombre.toLowerCase() === query.toLowerCase()
        );

        if (exactMatch) {
            window.location.href = exactMatch.url;
        } else {
            noResultsMessage.classList.remove("hidden");
            if (matches.length > 0) {
                searchSuggestions.innerHTML = "";
                searchSuggestions.classList.remove("hidden");
                matches.forEach(producto => {
                    const li = document.createElement("li");
                    li.textContent = producto.nombre;
                    li.addEventListener("click", () => {
                        window.location.href = producto.url;
                    });
                    searchSuggestions.appendChild(li);
                });
            }
        }
    });

    // Ocultar sugerencias al hacer clic fuera
    document.addEventListener("click", function(e) {
        if (!searchContainer.contains(e.target)) {
            searchSuggestions.classList.add("hidden");
        }
    });

    // Manejar la tecla Enter en el input
    searchInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            searchBtn.click();
        }
    });
});
