document.addEventListener("DOMContentLoaded", function () {
    // Obtener elementos del DOM
    const listaCarrito = document.getElementById('lista-carrito');
    const totalCarrito = document.getElementById('total-carrito');
    const btnVaciarCarrito = document.getElementById('vaciar-carrito');
    const btnFinalizarCompra = document.getElementById('finalizar-compra');
    const botonesAgregar = document.querySelectorAll('.agregar-carrito');
    const mensajeAñadido = document.getElementById('mensaje-anadido');  // Contenedor del mensaje
    const mensajeError = document.createElement("div"); // Mensaje de error si no está logueado

    mensajeError.style.display = "none"; // Iniciar oculto
    mensajeError.textContent = "¡Necesitas iniciar sesión para añadir productos al carrito!";
    mensajeError.style.color = "red";
    mensajeError.style.fontSize = "1.2rem";
    mensajeError.style.textAlign = "center";
    mensajeError.style.marginTop = "10px";
    mensajeError.style.position = "fixed";
    mensajeError.style.top = "50%";
    mensajeError.style.left = "50%";
    mensajeError.style.transform = "translate(-50%, -50%)";
    mensajeError.style.backgroundColor = "white";
    mensajeError.style.padding = "20px";
    mensajeError.style.border = "2px solid red";
    mensajeError.style.borderRadius = "10px";
    mensajeError.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)";
    document.body.appendChild(mensajeError); // Agregar al final del body
    
    // Obtener carrito desde localStorage o inicializarlo vacío
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Verificar si el usuario está logueado
    const usuario = localStorage.getItem('usuario');

    // 🔹 FUNCIONES 🔹

    // Agregar productos al carrito
    function agregarAlCarrito(event) {
        if (!usuario) { // Si no está logueado, mostrar mensaje de error
            mensajeError.style.display = "block";  // Hacer visible el mensaje
            setTimeout(() => {
                mensajeError.style.display = "none"; // Ocultarlo después de 3 segundos
                window.location.href = "login.html"; // Redirigir a login.html
            }, 3000);
            return;
        }

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

        // Mostrar el mensaje de añadido
        mensajeAñadido.style.display = 'block';  // Hacerlo visible
        setTimeout(() => {
            mensajeAñadido.style.display = 'none';  // Ocultarlo después de 3 segundos
        }, 3000);

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

