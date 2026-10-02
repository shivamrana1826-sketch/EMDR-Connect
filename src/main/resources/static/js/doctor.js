// Doctor Dashboard JavaScript - EMDR Connect

let currentDoctor = null;

document.addEventListener("DOMContentLoaded", function () {
    const user = requireAuth(["DOCTOR"]);
    if (!user) return;

    // Setup Logout buttons
    const navLogout = document.getElementById("nav-logout-btn");
    const sidebarLogout = document.getElementById("sidebar-logout-btn");
    if (navLogout) navLogout.addEventListener("click", (e) => { e.preventDefault(); handleLogout(); });
    if (sidebarLogout) sidebarLogout.addEventListener("click", (e) => { e.preventDefault(); handleLogout(); });

    // Refresh button
    const refreshBtn = document.getElementById("refresh-appointments-btn");
    if (refreshBtn) {
        refreshBtn.addEventListener("click", function () {
            loadDoctorAppointments(user.email);
        });
    }

    // Load Doctor Profile & Data
    loadDoctorProfile(user.email);
    loadDoctorAppointments(user.email);
    loadDoctorPrescriptions(user.email);
});

// 1. DOCTOR PROFILE
async function loadDoctorProfile(email) {
    try {
        const res = await fetch(apiUrl(`/api/doctors/by-email?email=${encodeURIComponent(email)}`));
        if (!res.ok) {
            console.warn("Doctor profile not found for email:", email);
            return;
        }

        currentDoctor = await res.json();

        // Update headers
        const headerName = document.getElementById("doctor-header-name");
        const headerEmail = document.getElementById("doctor-header-email");
        if (headerName) headerName.textContent = currentDoctor.name || "Doctor";
        if (headerEmail) headerEmail.textContent = currentDoctor.email || email;

        // Update Profile Card
        const profName = document.getElementById("doctor-profile-name");
        const profSpec = document.getElementById("doctor-profile-spec");
        const profEmail = document.getElementById("doctor-profile-email");
        const profPhone = document.getElementById("doctor-profile-phone");
        const profQual = document.getElementById("doctor-profile-qual");
        const profExp = document.getElementById("doctor-profile-exp");
        const profFee = document.getElementById("doctor-profile-fee");
        const profBio = document.getElementById("doctor-profile-bio");
        const profImg = document.getElementById("doctor-profile-img");
        const availBadge = document.getElementById("doctor-profile-avail-badge");

        if (profName) profName.textContent = currentDoctor.name || "N/A";
        if (profSpec) profSpec.textContent = currentDoctor.specialization || "EMDR Therapist";
        if (profEmail) profEmail.textContent = currentDoctor.email || "N/A";
        if (profPhone) profPhone.textContent = currentDoctor.phone || "Not specified";
        if (profQual) profQual.textContent = currentDoctor.qualification || "N/A";
        if (profExp) profExp.textContent = `${currentDoctor.experience || 0} years`;
        if (profFee) profFee.textContent = currentDoctor.consultationFee ? `₹${currentDoctor.consultationFee}` : "Free / Standard";
        if (profBio) profBio.textContent = currentDoctor.biography || "No biography provided.";
        if (profImg) {
            profImg.src = resolveImageUrl(currentDoctor.imagePath);
            profImg.onerror = function () { this.src = "images/doctor1.jpg"; };
        }

        if (availBadge) {
            if (currentDoctor.available) {
                availBadge.className = "status-badge status-confirmed";
                availBadge.textContent = "Available";
            } else {
                availBadge.className = "status-badge status-rejected";
                availBadge.textContent = "Off Duty";
            }
        }

        // Toggle availability button
        const toggleBtn = document.getElementById("toggle-avail-btn");
        if (toggleBtn) {
            toggleBtn.onclick = async function () {
                try {
                    const newStatus = !currentDoctor.available;
                    const putRes = await fetch(apiUrl(`/api/doctors/${currentDoctor.id}/toggle-availability?available=${newStatus}`), {
                        method: "PUT"
                    });
                    if (putRes.ok) {
                        currentDoctor.available = newStatus;
                        if (availBadge) {
                            availBadge.className = newStatus ? "status-badge status-confirmed" : "status-badge status-rejected";
                            availBadge.textContent = newStatus ? "Available" : "Off Duty";
                        }
                    }
                } catch (err) {
                    console.error("Failed to toggle availability:", err);
                }
            };
        }

    } catch (err) {
        console.error("Error loading doctor profile:", err);
    }
}

// 2. DOCTOR APPOINTMENTS (STRICTLY FILTERED BY DOCTOR EMAIL)
async function loadDoctorAppointments(doctorEmail) {
    const tableBody = document.getElementById("doctor-appointment-table-body");
    const totalPatientsEl = document.getElementById("total-patients");
    const pendingAppEl = document.getElementById("pending-appointments");
    const confirmedAppEl = document.getElementById("confirmed-appointments");

    if (!tableBody) return;

    try {
        const res = await fetch(apiUrl(`/api/appointments/doctor?email=${encodeURIComponent(doctorEmail)}`));
        if (!res.ok) throw new Error("Failed to load appointments");

        const appointments = await res.json();

        // Calculate and update stats
        if (appointments && appointments.length >= 0) {
            const uniquePatients = new Set(appointments.map(a => a.email)).size;
            const pendingCount = appointments.filter(a => (a.status || "").toUpperCase() === "PENDING").length;
            const confirmedCount = appointments.filter(a => (a.status || "").toUpperCase() === "CONFIRMED").length;

            if (totalPatientsEl) totalPatientsEl.textContent = uniquePatients;
            if (pendingAppEl) pendingAppEl.textContent = pendingCount;
            if (confirmedAppEl) confirmedAppEl.textContent = confirmedCount;
        }

        if (!appointments || appointments.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding: 20px; color:#888;">No appointments assigned yet.</td></tr>`;
            return;
        }

        tableBody.innerHTML = "";
        appointments.forEach(app => {
            const tr = document.createElement("tr");
            const statusUpper = (app.status || "PENDING").toUpperCase();

            let statusBadgeClass = "status-pending";
            if (statusUpper === "CONFIRMED") statusBadgeClass = "status-confirmed";
            else if (statusUpper === "REJECTED") statusBadgeClass = "status-rejected";
            else if (statusUpper === "COMPLETED") statusBadgeClass = "status-completed";

            let actionHtml = "";
            if (statusUpper === "PENDING") {
                actionHtml = `
                    <button class="btn-action-sm btn-confirm" data-id="${app.id}">
                        <i class="fa-solid fa-check"></i> Confirm
                    </button>
                    <button class="btn-action-sm btn-reject" data-id="${app.id}">
                        <i class="fa-solid fa-xmark"></i> Reject
                    </button>
                `;
            } else if (statusUpper === "CONFIRMED") {
                actionHtml = `
                    <a href="consultation.html?appointmentId=${app.id}" class="btn-action-sm btn-session">
                        <i class="fa-solid fa-video"></i> Start Session
                    </a>
                    <a href="prescription.html?patientEmail=${encodeURIComponent(app.email || '')}&patientName=${encodeURIComponent(app.patientName || '')}" class="btn-action-sm btn-prescribe">
                        <i class="fa-solid fa-file-prescription"></i> Prescribe
                    </a>
                `;
            } else if (statusUpper === "COMPLETED") {
                actionHtml = `<span style="color:#198754; font-size:12px; font-weight:600;"><i class="fa-solid fa-circle-check"></i> Completed</span>`;
            } else if (statusUpper === "REJECTED") {
                actionHtml = `<span style="color:#dc3545; font-size:12px; font-weight:600;"><i class="fa-solid fa-ban"></i> Rejected</span>`;
            }

            tr.innerHTML = `
                <td><strong>${escapeHtml(app.appointmentDate || "N/A")}</strong></td>
                <td>${escapeHtml(app.appointmentTime || "N/A")}</td>
                <td><strong>${escapeHtml(app.patientName || "N/A")}</strong></td>
                <td>
                    <div style="font-size: 13px;">${escapeHtml(app.email || "N/A")}</div>
                    <div style="font-size: 12px; color: #666;">${escapeHtml(app.phone || "")}</div>
                </td>
                <td>${escapeHtml(app.reason || "General Consultation")}</td>
                <td><span class="status-badge ${statusBadgeClass}">${statusUpper}</span></td>
                <td>${actionHtml}</td>
            `;

            tableBody.appendChild(tr);
        });

        // Attach action handlers for Confirm & Reject
        tableBody.querySelectorAll(".btn-confirm").forEach(btn => {
            btn.addEventListener("click", async function () {
                const id = this.getAttribute("data-id");
                await updateStatus(id, "CONFIRMED", doctorEmail);
            });
        });

        tableBody.querySelectorAll(".btn-reject").forEach(btn => {
            btn.addEventListener("click", async function () {
                const id = this.getAttribute("data-id");
                if (confirm("Are you sure you want to reject this appointment?")) {
                    await updateStatus(id, "REJECTED", doctorEmail);
                }
            });
        });

    } catch (err) {
        console.error("Error loading doctor appointments:", err);
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center" style="color: #dc3545;">Failed to load appointments.</td></tr>`;
    }
}

// Update Appointment Status
async function updateStatus(appointmentId, newStatus, doctorEmail) {
    try {
        const res = await fetch(apiUrl(`/api/appointments/${appointmentId}/status?status=${encodeURIComponent(newStatus)}`), {
            method: "PUT"
        });

        if (!res.ok) {
            alert("Failed to update status. Please try again.");
            return;
        }

        alert(`Appointment status successfully updated to ${newStatus}.`);
        await loadDoctorAppointments(doctorEmail);
    } catch (err) {
        console.error("Status update error:", err);
        alert("An error occurred while updating the appointment status.");
    }
}

// 3. DOCTOR PRESCRIPTIONS
async function loadDoctorPrescriptions(doctorEmail) {
    const tableBody = document.getElementById("doctor-prescriptions-table-body");
    const totalPrescriptionsEl = document.getElementById("total-prescriptions");
    if (!tableBody) return;

    try {
        const res = await fetch(apiUrl(`/api/prescriptions/doctor?email=${encodeURIComponent(doctorEmail)}`));
        if (!res.ok) throw new Error("Failed to load doctor prescriptions");

        const prescriptions = await res.json();
        if (totalPrescriptionsEl) {
            totalPrescriptionsEl.textContent = prescriptions.length;
        }

        if (!prescriptions || prescriptions.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center" style="padding: 20px; color:#888;">No prescriptions recorded by you yet.</td></tr>`;
            return;
        }

        tableBody.innerHTML = "";
        prescriptions.forEach(p => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${escapeHtml(p.prescriptionDate || "N/A")}</strong></td>
                <td>${escapeHtml(p.email || "N/A")}</td>
                <td><strong style="color: #0d6efd;">${escapeHtml(p.medicine || "N/A")}</strong></td>
                <td>${escapeHtml(p.dosage || "N/A")}</td>
                <td>${escapeHtml(p.instructions || "None")}</td>
            `;
            tableBody.appendChild(tr);
        });

    } catch (err) {
        console.error("Error loading doctor prescriptions:", err);
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center" style="color: #dc3545;">Failed to load prescriptions.</td></tr>`;
    }
}

// XSS Protection helper
function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}