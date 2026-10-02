// Patient Dashboard JavaScript - EMDR Connect

document.addEventListener("DOMContentLoaded", function () {
    const user = requireAuth(["PATIENT"]);
    if (!user) return;

    // Display user profile info
    const nameDisplay = document.getElementById("patient-name-display");
    const emailDisplay = document.getElementById("patient-email-display");
    if (nameDisplay) {
        nameDisplay.textContent = user.fullName || user.email;
    }
    if (emailDisplay) {
        emailDisplay.textContent = `Logged in as: ${user.email}`;
    }

    // Attach logout handler
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (e) {
            e.preventDefault();
            handleLogout();
        });
    }

    // Mark all notifications read button
    const markAllReadBtn = document.getElementById("mark-all-read-btn");
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener("click", async function () {
            try {
                const res = await fetch(apiUrl(`/api/notifications/read-all?email=${encodeURIComponent(user.email)}`), {
                    method: "PUT"
                });
                if (res.ok) {
                    await loadNotifications(user.email);
                }
            } catch (err) {
                console.error("Error marking all notifications as read:", err);
            }
        });
    }

    // Initial data fetch
    loadDashboardData(user.email);
});

async function loadDashboardData(email) {
    await Promise.all([
        loadNotifications(email),
        loadAppointments(email),
        loadPrescriptions(email),
        loadConsultations(email)
    ]);
}

// 1. NOTIFICATIONS
async function loadNotifications(email) {
    const container = document.getElementById("notifications-container");
    const statNotifications = document.getElementById("stat-notifications");
    if (!container) return;

    try {
        const res = await fetch(apiUrl(`/api/notifications?email=${encodeURIComponent(email)}`));
        if (!res.ok) throw new Error("Failed to load notifications");

        const notifications = await res.json();
        const unreadCount = notifications.filter(n => !(n.read || n.isRead)).length;
        if (statNotifications) {
            statNotifications.textContent = unreadCount;
        }

        if (!notifications || notifications.length === 0) {
            container.innerHTML = `<p style="color: #888; text-align: center; padding: 15px;">No notifications yet.</p>`;
            return;
        }

        container.innerHTML = "";
        notifications.forEach(notif => {
            const isUnread = !(notif.read || notif.isRead);
            const card = document.createElement("div");
            card.className = `notification-card ${isUnread ? "unread" : ""}`;

            const type = (notif.type || "").toUpperCase();
            if (type.includes("CONFIRMED")) {
                card.classList.add("confirmed");
            } else if (type.includes("REJECTED")) {
                card.classList.add("rejected");
            }

            card.innerHTML = `
                <div>
                    <strong style="display:block; font-size: 14px; margin-bottom: 3px;">
                        ${isUnread ? '<span style="color:#0d6efd; margin-right:4px;">●</span>' : ''}
                        ${escapeHtml(notif.title || "Notification")}
                    </strong>
                    <div style="font-size: 13px; color: #444; margin-bottom: 4px;">
                        ${escapeHtml(notif.message || "")}
                    </div>
                    <small style="color: #888; font-size: 11px;">
                        ${notif.createdAt || ""}
                    </small>
                </div>
                ${isUnread ? `
                    <button class="primary-btn mark-read-btn" data-id="${notif.id}" style="padding: 4px 10px; font-size: 12px; background: #6c757d; border-color: #6c757d; white-space: nowrap;">
                        Mark Read
                    </button>
                ` : `
                    <span style="font-size: 12px; color: #198754; font-weight: 500;">
                        <i class="fa-solid fa-check"></i> Read
                    </span>
                `}
            `;

            container.appendChild(card);
        });

        // Attach listeners to mark-read buttons
        container.querySelectorAll(".mark-read-btn").forEach(btn => {
            btn.addEventListener("click", async function () {
                const notifId = this.getAttribute("data-id");
                try {
                    const putRes = await fetch(apiUrl(`/api/notifications/${notifId}/read`), {
                        method: "PUT"
                    });
                    if (putRes.ok) {
                        await loadNotifications(email);
                    }
                } catch (err) {
                    console.error("Error marking notification read:", err);
                }
            });
        });

    } catch (err) {
        console.error("Error fetching notifications:", err);
        container.innerHTML = `<p style="color: #dc3545; text-align: center; padding: 15px;">Unable to load notifications.</p>`;
    }
}

// 2. APPOINTMENTS
async function loadAppointments(email) {
    const tableBody = document.getElementById("appointment-table-body");
    const statTotal = document.getElementById("stat-total-appointments");
    const statConfirmed = document.getElementById("stat-confirmed-appointments");
    if (!tableBody) return;

    try {
        const res = await fetch(apiUrl(`/api/appointments/patient?email=${encodeURIComponent(email)}`));
        if (!res.ok) throw new Error("Failed to load appointments");

        const appointments = await res.json();

        if (statTotal) statTotal.textContent = appointments.length;
        const confirmedCount = appointments.filter(a => (a.status || "").toUpperCase() === "CONFIRMED").length;
        if (statConfirmed) statConfirmed.textContent = confirmedCount;

        if (!appointments || appointments.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding: 20px; color:#888;">No appointments found. <a href="appointment.html">Book your first appointment</a></td></tr>`;
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

            let consultationAction = "";
            if (statusUpper === "CONFIRMED") {
                consultationAction = `
                    <a href="consultation.html?appointmentId=${app.id}" class="btn-join">
                        <i class="fa-solid fa-video"></i> Join Session
                    </a>
                `;
            } else if (statusUpper === "PENDING") {
                consultationAction = `<span style="color:#888; font-size:12px;"><i class="fa-solid fa-clock"></i> Awaiting Doctor</span>`;
            } else if (statusUpper === "REJECTED") {
                consultationAction = `<span style="color:#dc3545; font-size:12px;"><i class="fa-solid fa-ban"></i> Rejected</span>`;
            } else if (statusUpper === "COMPLETED") {
                consultationAction = `<span style="color:#198754; font-size:12px;"><i class="fa-solid fa-circle-check"></i> Completed</span>`;
            } else {
                consultationAction = `<span style="color:#888; font-size:12px;"><i class="fa-solid fa-lock"></i> Locked</span>`;
            }

            tr.innerHTML = `
                <td><strong>${escapeHtml(app.appointmentDate || "N/A")}</strong></td>
                <td>${escapeHtml(app.doctorName || "EMDR Specialist")}</td>
                <td>${escapeHtml(app.appointmentTime || "N/A")}</td>
                <td>${escapeHtml(app.reason || "General Consultation")}</td>
                <td><span class="status-badge ${statusBadgeClass}">${statusUpper}</span></td>
                <td>${consultationAction}</td>
            `;

            tableBody.appendChild(tr);
        });

    } catch (err) {
        console.error("Error loading appointments:", err);
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center" style="color: #dc3545;">Failed to load appointments.</td></tr>`;
    }
}

// 3. PRESCRIPTIONS
async function loadPrescriptions(email) {
    const tableBody = document.getElementById("prescription-table-body");
    const statPrescriptions = document.getElementById("stat-prescriptions");
    if (!tableBody) return;

    try {
        const res = await fetch(apiUrl(`/api/prescriptions/patient?email=${encodeURIComponent(email)}`));
        if (!res.ok) throw new Error("Failed to load prescriptions");

        const prescriptions = await res.json();
        if (statPrescriptions) {
            statPrescriptions.textContent = prescriptions.length;
        }

        if (!prescriptions || prescriptions.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center" style="padding: 20px; color:#888;">No prescriptions found.</td></tr>`;
            return;
        }

        tableBody.innerHTML = "";
        prescriptions.forEach(p => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${escapeHtml(p.prescriptionDate || "N/A")}</strong></td>
                <td>${escapeHtml(p.doctorName || "Doctor")}</td>
                <td><strong style="color: #0d6efd;">${escapeHtml(p.medicine || "N/A")}</strong></td>
                <td>${escapeHtml(p.dosage || "N/A")}</td>
                <td>${escapeHtml(p.instructions || "Follow prescribed dosage")}</td>
            `;
            tableBody.appendChild(tr);
        });

    } catch (err) {
        console.error("Error loading prescriptions:", err);
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center" style="color: #dc3545;">Failed to load prescriptions.</td></tr>`;
    }
}

// 4. CONSULTATIONS
async function loadConsultations(email) {
    const tableBody = document.getElementById("consultation-table-body");
    if (!tableBody) return;

    try {
        const res = await fetch(apiUrl(`/api/consultations/patient?email=${encodeURIComponent(email)}`));
        if (!res.ok) throw new Error("Failed to load consultations");

        const consultations = await res.json();
        if (!consultations || consultations.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center" style="padding: 20px; color:#888;">No consultation records found yet.</td></tr>`;
            return;
        }

        tableBody.innerHTML = "";
        consultations.forEach(c => {
            const tr = document.createElement("tr");
            const statusUpper = (c.status || "SCHEDULED").toUpperCase();
            let badgeClass = statusUpper === "COMPLETED" ? "status-completed" : "status-confirmed";

            tr.innerHTML = `
                <td><strong>${escapeHtml(c.consultationDate || "N/A")}</strong></td>
                <td>${escapeHtml(c.doctorName || "EMDR Specialist")}</td>
                <td>${escapeHtml(c.consultationTime || "N/A")}</td>
                <td><span class="status-badge ${badgeClass}">${statusUpper}</span></td>
                <td>${escapeHtml(c.notes || "No notes recorded")}</td>
            `;
            tableBody.appendChild(tr);
        });

    } catch (err) {
        console.error("Error loading consultations:", err);
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center" style="color: #dc3545;">Failed to load consultation records.</td></tr>`;
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