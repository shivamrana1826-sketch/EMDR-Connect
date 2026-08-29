const appointmentTableBody =
    document.getElementById("appointment-table-body");

const prescriptionTableBody =
    document.getElementById("prescription-table-body");

const consultationTableBody =
    document.getElementById("consultation-table-body");

const loggedInUserEmail =
    localStorage.getItem("loggedInUserEmail");


if (!loggedInUserEmail) {

    alert("Please login first.");

    window.location.href = "login.html";

} else {

    loadAppointments();
    loadPrescriptions();
    loadConsultations();

}


async function loadAppointments() {

    try {

        const response = await fetch(
            "http://localhost:8080/api/appointments/patient?email=" +
            encodeURIComponent(loggedInUserEmail)
        );

        if (!response.ok) {
            throw new Error("Failed to load appointments");
        }

        const appointments = await response.json();

        appointmentTableBody.innerHTML = "";

        appointments.forEach(function(appointment) {

            const row = document.createElement("tr");

            let statusClass = "pending-status";

            if (appointment.status === "Confirmed") {
                statusClass = "active-status";
            }

            if (appointment.status === "Completed") {
                statusClass = "completed-status";
            }

            row.innerHTML = `
                <td>${appointment.appointmentDate}</td>
                <td>${appointment.doctorName}</td>
                <td>${appointment.appointmentTime}</td>
                <td>
                    <span class="status ${statusClass}">
                        ${appointment.status}
                    </span>
                </td>
            `;

            appointmentTableBody.appendChild(row);

        });

    } catch (error) {

        console.error("Error loading appointments:", error);

    }

}


async function loadPrescriptions() {

    try {

        const response = await fetch(
            "http://localhost:8080/api/prescriptions/patient?email=" +
            encodeURIComponent(loggedInUserEmail)
        );

        if (!response.ok) {
            throw new Error("Failed to load prescriptions");
        }

        const prescriptions = await response.json();

        prescriptionTableBody.innerHTML = "";

        prescriptions.forEach(function(prescription) {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${prescription.prescriptionDate}</td>
                <td>${prescription.doctorName}</td>
                <td>${prescription.medicine}</td>
                <td>${prescription.dosage}</td>
                <td>${prescription.instructions}</td>
            `;

            prescriptionTableBody.appendChild(row);

        });

    } catch (error) {

        console.error("Error loading prescriptions:", error);

    }

}


async function loadConsultations() {

    try {

        const response = await fetch(
            "http://localhost:8080/api/consultations/patient?email=" +
            encodeURIComponent(loggedInUserEmail)
        );

        if (!response.ok) {
            throw new Error("Failed to load consultations");
        }

        const consultations = await response.json();

        consultationTableBody.innerHTML = "";

        consultations.forEach(function(consultation) {

            const row = document.createElement("tr");

            let statusClass = "pending-status";

            if (consultation.status === "Scheduled") {
                statusClass = "active-status";
            }

            if (consultation.status === "Completed") {
                statusClass = "completed-status";
            }

            row.innerHTML = `
                <td>${consultation.consultationDate}</td>
                <td>${consultation.doctorName}</td>
                <td>${consultation.consultationTime}</td>
                <td>
                    <span class="status ${statusClass}">
                        ${consultation.status}
                    </span>
                </td>
                <td>${consultation.notes}</td>
            `;

            consultationTableBody.appendChild(row);

        });

    } catch (error) {

        console.error("Error loading consultations:", error);

    }

}


const logoutButton =
    document.getElementById("logout-btn");

if (logoutButton) {

    logoutButton.addEventListener("click", function(e) {

        e.preventDefault();

        localStorage.removeItem("loggedInUserEmail");

        alert("Logged out successfully.");

        window.location.href = "login.html";

    });

}