// Espera a que el DOM esté completamente cargado antes de ejecutar el script
document.addEventListener("DOMContentLoaded", function () {
    
    // 🔹 OBTENCIÓN DE ELEMENTOS DEL DOM 🔹
    
    const listaCarrito = document.getElementById('lista-carrito'); // Tabla donde se listan los productos del carrito
    const totalCarrito = document.getElementById('total-carrito'); // Elemento donde se muestra el total del carrito
    const btnVaciarCarrito = document.getElementById('vaciar-carrito'); // Botón para vaciar el carrito
    const btnFinalizarCompra = document.getElementById('finalizar-compra'); // Botón para finalizar la compra
    const botonesAgregar = document.querySelectorAll('.agregar-carrito'); // Botones de "Agregar al carrito"
    const mensajeAñadido = document.getElementById('mensaje-anadido'); // Mensaje que aparece al añadir un producto

    // Crear mensaje de error si no está logueado
    const mensajeError = document.createElement("div");
    
    // Estilizar el mensaje de error
    mensajeError.style.display = "none"; // Oculto por defecto
    mensajeError.textContent = "¡ANUEL";
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
    document.body.appendChild(mensajeError); // Agrega el mensaje al final del body

    // Recuperar el carrito del localStorage o inicializarlo como vacío
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // 🔹 FUNCIONES AUXILIARES 🔹

    // Función para obtener el valor de una cookie por su nombre
    function getCookie(name) {
        let cookies = document.cookie.split("; ");
        for (let i = 0; i < cookies.length; i++) {
            let [key, value] = cookies[i].split("=");
            if (key === name) return value;
        }
        return null;
    }

    // Verificar si el usuario está logueado buscando la cookie "usuario"
    const usuarioData = getCookie("usuario");

    // 🔹 FUNCIONES PRINCIPALES 🔹

    // Función que maneja la lógica para agregar un producto al carrito
    function agregarAlCarrito(event) {
        if (!usuarioData) { // Si el usuario no está logueado
            mensajeError.style.display = "block"; // Mostrar el mensaje de error
            setTimeout(() => {
                mensajeError.style.display = "none"; // Ocultar mensaje
                window.location.href = "login.html"; // Redirigir a login
            }, 3000);
            return;
        }

        const button = event.target;

        // Obtener información del producto desde los atributos HTML del botón
        const nombre = button.getAttribute('data-nombre');
        const precio = parseFloat(button.getAttribute('data-precio'));
        const stock = parseInt(button.getAttribute('data-stock'));

        // Verificar si el producto ya existe en el carrito
        const productoExistente = carrito.find(p => p.nombre === nombre);

        if (productoExistente) {
            if (productoExistente.cantidad < stock) {
                productoExistente.cantidad++; // Aumentar cantidad
            } else {
                alert('No hay más stock disponible.');
                return;
            }
        } else {
            // Agregar nuevo producto al carrito
            carrito.push({ nombre, precio, cantidad: 1 });
        }

        // Guardar carrito actualizado en localStorage
        localStorage.setItem('carrito', JSON.stringify(carrito));

        // Mostrar mensaje de que se añadió el producto
        mensajeAñadido.style.display = 'block';
        setTimeout(() => {
            mensajeAñadido.style.display = 'none';
        }, 3000);

        renderizarCarrito(); // Actualizar visualización del carrito
    }

    // Función para mostrar productos del carrito en el HTML
    function renderizarCarrito() {
        if (!listaCarrito) return; // Si no existe la tabla, salir

        listaCarrito.innerHTML = ''; // Vaciar el contenido actual
        let total = 0;

        carrito.forEach((producto, index) => {
            const fila = document.createElement('tr'); // Crear fila de producto

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

            listaCarrito.appendChild(fila); // Añadir fila a la tabla
            total += producto.precio * producto.cantidad; // Calcular total
        });

        totalCarrito.textContent = total.toFixed(2) + '€'; // Mostrar total
        localStorage.setItem('carrito', JSON.stringify(carrito)); // Guardar
    }

    // 🔹 EVENTOS EN LA PÁGINA DEL CARRITO 🔹

    if (listaCarrito) {
        // Cambiar cantidad de un producto
        listaCarrito.addEventListener('input', (e) => {
            if (e.target.classList.contains('cantidad')) {
                const index = e.target.getAttribute('data-index');
                carrito[index].cantidad = parseInt(e.target.value);
                renderizarCarrito();
            }
        });

        // Eliminar producto del carrito
        listaCarrito.addEventListener('click', (e) => {
            if (e.target.classList.contains('eliminar')) {
                const index = e.target.getAttribute('data-index');
                carrito.splice(index, 1); // Eliminar producto
                renderizarCarrito();
            }
        });

        // Vaciar todo el carrito
        btnVaciarCarrito.addEventListener('click', () => {
            carrito = [];
            localStorage.setItem('carrito', JSON.stringify(carrito));
            renderizarCarrito();
        });

        // Finalizar compra y redirigir
        btnFinalizarCompra.addEventListener('click', () => {
            if (carrito.length === 0) {
                alert('Tu carrito está vacío.');
                return;
            }

            localStorage.setItem('carrito', JSON.stringify(carrito));
            window.location.href = 'pedido.html';
        });

        // Mostrar carrito al cargar la página
        renderizarCarrito();
    }

    // 🔹 EVENTOS EN LA PÁGINA DE PRODUCTOS 🔹

    // Asignar evento a todos los botones de "Agregar al carrito"
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', agregarAlCarrito);
    });
    
});
