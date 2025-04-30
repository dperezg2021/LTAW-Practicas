document.addEventListener("DOMContentLoaded", () => {
    // Función para guardar la cookie
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            let date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + value + "; path=/" + expires;

        // Mostrar la cookie en la consola
        console.log(`Cookie actualizada: ${name}=${value}`);
        mostrarCookies();  // Llamar a la función para mostrar las cookies cada vez que se actualizan
    }

    // Función para obtener la cookie
    function getCookie(name) {
        let cookies = document.cookie.split("; ");
        for (let i = 0; i < cookies.length; i++) {
            let [key, value] = cookies[i].split("=");
            if (key === name) return value;
        }
        return null;
    }

    // Función para eliminar la cookie
    function deleteCookie(name) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        
        // Mostrar el estado de la cookie en la consola después de borrarla
        console.log(`Cookie eliminada: ${name}`);
        mostrarCookies();  // Mostrar las cookies después de eliminarla
    }

    // Función para mostrar todas las cookies en la consola
    function mostrarCookies() {
        console.log("Cookies actuales:", document.cookie);
    }

    // Obtener la cookie del usuario
    const usuarioData = getCookie("usuario");

    // Si el usuario está logueado, mostrará su nombre
    if (usuarioData) {
        const usuarioName = usuarioData.split("|")[0];  // Nombre del usuario en la cookie
        document.getElementById("user-name").textContent = usuarioName;
        document.getElementById("usuario-conectado").style.display = "block";
        document.getElementById("login-btn").style.display = "none";
        console.log(`Usuario conectado: ${usuarioName}`);  // Mostrar el nombre del usuario en la consola
    } else {
        document.getElementById("usuario-conectado").style.display = "none";
        console.log("No hay usuario conectado.");  // Mostrar mensaje en consola si no hay usuario conectado
    }

    // Función para agregar producto a la cookie
    function agregarProducto(producto) {
        const usuarioData = getCookie("usuario");
        if (usuarioData) {
            // Extraemos los productos existentes (si los hay)
            let productos = usuarioData.split("|")[1] ? usuarioData.split("|")[1].split(",") : [];
            // Formato producto: nombre|precio|stock
            const productoStr = `${producto.nombre}|${producto.precio}|${producto.stock}`;
            productos.push(productoStr);  // Añadimos el nuevo producto
            // Guardamos de nuevo la cookie con el nombre de usuario y los productos
            setCookie("usuario", `${usuarioData.split("|")[0]}|${productos.join(",")}`, 7);
            console.log(`Producto añadido: ${producto.nombre}`);  // Mostrar el producto añadido en la consola
        }
    }

    // Agregar evento al botón de "Añadir al Carrito"
    const agregarCarritoBtn = document.querySelector(".agregar-carrito");
    if (agregarCarritoBtn) {
        agregarCarritoBtn.addEventListener("click", (e) => {
            e.preventDefault();

            // Verificar si el usuario está logueado
            if (!getCookie("usuario")) {
                // Si no está logueado, mostrar mensaje y evitar agregar al carrito
                alert("¡Necesitas iniciar sesión para agregar productos al carrito!");
                window.location.href = "login.html";  // Redirigir a la página de login
                return;
            }

            // Obtener los datos del producto (nombre, precio, stock)
            const nombreProducto = agregarCarritoBtn.dataset.nombre;
            const precioProducto = agregarCarritoBtn.dataset.precio;
            const stockProducto = agregarCarritoBtn.dataset.stock;

            // Crear objeto de producto
            const producto = {
                nombre: nombreProducto,
                precio: precioProducto,
                stock: stockProducto
            };

            // Agregar el producto al carrito (almacenado en la cookie)
            agregarProducto(producto);

            // Mostrar el mensaje de añadido
            const mensajeAñadido = document.getElementById("mensaje-anadido");
            if (mensajeAñadido) {
                mensajeAñadido.style.display = "block";
                setTimeout(() => {
                    mensajeAñadido.style.display = "none";
                }, 2000); // El mensaje se oculta después de 2 segundos
            }
        });
    }

    // Función de inicio de sesión
    function loginUsuario(usuario, password) {
        console.log(`Intentando iniciar sesión con: ${usuario} / ${password}`);  // Mostrar usuario y password en consola
        fetch("tienda.json")
            .then(response => response.json())
            .then(data => {
                // Buscar el usuario en el archivo JSON
                const usuarioEncontrado = data.usuarios.find(u => u.nombre_usuario === usuario && u.password === password);

                if (usuarioEncontrado) {
                    // Si se encuentra el usuario, se guarda en la cookie
                    setCookie("usuario", `${usuarioEncontrado.nombre_usuario}|${usuarioEncontrado.productos || ""}`, 7);
                    window.location.href = "index.html"; // Redirige a la página principal
                    console.log(`Usuario ${usuarioEncontrado.nombre_usuario} ha iniciado sesión correctamente.`); // Log de usuario iniciado sesión
                } else {
                    // Si no se encuentra, mostrar mensaje de error
                    document.getElementById("mensaje-error").style.display = "block";
                    console.log("Credenciales incorrectas");  // Mostrar error en consola
                }
            })
            .catch(error => {
                console.error("Error al cargar el archivo JSON:", error);
                document.getElementById("mensaje-error").textContent = "Error al conectar con el servidor. Inténtalo de nuevo.";
                document.getElementById("mensaje-error").style.display = "block";
            });
    }

    // Evento para enviar el formulario de inicio de sesión
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const usuario = document.getElementById("usuario").value;
            const password = document.getElementById("password").value;

            loginUsuario(usuario, password); // Llamamos a la función de login
        });
    }

    // Función de cierre de sesión
    document.getElementById("logout-btn")?.addEventListener("click", (e) => {
        e.preventDefault();
        deleteCookie("usuario");
        window.location.href = "index.html";
    });
});
