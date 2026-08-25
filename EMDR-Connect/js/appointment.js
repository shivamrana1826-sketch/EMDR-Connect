const appointmentForm = document.getElementById("appointment-form");

const loggedInUserEmail = localStorage.getItem("loggedInUserEmail");

if (!loggedInUserEmail) {

    alert("Please login to book an appointment.");

    window.location.href = "login.html";

}

if (appointmentForm && loggedInUserEmail) {

    const emailInput =
        appointmentForm.querySelector('input[type="email"]');

    if (emailInput) {
        emailInput.value = loggedInUserEmail;
        emailInput.readOnly = true;
    }

    appointmentForm.addEventListener("submit", async function (e) {

        e.preventDefault();
        e.stopImmediatePropagation();

        const name =
            appointmentForm.querySelector('input[type="text"]').value.trim();

        const phone =
            appointmentForm.querySelector('input[type="tel"]').value.trim();

        const doctor =
            appointmentForm.querySelector("select").value;

        const date =
            appointmentForm.querySelector('input[type="date"]').value;

        const time =
            appointmentForm.querySelector('input[type="time"]').value;

        const reason =
            appointmentForm.querySelector("textarea").value.trim();

        if (
            name === "" ||
            phone === "" ||
            doctor === "" ||
            date === "" ||
            time === "" ||
            reason === ""
        ) {

            alert("Please fill all the fields.");
            return;

        }

        if (phone.length < 10) {

            alert("Please enter a valid phone number.");
            return;

        }

        const appointment = {

            patientName: name,

            email: loggedInUserEmail,

            phone: phone,

            reason: reason,

            doctorName: doctor,

            appointmentDate: date,

            appointmentTime: time,

            status: "Pending"

        };

        try {

            const response = await fetch(
                "http://localhost:8080/api/appointments/book",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(appointment)
                }
            );

            if (response.ok) {

                const result = await response.json();

                console.log("Appointment saved:", result);

                alert("Your appointment has been booked successfully.");

                appointmentForm.reset();

                if (emailInput) {
                    emailInput.value = loggedInUserEmail;
                }

            } else {

                alert("Appointment booking failed.");

            }

        } catch (error) {

            console.error("Appointment error:", error);

            alert("Cannot connect to backend server.");

        }

    });

}