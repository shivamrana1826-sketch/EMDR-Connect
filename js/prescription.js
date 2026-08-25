const prescriptionForm = document.getElementById("prescription-form");

const loggedInUserEmail =
    localStorage.getItem("loggedInUserEmail");

if (!loggedInUserEmail) {

    alert("Please login to access prescriptions.");

    window.location.href = "login.html";

}

if (prescriptionForm && loggedInUserEmail) {

    prescriptionForm.addEventListener("submit", async function (e) {

        e.preventDefault();
        e.stopImmediatePropagation();

        const textInputs =
            prescriptionForm.querySelectorAll('input[type="text"]');

        const patientName =
            textInputs[0].value.trim();

        const dosage =
            textInputs[1].value.trim();

        const doctorName =
            prescriptionForm.querySelector("select").value;

        const prescriptionDate =
            prescriptionForm.querySelector('input[type="date"]').value;

        const textareas =
            prescriptionForm.querySelectorAll("textarea");

        const medicine =
            textareas[0].value.trim();

        const instructions =
            textareas[1].value.trim();

        if (
            patientName === "" ||
            doctorName === "" ||
            prescriptionDate === "" ||
            dosage === "" ||
            medicine === "" ||
            instructions === ""
        ) {

            alert("Please fill all the required fields.");
            return;

        }

        const prescription = {

            patientName: patientName,

            email: loggedInUserEmail,

            doctorName: doctorName,

            medicine: medicine,

            dosage: dosage,

            instructions: instructions,

            prescriptionDate: prescriptionDate

        };

        try {

            const response = await fetch(
                "http://localhost:8080/api/prescriptions",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(prescription)
                }
            );

            if (response.ok) {

                const result = await response.json();

                console.log("Prescription saved:", result);

                alert("Prescription saved successfully.");

                prescriptionForm.reset();

            } else {

                alert("Prescription could not be saved.");

            }

        } catch (error) {

            console.error("Prescription error:", error);

            alert("Cannot connect to backend server.");

        }

    });

}