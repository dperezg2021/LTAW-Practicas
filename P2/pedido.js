document.addEventListener("DOMContentLoaded", function () {
    // Obtener el carrito desde localStorage
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Obtener los elementos donde vamos a insertar los productos
    const productosSeleccionados = document.getElementById('productos-seleccionados');
    
    // Verificar si hay productos en el carrito
    if (carrito.length === 0) {
        productosSeleccionados.innerHTML = '<p>No has seleccionado ningún producto.</p>';
    } else {
        productosSeleccionados.innerHTML = ''; // Limpiar mensaje de "cargando productos..."

        // Crear un listado de productos
        carrito.forEach(producto => {
            const productoHTML = `
                <p><strong>Producto:</strong> ${producto.nombre}</p>
                <p><strong>Precio:</strong> ${producto.precio.toFixed(2)}€</p>
                <p><strong>Cantidad:</strong> ${producto.cantidad}</p>
                <p><strong>Total:</strong> ${(producto.precio * producto.cantidad).toFixed(2)}€</p>
                <hr>
            `;

            productosSeleccionados.innerHTML += productoHTML;
        });

        // Si quieres calcular el total del carrito:
        const total = carrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
        const totalHTML = `<p><strong>Total del pedido:</strong> ${total.toFixed(2)}€</p>`;
        productosSeleccionados.innerHTML += totalHTML;
    }

    // Cuando el formulario se envía (se confirma el pedido)
    const form = document.getElementById('pedido-form');
    form.addEventListener('submit', function (e) {
        e.preventDefault();  // Evitar el envío del formulario

        const nombre = document.getElementById('nombre').value;
        const direccion = document.getElementById('direccion').value;
        const tarjeta = document.getElementById('tarjeta').value;

        // Verificar si los campos están completos
        if (!nombre || !direccion || !tarjeta) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        // Crear un objeto de pedido con los datos ingresados
        const pedido = {
            nombre,
            direccion,
            tarjeta,
            carrito: carrito
        };

        // Guardar los datos del pedido en localStorage
        localStorage.setItem('pedido', JSON.stringify(pedido));

        // Validar que los datos coincidan con los datos almacenados
        const storedPedido = JSON.parse(localStorage.getItem('pedido'));

        if (storedPedido && storedPedido.nombre === nombre && storedPedido.direccion === direccion && storedPedido.tarjeta === tarjeta) {
            // Mostrar mensaje de éxito
            alert('¡Compra realizada con éxito!');

            // Vaciar el carrito
            localStorage.removeItem('carrito');
            localStorage.removeItem('pedido');

            // Redirigir o actualizar la página
            window.location.href = 'index.html';  // Opcional: puedes redirigir al inicio
        } else {
            alert('Los datos ingresados no coinciden. Por favor, revisa la información.');
        }
    });
});

