document.addEventListener("DOMContentLoaded", () => {
    const usuario = localStorage.getItem("usuario");

    if (usuario) {
        document.getElementById("user-name").textContent = usuario;
        document.getElementById("usuario-conectado").style.display = "block";
        document.getElementById("login-btn").style.display = "none";
    } else {
        document.getElementById("usuario-conectado").style.display = "none";
    }

    document.getElementById("logout-btn")?.addEventListener("click", () => {
        localStorage.removeItem("usuario");
        window.location.reload();
    });
});
