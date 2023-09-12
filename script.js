document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const Number = document.getElementById("Number").value;
        const password = document.getElementById("password").value;

        // You can add your authentication logic here.
        // For simplicity, let's assume a hardcoded username and password for now.
        if (Number === "admin" && password === "password") {
            // Successful login, redirect or perform actions here.
            alert("Login successful!");
        } else {
            alert("Login failed. Please check your credentials.");
        }
    });
});
