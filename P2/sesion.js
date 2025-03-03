document.addEventListener("DOMContentLoaded", () => {
    const usuario = localStorage.getItem("usuario");

    // Mostrar u ocultar el estado de la sesión
    if (usuario) {
        document.getElementById("user-name").textContent = usuario;
        document.getElementById("usuario-conectado").style.display = "block";
        document.getElementById("login-btn").style.display = "none";
    } else {
        document.getElementById("usuario-conectado").style.display = "none";
    }

    // Cerrar sesión
    document.getElementById("logout-btn")?.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("usuario");
        window.location.href = "index.html"; // Redirigir al inicio
    });

    // Manejar el formulario de inicio de sesión
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const usuario = document.getElementById("usuario").value;
            const password = document.getElementById("password").value;

            // Cargar el archivo JSON
            try {
                const response = await fetch("tienda.json");
                const data = await response.json();

                // Buscar el usuario en la lista
                const usuarioEncontrado = data.usuarios.find(
                    (u) => u.nombre_usuario === usuario && u.password === password
                );

                if (usuarioEncontrado) {
                    // Guardar el nombre de usuario en localStorage
                    localStorage.setItem("usuario", usuarioEncontrado.nombre_usuario);
                    window.location.href = "index.html"; // Redirigir al inicio
                } else {
                    // Mostrar mensaje de error
                    document.getElementById("mensaje-error").style.display = "block";
                }
            } catch (error) {
                console.error("Error al cargar el archivo JSON:", error);
                document.getElementById("mensaje-error").textContent =
                    "Error al conectar con el servidor. Inténtalo de nuevo.";
                document.getElementById("mensaje-error").style.display = "block";
            }
        });
    }

    // Manejar el formulario de registro
    const registroForm = document.getElementById("registro-form");
    if (registroForm) {
        registroForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nombre = document.getElementById("nombre").value;
            const usuario = document.getElementById("usuario").value;
            const password = document.getElementById("password").value;

            // Cargar el archivo JSON
            try {
                const response = await fetch("tienda.json");
                const data = await response.json();

                // Verificar si el usuario ya existe
                const usuarioExistente = data.usuarios.find(
                    (u) => u.nombre_usuario === usuario
                );

                if (usuarioExistente) {
                    document.getElementById("mensaje-error").textContent =
                        "El usuario ya existe. Inténtalo con otro nombre de usuario.";
                    document.getElementById("mensaje-error").style.display = "block";
                } else {
                    // Simular registro (esto debería ser reemplazado por una llamada a un backend)
                    localStorage.setItem("usuario", usuario);
                    document.getElementById("mensaje-exito").style.display = "block";
                    setTimeout(() => {
                        window.location.href = "index.html"; // Redirigir al inicio
                    }, 2000);
                }
            } catch (error) {
                console.error("Error al cargar el archivo JSON:", error);
                document.getElementById("mensaje-error").textContent =
                    "Error al conectar con el servidor. Inténtalo de nuevo.";
                document.getElementById("mensaje-error").style.display = "block";
            }
        });
    }
});