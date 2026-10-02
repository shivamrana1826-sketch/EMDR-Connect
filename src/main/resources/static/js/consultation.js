// Consultation Room & Video Session - EMDR Connect

let activeStream = null;
let currentAppointment = null;

document.addEventListener("DOMContentLoaded", async function () {
    const user = getCurrentUser();
    if (!user || !user.email) {
        alert("Please log in before accessing the consultation room.");
        window.location.href = "login.html";
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const appointmentId = urlParams.get("appointmentId");

    if (appointmentId) {
        await verifyAndInitializeSession(appointmentId, user);
    } else {
        await handleMissingAppointmentId(user);
    }

    setupCameraControls();
    setupConsultationForm(user);
});

// 1. VERIFY APPOINTMENT AND INITIALIZE
async function verifyAndInitializeSession(appointmentId, user) {
    const banner = document.getElementById("access-banner");
    const bannerTitle = document.getElementById("access-title");
    const bannerMsg = document.getElementById("access-message");
    const bannerIcon = document.getElementById("access-icon");
    const lockedOverlay = document.getElementById("locked-overlay");
    const lockedReason = document.getElementById("locked-reason");
    const startBtn = document.getElementById("startCamera");

    try {
        const verifyRes = await fetch(apiUrl(`/api/consultations/verify-access?appointmentId=${encodeURIComponent(appointmentId)}&email=${encodeURIComponent(user.email)}`));
        const data = await verifyRes.json();

        if (verifyRes.ok && data.authorized) {
            currentAppointment = data.appointment;

            // Show authorized banner
            if (banner) {
                banner.className = "access-banner authorized";
                banner.style.display = "flex";
            }
            if (bannerIcon) bannerIcon.className = "fa-solid fa-circle-check";
            if (bannerTitle) bannerTitle.textContent = `Confirmed Consultation (Appointment #${currentAppointment.id})`;
            if (bannerMsg) {
                bannerMsg.textContent = `Patient: ${currentAppointment.patientName} | Doctor: ${currentAppointment.doctorName} | Date: ${currentAppointment.appointmentDate} at ${currentAppointment.appointmentTime}`;
            }

            // Unlock camera room
            if (lockedOverlay) lockedOverlay.style.display = "none";
            if (startBtn) startBtn.disabled = false;

            // Update UI elements
            const sessionHeading = document.getElementById("session-heading");
            const doctorInfoChip = document.getElementById("doctor-info-chip");
            if (sessionHeading) {
                sessionHeading.textContent = user.role === "DOCTOR"
                    ? `Session with ${currentAppointment.patientName}`
                    : `Session with ${currentAppointment.doctorName}`;
            }
            if (doctorInfoChip) {
                doctorInfoChip.textContent = currentAppointment.doctorName || "EMDR Specialist";
            }

            // Populate form
            populateConsultationForm(currentAppointment);

        } else {
            // Access denied
            lockConsultationRoom(data.message || "Consultation requires a CONFIRMED appointment.");
        }

    } catch (err) {
        console.error("Verification error:", err);
        lockConsultationRoom("Unable to verify consultation access. Please check server connection.");
    }
}

// 2. HANDLE ACCESS WITHOUT APPOINTMENT ID IN URL
async function handleMissingAppointmentId(user) {
    try {
        const endpoint = user.role === "DOCTOR"
            ? `/api/appointments/doctor?email=${encodeURIComponent(user.email)}`
            : `/api/appointments/patient?email=${encodeURIComponent(user.email)}`;

        const res = await fetch(apiUrl(endpoint));
        if (res.ok) {
            const appointments = await res.json();
            const confirmedApps = appointments.filter(a => (a.status || "").toUpperCase() === "CONFIRMED");

            if (confirmedApps.length > 0) {
                // Auto-connect to the most recent confirmed appointment
                const latest = confirmedApps[0];
                await verifyAndInitializeSession(latest.id, user);
                return;
            }
        }
    } catch (e) {
        console.error("Error auto-fetching confirmed appointments:", e);
    }

    lockConsultationRoom("No confirmed appointments found for your account. You can only enter consultation once an appointment has been confirmed by the therapist.");
}

function lockConsultationRoom(reason) {
    const banner = document.getElementById("access-banner");
    const bannerTitle = document.getElementById("access-title");
    const bannerMsg = document.getElementById("access-message");
    const bannerIcon = document.getElementById("access-icon");
    const lockedOverlay = document.getElementById("locked-overlay");
    const lockedReason = document.getElementById("locked-reason");
    const startBtn = document.getElementById("startCamera");

    if (banner) {
        banner.className = "access-banner denied";
        banner.style.display = "flex";
    }
    if (bannerIcon) bannerIcon.className = "fa-solid fa-triangle-exclamation";
    if (bannerTitle) bannerTitle.textContent = "Consultation Access Restricted";
    if (bannerMsg) bannerMsg.textContent = reason;

    if (lockedOverlay) lockedOverlay.style.display = "flex";
    if (lockedReason) lockedReason.textContent = reason;
    if (startBtn) startBtn.disabled = true;
}

function populateConsultationForm(app) {
    const aptIdInput = document.getElementById("consultation-appointment-id");
    const patientInput = document.getElementById("consultation-patient-name");
    const doctorInput = document.getElementById("consultation-doctor-name");
    const dateInput = document.getElementById("consultation-date");
    const timeInput = document.getElementById("consultation-time");

    if (aptIdInput) aptIdInput.value = app.id || "";
    if (patientInput) patientInput.value = app.patientName || "";
    if (doctorInput) doctorInput.value = app.doctorName || "";
    if (dateInput) dateInput.value = app.appointmentDate || new Date().toISOString().split("T")[0];
    if (timeInput) timeInput.value = app.appointmentTime || "10:00 AM";
}

// 3. CAMERA & VIDEO CONTROLS
function setupCameraControls() {
    const startBtn = document.getElementById("startCamera");
    const stopBtn = document.getElementById("stopCamera");
    const video = document.getElementById("video");
    const placeholder = document.getElementById("video-placeholder");
    const statusDot = document.getElementById("camera-status-dot");
    const statusText = document.getElementById("camera-status-text");

    if (startBtn) {
        startBtn.addEventListener("click", async function () {
            try {
                activeStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });

                if (video) video.srcObject = activeStream;
                if (placeholder) placeholder.style.display = "none";
                if (statusDot) statusDot.style.backgroundColor = "#198754";
                if (statusText) statusText.textContent = "Camera Live";

                startBtn.disabled = true;
                if (stopBtn) stopBtn.disabled = false;

            } catch (err) {
                console.warn("Failed with audio, trying video only:", err);
                try {
                    activeStream = await navigator.mediaDevices.getUserMedia({ video: true });
                    if (video) video.srcObject = activeStream;
                    if (placeholder) placeholder.style.display = "none";
                    if (statusDot) statusDot.style.backgroundColor = "#198754";
                    if (statusText) statusText.textContent = "Camera Live";

                    startBtn.disabled = true;
                    if (stopBtn) stopBtn.disabled = false;
                } catch (camErr) {
                    console.error("Camera access failed:", camErr);
                    alert("Unable to access camera. Please allow camera permissions in your browser.");
                }
            }
        });
    }

    if (stopBtn) {
        stopBtn.addEventListener("click", function () {
            if (activeStream) {
                activeStream.getTracks().forEach(track => track.stop());
                activeStream = null;
            }
            if (video) video.srcObject = null;
            if (placeholder) placeholder.style.display = "flex";
            if (statusDot) statusDot.style.backgroundColor = "#dc3545";
            if (statusText) statusText.textContent = "Camera Stopped";

            if (startBtn) startBtn.disabled = false;
            stopBtn.disabled = true;
        });
    }
}

// 4. SAVE CONSULTATION NOTES
function setupConsultationForm(user) {
    const form = document.getElementById("consultation-form");
    if (!form) return;

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const appointmentId = document.getElementById("consultation-appointment-id").value;
        const patientName = document.getElementById("consultation-patient-name").value.trim();
        const doctorName = document.getElementById("consultation-doctor-name").value.trim();
        const consultationDate = document.getElementById("consultation-date").value;
        const consultationTime = document.getElementById("consultation-time").value.trim();
        const notes = document.getElementById("consultation-notes").value.trim();

        if (!patientName || !doctorName || !consultationDate || !consultationTime || !notes) {
            alert("Please fill in all consultation fields.");
            return;
        }

        const payload = {
            patientName: patientName,
            email: currentAppointment ? currentAppointment.email : user.email,
            doctorName: doctorName,
            doctorEmail: currentAppointment ? currentAppointment.doctorEmail : (user.role === "DOCTOR" ? user.email : null),
            consultationDate: consultationDate,
            consultationTime: consultationTime,
            status: "Completed",
            notes: notes,
            appointmentId: appointmentId ? parseInt(appointmentId) : null
        };

        const saveBtn = document.getElementById("save-consultation-btn");
        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Saving Record...`;
        }

        try {
            const res = await fetch(apiUrl("/api/consultations"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Server error saving consultation");

            // Optionally mark appointment as completed if doctor is saving notes
            if (appointmentId && user.role === "DOCTOR") {
                await fetch(apiUrl(`/api/appointments/${appointmentId}/status?status=COMPLETED`), {
                    method: "PUT"
                });
            }

            alert("Consultation record saved successfully!");
            if (user.role === "DOCTOR") {
                window.location.href = "doctor-dashboard.html";
            } else {
                window.location.href = "patient-dashboard.html";
            }

        } catch (err) {
            console.error("Failed to save consultation:", err);
            alert("Could not save consultation record. Please try again.");
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Save Consultation Record`;
            }
        }
    });
}