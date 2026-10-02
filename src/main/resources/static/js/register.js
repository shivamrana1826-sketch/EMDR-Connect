/**
 * EMDR Connect - Patient Registration Controller
 */
document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("register-form");

    if (registerForm) {
        registerForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();

            const firstNameInput = document.getElementById("reg-first-name");
            const lastNameInput = document.getElementById("reg-last-name");
            const emailInput = document.getElementById("reg-email");
            const phoneInput = document.getElementById("reg-phone");
            const passwordInput = document.getElementById("reg-password");
            const confirmPasswordInput = document.getElementById("reg-confirm-password");

            const firstName = firstNameInput ? firstNameInput.value.trim() : "";
            const lastName = lastNameInput ? lastNameInput.value.trim() : "";
            const fullName = (firstName + " " + lastName).trim();
            const email = emailInput ? emailInput.value.trim().toLowerCase() : "";
            const phone = phoneInput ? phoneInput.value.trim() : "";
            const password = passwordInput ? passwordInput.value : "";
            const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : "";

            if (!fullName || !email || !phone || !password) {
                alert("Please fill in all required fields.");
                return;
            }

            if (password !== confirmPassword) {
                alert("Passwords do not match. Please verify.");
                if (confirmPasswordInput) confirmPasswordInput.focus();
                return;
            }

            if (phone.length < 10) {
                alert("Please enter a valid 10-digit phone number.");
                if (phoneInput) phoneInput.focus();
                return;
            }

            const submitBtn = registerForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = "Registering...";
            }

            const patientUser = {
                fullName: fullName,
                email: email,
                password: password,
                phone: phone,
                role: "PATIENT",
                active: true
            };

            try {
                const response = await fetch(apiUrl("/api/users/register"), {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(patientUser)
                });

                if (response.ok) {
                    alert("Registration successful! You can now log in with your email and password.");
                    window.location.href = "login.html";
                } else {
                    const errData = await response.json().catch(function () {
                        return {};
                    });
                    const message = errData.error || "Registration failed. Please check your details and try again.";
                    alert(message);
                }
            } catch (error) {
                console.error("Registration request failed:", error);
                alert("Cannot connect to backend server. Please verify the server is running.");
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Register";
                }
            }
        });
    }
});