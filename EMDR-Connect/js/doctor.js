const loggedInUserEmail = localStorage.getItem("loggedInUserEmail");
const loggedInUserRole = localStorage.getItem("loggedInUserRole");

if (!loggedInUserEmail || loggedInUserRole !== "DOCTOR") {
    alert("Access denied! Please login as Doctor.");
    window.location.href = "login.html";
}
const doctorAppointmentTable = document.getElementById(
    "doctor-appointment-table-body"
);

async function loadDoctorAppointments() {

    try {

        const response = await fetch(
            "http://localhost:8080/api/appointments"
        );

        if (!response.ok) {
            throw new Error("Failed to load appointments");
        }

        const appointments = await response.json();

        doctorAppointmentTable.innerHTML = "";

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
                <td>${appointment.patientName}</td>
                <td>${appointment.appointmentDate}</td>
                <td>${appointment.appointmentTime}</td>
                <td>
                    <span class="status ${statusClass}">
                        ${appointment.status}
                    </span>
                </td>
                <td>
                    <button class="action-btn">View</button>
                </td>
            `;

            doctorAppointmentTable.appendChild(row);

            const viewButton = row.querySelector(".action-btn");
            const statusButton = row.querySelector(".status");

            viewButton.addEventListener("click", function() {

                alert(
                    "Patient : " + appointment.patientName +
                    "\nDoctor : " + appointment.doctorName +
                    "\nDate : " + appointment.appointmentDate +
                    "\nTime : " + appointment.appointmentTime +
                    "\nStatus : " + appointment.status +
                    "\nEmail : " + appointment.email +
                    "\nPhone : " + appointment.phone +
                    "\nReason : " + appointment.reason
                );

            });

            statusButton.addEventListener("click", async function() {

                let newStatus;

                if (appointment.status === "Pending") {
                    newStatus = "Confirmed";
                } else if (appointment.status === "Confirmed") {
                    newStatus = "Completed";
                } else {
                    alert("This appointment is already completed.");
                    return;
                }

                try {

                    const response = await fetch(
                        "http://localhost:8080/api/appointments/" +
                        appointment.id +
                        "/status?status=" +
                        encodeURIComponent(newStatus),
                        {
                            method: "PUT"
                        }
                    );

                    if (!response.ok) {
                        throw new Error("Status update failed");
                    }

                    const updatedAppointment = await response.json();

                    appointment.status = updatedAppointment.status;

                    alert(
                        "Appointment status updated to " +
                        updatedAppointment.status
                    );

                    loadDoctorAppointments();

                } catch (error) {

                    console.error("Status update error:", error);

                    alert("Unable to update appointment status.");

                }

            });

        });

    } catch (error) {

        console.error("Error loading doctor appointments:", error);

    }

}

loadDoctorAppointments();
async function loadDashboardStats() {

    try {

        const appointmentResponse = await fetch(
            "http://localhost:8080/api/appointments"
        );

        const appointments = await appointmentResponse.json();

        document.getElementById("total-patients").textContent =
            appointments.length;

        const today = new Date().toISOString().split("T")[0];

        const todaysAppointments = appointments.filter(function(appointment) {
            return appointment.appointmentDate === today;
        });

        document.getElementById("total-appointments").textContent =
            todaysAppointments.length;


        const prescriptionResponse = await fetch(
            "http://localhost:8080/api/prescriptions"
        );

        const prescriptions = await prescriptionResponse.json();

        document.getElementById("total-prescriptions").textContent =
            prescriptions.length;

            const consultationResponse = await fetch(
    "http://localhost:8080/api/consultations"
);

const consultations = await consultationResponse.json();

document.getElementById("total-consultations").textContent =
    consultations.length;

    } catch (error) {

        console.error("Error loading dashboard statistics:", error);

    }

}
const logoutButton = document.getElementById("logout-btn");

if (logoutButton) {

    logoutButton.addEventListener("click", function (e) {

        e.preventDefault();

        localStorage.removeItem("loggedInUserEmail");
        localStorage.removeItem("loggedInUserRole");

        alert("Logged out successfully.");

        window.location.href = "login.html";

    });

}

loadDashboardStats();