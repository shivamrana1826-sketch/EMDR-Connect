document.addEventListener("DOMContentLoaded", function () {

    const doctorContainer =
        document.getElementById("doctor-container");

    if (!doctorContainer) {
        console.error("Doctor container not found.");
        return;
    }


    async function loadDoctors() {

        try {

            const response = await fetch(
                "http://localhost:8080/api/users/doctors"
            );

            if (!response.ok) {
                throw new Error("Failed to load doctors.");
            }


            const doctors = await response.json();

            doctorContainer.innerHTML = "";


            if (doctors.length === 0) {

                doctorContainer.innerHTML = `
                    <p class="no-doctors">
                        No doctors are currently registered.
                    </p>
                `;

                return;
            }


            doctors.forEach(function (doctor) {

                const doctorCard =
                    document.createElement("div");

                doctorCard.className = "card";


                let photo =
                    "images/doctor-default.jpg";


                if (doctor.photo) {

                    if (
                        doctor.photo.startsWith("/uploads/")
                    ) {

                        photo =
                            "http://localhost:8080" +
                            doctor.photo;

                    } else if (
                        doctor.photo.startsWith("images/")
                    ) {

                        photo =
                            doctor.photo;

                    } else {

                        photo =
                            doctor.photo;
                    }
                }


                doctorCard.innerHTML = `

                    <img
                        src="${photo}"
                        alt="${doctor.fullName}"
                    >

                    <h3>
                        ${doctor.fullName}
                    </h3>

                    <p>
                        ${doctor.specialization ||
                        "EMDR Therapist"}
                    </p>

                    <p>
                        ${doctor.experience ||
                        "Experience not specified"}
                    </p>

                    <a
                        href="appointment.html"
                        class="primary-btn book-doctor-btn"
                    >
                        Book Appointment
                    </a>

                `;


                doctorContainer.appendChild(
                    doctorCard
                );


                const bookButton =
                    doctorCard.querySelector(
                        ".book-doctor-btn"
                    );


                bookButton.addEventListener(
                    "click",
                    function () {

                        localStorage.setItem(
                            "selectedDoctor",
                            doctor.fullName
                        );

                    }
                );

            });


        } catch (error) {

            console.error(
                "Error loading doctors:",
                error
            );


            doctorContainer.innerHTML = `
                <p class="no-doctors">
                    Unable to load doctors.
                    Please make sure the backend is running.
                </p>
            `;

        }

    }


    loadDoctors();

});