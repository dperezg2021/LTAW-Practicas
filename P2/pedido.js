document.addEventListener("DOMContentLoaded", () => {
    // Función para obtener la cookie
    function getCookie(name) {
        let cookies = document.cookie.split("; ");
        for (let i = 0; i < cookies.length; i++) {
            let [key, value] = cookies[i].split("=");
            if (key === name) return value;
        }
        return null;
    }

    // Obtener la cookie del usuario
    const usuarioData = getCookie("usuario");

    // Obtener los elementos donde vamos a insertar los productos
    const productosSeleccionados = document.getElementById('productos-seleccionados');

    let carrito = [];

    if (!usuarioData || usuarioData.split("|").length < 2) {
        productosSeleccionados.innerHTML = '<p>No has seleccionado ningún producto.</p>';
    } else {
        const productosStr = usuarioData.split("|")[1];
        const productosArray = productosStr.split(",");
        
        carrito = productosArray.map(prod => {
            const [nombre, precio, stock] = prod.split("|");
            return {
                nombre,
                precio: parseFloat(precio),
                cantidad: 1 // Asumimos cantidad 1 porque la cookie no guarda cantidades
            };
        });

        productosSeleccionados.innerHTML = ''; // Limpiar mensaje de "cargando productos..."

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

        const total = carrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
        const totalHTML = `<p><strong>Total del pedido:</strong> ${total.toFixed(2)}€</p>`;
        productosSeleccionados.innerHTML += totalHTML;
    }

    // Cuando el formulario se envía
    const form = document.getElementById('pedido-form');
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const direccion = document.getElementById('direccion').value;
        const tarjeta = document.getElementById('tarjeta').value;

        if (!nombre || !direccion || !tarjeta) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        const pedido = {
            nombre,
            direccion,
            tarjeta,
            carrito
        };

        // Mostrar el mensaje de éxito
        const mensajeExito = document.getElementById('mensaje-exito');
        mensajeExito.style.display = 'block';

        // Eliminar la cookie del usuario (vaciar carrito)
        document.cookie = "usuario=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        // Redirigir
        setTimeout(function () {
            window.location.href = 'index.html';
        }, 3000);
    });
});
