
// Selecciona el botón y el mensaje por su ID
const btnAddCart = document.getElementById('btn-add-cart');
const mensajeAnadido = document.getElementById('mensaje-anadido');

// Añade un evento de clic al botón
btnAddCart.addEventListener('click', function() {
    // Muestra el mensaje de "Añadido"
    mensajeAnadido.style.display = 'block';

    // Opcional: Ocultar el mensaje después de unos segundos
    setTimeout(function() {
        mensajeAnadido.style.display = 'none';
    }, 2000); // 2000 milisegundos = 2 segundos
});
