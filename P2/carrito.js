document.addEventListener("DOMContentLoaded", function () {
    // Obtener elementos del DOM
    const listaCarrito = document.getElementById('lista-carrito');
    const totalCarrito = document.getElementById('total-carrito');
    const btnVaciarCarrito = document.getElementById('vaciar-carrito');
    const btnFinalizarCompra = document.getElementById('finalizar-compra');
    const botonesAgregar = document.querySelectorAll('.agregar-carrito');

    // Obtener carrito desde localStorage o inicializarlo vacío
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // 🔹 FUNCIONES 🔹

    // Agregar productos al carrito
    function agregarAlCarrito(event) {
        const button = event.target;

        // Obtener datos del producto desde los atributos del botón
        const nombre = button.getAttribute('data-nombre');
        const precio = parseFloat(button.getAttribute('data-precio'));
        const stock = parseInt(button.getAttribute('data-stock'));

        // Buscar si el producto ya está en el carrito
        const productoExistente = carrito.find(p => p.nombre === nombre);

        if (productoExistente) {
            if (productoExistente.cantidad < stock) {
                productoExistente.cantidad++;
            } else {
                alert('No hay más stock disponible.');
                return;
            }
        } else {
            carrito.push({ nombre, precio, cantidad: 1 });
        }

        // Guardar en localStorage
        localStorage.setItem('carrito', JSON.stringify(carrito));
        alert(`${nombre} añadido al carrito.`);
        renderizarCarrito();
    }

    // Mostrar productos en el carrito (carrito.html)
    function renderizarCarrito() {
        if (!listaCarrito) return; // Si no estamos en carrito.html, no ejecutar

        listaCarrito.innerHTML = ''; // Limpiar lista antes de renderizar
        let total = 0;

        carrito.forEach((producto, index) => {
            const fila = document.createElement('tr');

            fila.innerHTML = `
                <td>${producto.nombre}</td>
                <td>${producto.precio.toFixed(2)}€</td>
                <td>
                    <input type="number" value="${producto.cantidad}" min="1" data-index="${index}" class="cantidad">
                </td>
                <td>${(producto.precio * producto.cantidad).toFixed(2)}€</td>
                <td>
                    <button class="eliminar" data-index="${index}">❌</button>
                </td>
            `;

            listaCarrito.appendChild(fila);
            total += producto.precio * producto.cantidad;
        });

        totalCarrito.textContent = total.toFixed(2) + '€';
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    // Cambiar cantidad en el carrito
    if (listaCarrito) {
        listaCarrito.addEventListener('input', (e) => {
            if (e.target.classList.contains('cantidad')) {
                const index = e.target.getAttribute('data-index');
                carrito[index].cantidad = parseInt(e.target.value);
                renderizarCarrito();
            }
        });

        // Eliminar productos del carrito
        listaCarrito.addEventListener('click', (e) => {
            if (e.target.classList.contains('eliminar')) {
                const index = e.target.getAttribute('data-index');
                carrito.splice(index, 1);
                renderizarCarrito();
            }
        });

        // Vaciar carrito
        btnVaciarCarrito.addEventListener('click', () => {
            carrito = [];
            localStorage.setItem('carrito', JSON.stringify(carrito));
            renderizarCarrito();
        });

        // Finalizar compra
        btnFinalizarCompra.addEventListener('click', () => {
            if (carrito.length === 0) {
                alert('Tu carrito está vacío.');
                return;
            }
        
            // Aquí puedes guardar información del carrito en el localStorage o en sesión si quieres mostrar algo en la página de pedido.html
            localStorage.setItem('carrito', JSON.stringify(carrito)); 
        
            // Redirigir a pedido.html
            window.location.href = 'pedido.html';
        });
        

        // Mostrar carrito al cargar la página
        renderizarCarrito();
    }

    // Agregar evento a los botones de productos
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', agregarAlCarrito);
    });
});
