const productos = [
    { nombre: "El Madrileño - C. Tangana", url: "Producto1.html" },
    { nombre: "A New Star (1993) - Rels B", url: "Producto2.html" },
    { nombre: "La Espalda del Sol - Diego 900", url: "Producto3.html" },
    { nombre: "Magua con Miel - Choclock", url: "Producto4.html" },
    { nombre: "Moonlight 992 - Cruz Cafuné", url: "Producto5.html" },
    { nombre: "SAYONARA - Álvaro Díaz", url: "Producto6.html" },
    { nombre: "RR - Rosalía & Rauw Alejandro", url: "Producto7.html" },
    { nombre: "Bodhiria - Judeline", url: "Producto8.html" },
    { nombre: "Bolasie - Sokren 07", url: "Producto9.html" }
];

const searchInput = document.getElementById("search-input");
const searchSuggestions = document.getElementById("search-suggestions");
const searchBtn = document.getElementById("search-btn");
const noResultsMessage = document.getElementById("no-results-message"); // Elemento para mostrar el mensaje de no encontrado

// Muestra sugerencias mientras el usuario escribe
searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    searchSuggestions.innerHTML = ""; // Limpiar sugerencias
    noResultsMessage.classList.add("hidden"); // Ocultar mensaje de no encontrado

    if (query.length < 3) {
        searchSuggestions.classList.add("hidden");
        return;
    }

    const matches = productos.filter((p) =>
        p.nombre.toLowerCase().includes(query)
    );

    if (matches.length > 0) {
        searchSuggestions.classList.remove("hidden");
        matches.forEach((producto) => {
            const li = document.createElement("li");
            li.textContent = producto.nombre;
            li.addEventListener("click", () => {
                window.location.href = producto.url;
            });
            searchSuggestions.appendChild(li);
        });
    } else {
        searchSuggestions.classList.add("hidden");
        noResultsMessage.classList.remove("hidden"); // Mostrar mensaje de no encontrado
    }
});

// Redirigir al hacer clic en el botón de búsqueda
searchBtn.addEventListener("click", () => {
    const query = searchInput.value.toLowerCase().trim();
    const match = productos.find((p) => p.nombre.toLowerCase() === query);

    if (match) {
        window.location.href = match.url;
    } else {
        noResultsMessage.classList.remove("hidden"); // Mostrar mensaje de no encontrado
    }
});
