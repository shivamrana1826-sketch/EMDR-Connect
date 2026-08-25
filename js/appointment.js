document.addEventListener("DOMContentLoaded", function () {

    const appointmentForm =
        document.getElementById("appointment-form");

    const loggedInUserEmail =
        localStorage.getItem("loggedInUserEmail");

    if (!loggedInUserEmail) {

        alert("Please login to book an appointment.");

        window.location.href = "login.html";

        return;
    }


    const emailInput =
        document.getElementById("patient-email");

    const doctorSelect =
        document.getElementById("doctor-select");


    if (emailInput) {

        emailInput.value =
            loggedInUserEmail;

        emailInput.readOnly = true;
    }


    async function loadDoctors() {

        try {

            const response = await fetch(
                "http://localhost:8080/api/users/doctors"
            );

            if (!response.ok) {

                throw new Error(
                    "Failed to load doctors"
                );
            }


            const doctors =
                await response.json();


            doctorSelect.innerHTML = `
                <option value="">
                    Choose Doctor
                </option>
            `;


            if (doctors.length === 0) {

                doctorSelect.innerHTML = `
                    <option value="">
                        No doctors available
                    </option>
                `;

                return;
            }


            doctors.forEach(function (doctor) {

                const option =
                    document.createElement("option");

                option.value =
                    doctor.fullName;

                option.textContent =
                    doctor.fullName;


                doctorSelect.appendChild(option);

            });


            const selectedDoctor =
                localStorage.getItem(
                    "selectedDoctor"
                );


            if (selectedDoctor) {

                doctorSelect.value =
                    selectedDoctor;

                localStorage.removeItem(
                    "selectedDoctor"
                );
            }


        } catch (error) {

            console.error(
                "Error loading doctors:",
                error
            );


            doctorSelect.innerHTML = `
                <option value="">
                    Unable to load doctors
                </option>
            `;

        }

    }


    loadDoctors();


    appointmentForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            const name =
                document
                .getElementById("patient-name")
                .value
                .trim();


            const phone =
                document
                .getElementById("patient-phone")
                .value
                .trim();


            const doctor =
                doctorSelect.value;


            const date =
                document
                .getElementById("appointment-date")
                .value;


            const time =
                document
                .getElementById("appointment-time")
                .value;


            const reason =
                document
                .getElementById("appointment-reason")
                .value
                .trim();


            if (
                name === "" ||
                phone === "" ||
                doctor === "" ||
                date === "" ||
                time === "" ||
                reason === ""
            ) {

                alert(
                    "Please fill all the fields."
                );

                return;
            }


            if (phone.length < 10) {

                alert(
                    "Please enter a valid phone number."
                );

                return;
            }


            const appointment = {

                patientName:
                    name,

                email:
                    loggedInUserEmail,

                phone:
                    phone,

                reason:
                    reason,

                doctorName:
                    doctor,

                appointmentDate:
                    date,

                appointmentTime:
                    time,

                status:
                    "Pending"

            };


            try {

                const response =
                    await fetch(
                        "http://localhost:8080/api/appointments/book",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    appointment
                                )
                        }
                    );


                if (response.ok) {

                    const result =
                        await response.json();


                    console.log(
                        "Appointment saved:",
                        result
                    );


                    alert(
                        "Your appointment has been booked successfully."
                    );


                    appointmentForm.reset();


                    if (emailInput) {

                        emailInput.value =
                            loggedInUserEmail;
                    }


                } else {

                    const errorText =
                        await response.text();


                    console.error(
                        "Appointment booking failed:",
                        errorText
                    );


                    alert(
                        "Appointment booking failed."
                    );

                }


            } catch (error) {

                console.error(
                    "Appointment error:",
                    error
                );


                alert(
                    "Cannot connect to backend server."
                );

            }

        }
    );

});