document.addEventListener("DOMContentLoaded", function () {

    const registerForm = document.getElementById("register-form");
    const roleSelect = document.getElementById("role");
    const doctorFields = document.getElementById("doctor-fields");

    const specializationInput =
        document.getElementById("specialization");

    const experienceInput =
        document.getElementById("experience");

    const photoInput =
        document.getElementById("photo");


    if (!registerForm || !roleSelect || !doctorFields) {
        console.error("Registration elements not found.");
        return;
    }


    roleSelect.addEventListener("change", function () {

        if (this.value === "DOCTOR") {

            doctorFields.style.display = "block";

            specializationInput.required = true;
            experienceInput.required = true;
            photoInput.required = true;

        } else {

            doctorFields.style.display = "none";

            specializationInput.required = false;
            experienceInput.required = false;
            photoInput.required = false;

            specializationInput.value = "";
            experienceInput.value = "";
            photoInput.value = "";
        }

    });


    registerForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const firstName =
            document.getElementById("first-name").value.trim();

        const lastName =
            document.getElementById("last-name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        const role =
            roleSelect.value;

        const gender =
            document.getElementById("gender").value;

        const dateOfBirth =
            document.getElementById("date-of-birth").value;

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirm-password").value;


        if (password !== confirmPassword) {

            alert("Passwords do not match.");

            return;
        }


        if (role === "DOCTOR") {

            if (
                specializationInput.value.trim() === "" ||
                experienceInput.value.trim() === ""
            ) {

                alert("Please enter specialization and experience.");

                return;
            }


            if (photoInput.files.length === 0) {

                alert("Please select a doctor photo.");

                return;
            }


            const formData = new FormData();

            formData.append(
                "fullName",
                firstName + " " + lastName
            );

            formData.append("email", email);
            formData.append("password", password);
            formData.append("phone", phone);
            formData.append("role", "DOCTOR");

            formData.append(
                "specialization",
                specializationInput.value.trim()
            );

            formData.append(
                "experience",
                experienceInput.value.trim()
            );

            formData.append(
                "photo",
                photoInput.files[0]
            );


            try {

                const response = await fetch(
                    "http://localhost:8080/api/users/register-doctor",
                    {
                        method: "POST",
                        body: formData
                    }
                );


                if (response.ok) {

                    alert("Doctor registration successful.");

                    window.location.href = "login.html";

                } else {

                    const errorText = await response.text();

                    console.error(
                        "Doctor registration failed:",
                        errorText
                    );

                    alert("Doctor registration failed.");

                }

            } catch (error) {

                console.error(
                    "Registration error:",
                    error
                );

                alert(
                    "Cannot connect to backend server."
                );
            }


            return;
        }


        const user = {

            fullName: firstName + " " + lastName,

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

                alert("Patient registration successful.");

                window.location.href = "login.html";

            } else {

                const errorText = await response.text();

                console.error(
                    "Patient registration failed:",
                    errorText
                );

                alert("Patient registration failed.");
            }


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );

            alert(
                "Cannot connect to backend server."
            );
        }

    });

});