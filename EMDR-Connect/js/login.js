/**
 * EMDR Connect - Login Controller
 */
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");

    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();

            const roleSelect = document.getElementById("login-role");
            const emailInput = document.getElementById("login-email");
            const passwordInput = document.getElementById("login-password");

            const role = roleSelect ? roleSelect.value.trim().toUpperCase() : "PATIENT";
            const email = emailInput ? emailInput.value.trim().toLowerCase() : "";
            const password = passwordInput ? passwordInput.value : "";

            if (!email || !password) {
                alert("Please enter both email address and password.");
                return;
            }

            const submitBtn = loginForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = "Logging in...";
            }

            try {
                const response = await fetch(apiUrl("/api/users/login"), {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                        role: role
                    })
                });

                const data = await response.json().catch(function () {
                    return {};
                });

                if (response.ok && data.success) {
                    // Save authenticated session
                    setCurrentUser(data);

                    const userRole = (data.role || role).toUpperCase();

                    if (userRole === "PATIENT") {
                        alert("Patient login successful! Welcome, " + (data.fullName || ""));
                        window.location.href = "patient-dashboard.html";
                    } else if (userRole === "DOCTOR") {
                        const docName = data.doctorName || data.fullName || "Doctor";
                        alert("Doctor login successful! Welcome, " + docName);
                        window.location.href = "doctor-dashboard.html";
                    } else if (userRole === "ADMIN") {
                        alert("Administrator login successful!");
                        window.location.href = "admin/doctor-management.html";
                    } else {
                        window.location.href = "index.html";
                    }
                } else {
                    const errorMsg = data.message || "Invalid email, password, or role.";
                    alert(errorMsg);
                }
            } catch (error) {
                console.error("Login request failed:", error);
                alert("Cannot connect to backend server. Please verify the server is running.");
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Login";
                }
            }
        });
    }
});