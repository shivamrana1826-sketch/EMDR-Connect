const loginForm = document.getElementById("login-form");

if (loginForm) {

    loginForm.addEventListener("submit", async function(e) {

        e.preventDefault();
        e.stopImmediatePropagation();

        const email =
            loginForm.querySelector('input[type="email"]').value.trim();

        const password =
            loginForm.querySelector('input[type="password"]').value;

        if (email === "" || password === "") {

            alert("Please fill all fields.");
            return;

        }

        try {

            const response = await fetch(
                "http://localhost:8080/api/users/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const result = await response.text();

            const role = result.trim().toUpperCase();

            console.log("Login role:", role);

            if (role === "PATIENT") {

                localStorage.setItem("loggedInUserEmail", email);
                localStorage.setItem("loggedInUserRole", "PATIENT");

                alert("Patient login successful.");

                window.location.href = "patient-dashboard.html";

            } else if (role === "DOCTOR") {

                localStorage.setItem("loggedInUserEmail", email);
                localStorage.setItem("loggedInUserRole", "DOCTOR");

                alert("Doctor login successful.");

                window.location.href = "doctor-dashboard.html";

            } else {

                localStorage.removeItem("loggedInUserEmail");
                localStorage.removeItem("loggedInUserRole");

                alert("Invalid email or password.");

            }

        } catch (error) {

            console.error("Login error:", error);

            alert("Cannot connect to backend server.");

        }

    });

}