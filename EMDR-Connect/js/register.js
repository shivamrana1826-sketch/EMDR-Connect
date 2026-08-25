const registerForm = document.getElementById("register-form");

if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const fullName = registerForm.querySelector('input[type="text"]').value.trim();
        const email = registerForm.querySelector('input[type="email"]').value.trim();
        const phone = registerForm.querySelector('input[type="tel"]').value.trim();

        const passwords = registerForm.querySelectorAll('input[type="password"]');

        const password = passwords[0].value;
        const confirmPassword = passwords[1].value;

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        const user = {
            fullName: fullName,
            email: email,
            password: password,
            phone: phone,
            role: "PATIENT"
        };

        try {
            const response = await fetch(
                "http://localhost:8080/api/users/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(user)
                }
            );

            if (response.ok) {
                alert("Registration successful.");
                window.location.href = "login.html";
            } else {
                alert("Registration failed.");
            }

        } catch (error) {
            console.error("Registration error:", error);
            alert("Cannot connect to backend server.");
        }
    });
}