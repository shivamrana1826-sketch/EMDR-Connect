// Appointment Booking JavaScript - EMDR Connect

document.addEventListener("DOMContentLoaded", async function () {
    const user = getCurrentUser();

    // Enforce patient login for booking
    if (!user || !user.email) {
        alert("Please log in to your patient account before booking an appointment.");
        window.location.href = "login.html";
        return;
    }

    const form = document.getElementById("appointment-form");
    const nameInput = document.getElementById("patient-name-input");
    const emailInput = document.getElementById("patient-email-input");
    const doctorSelect = document.getElementById("doctor-select");
    const dateInput = document.getElementById("appointment-date-input");

    // Pre-fill user data
    if (nameInput && user.fullName) {
        nameInput.value = user.fullName;
    }
    if (emailInput && user.email) {
        emailInput.value = user.email;
        emailInput.readOnly = true;
    }

    // Set min date to today
    if (dateInput) {
        const todayStr = new Date().toISOString().split("T")[0];
        dateInput.setAttribute("min", todayStr);
    }

    // Load active doctors
    await loadActiveDoctors(doctorSelect);

    // Form submission
    if (form) {
        form.addEventListener("submit", async function (e) {
            e.preventDefault();

            const patientName = nameInput.value.trim();
            const email = emailInput.value.trim();
            const phone = document.getElementById("patient-phone-input").value.trim();
            const selectedOption = doctorSelect.options[doctorSelect.selectedIndex];
            const doctorEmail = selectedOption ? selectedOption.value : "";
            const doctorName = selectedOption ? selectedOption.getAttribute("data-name") : "";
            const appointmentDate = dateInput.value;
            const appointmentTime = document.getElementById("appointment-time-input").value;
            const reason = document.getElementById("appointment-reason-input").value.trim();

            if (!patientName || !email || !phone || !doctorEmail || !appointmentDate || !appointmentTime || !reason) {
                alert("Please fill in all required fields.");
                return;
            }

            // Simple phone validation
            const cleanPhone = phone.replace(/[^0-9]/g, "");
            if (cleanPhone.length < 10) {
                alert("Please enter a valid 10-digit phone number.");
                return;
            }

            const appointmentPayload = {
                patientName: patientName,
                email: email,
                phone: phone,
                doctorName: doctorName,
                doctorEmail: doctorEmail,
                appointmentDate: appointmentDate,
                appointmentTime: appointmentTime,
                reason: reason,
                status: "PENDING"
            };

            const submitBtn = document.getElementById("submit-appointment-btn");
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Booking...`;
            }

            try {
                const response = await fetch(apiUrl("/api/appointments/book"), {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(appointmentPayload)
                });

                if (!response.ok) {
                    throw new Error("Server error during appointment booking");
                }

                const savedAppointment = await response.json();
                alert(`Appointment successfully requested with ${doctorName}!\n\nStatus is currently PENDING confirmation by the doctor. You can track status on your dashboard.`);
                window.location.href = "patient-dashboard.html";

            } catch (err) {
                console.error("Booking failed:", err);
                alert("Appointment booking failed. Please check backend connection and try again.");
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `<i class="fa-solid fa-calendar-check"></i> Confirm & Book Appointment`;
                }
            }
        });
    }
});

// Load active doctors dynamically from MySQL
async function loadActiveDoctors(selectEl) {
    if (!selectEl) return;

    try {
        const res = await fetch(apiUrl("/api/doctors/active"));
        if (!res.ok) throw new Error("Could not load active doctors");

        const doctors = await res.json();
        selectEl.innerHTML = `<option value="">-- Choose an Available Specialist --</option>`;

        if (!doctors || doctors.length === 0) {
            selectEl.innerHTML = `<option value="">No doctors available at this time</option>`;
            return;
        }

        // Check if doctor was passed in URL query
        const urlParams = new URLSearchParams(window.location.search);
        const queryDoctorName = (urlParams.get("doctor") || "").toLowerCase().trim();
        const queryDoctorEmail = (urlParams.get("doctorEmail") || urlParams.get("email") || "").toLowerCase().trim();
        const queryDoctorId = urlParams.get("doctorId");

        let matched = false;

        doctors.forEach(doc => {
            const opt = document.createElement("option");
            opt.value = doc.email;
            opt.setAttribute("data-name", doc.name);
            opt.setAttribute("data-id", doc.id);

            const feeText = doc.consultationFee ? ` (Fee: ₹${doc.consultationFee})` : "";
            const availText = doc.available ? "" : " [Currently Busy]";
            opt.textContent = `${doc.name} - ${doc.specialization}${feeText}${availText}`;

            // Check if matches query param
            if (!matched) {
                if (queryDoctorEmail && doc.email && doc.email.toLowerCase() === queryDoctorEmail) {
                    opt.selected = true;
                    matched = true;
                } else if (queryDoctorId && String(doc.id) === String(queryDoctorId)) {
                    opt.selected = true;
                    matched = true;
                } else if (queryDoctorName && doc.name && doc.name.toLowerCase().includes(queryDoctorName)) {
                    opt.selected = true;
                    matched = true;
                }
            }

            selectEl.appendChild(opt);
        });

    } catch (err) {
        console.error("Error loading doctors into select:", err);
        selectEl.innerHTML = `<option value="">Failed to load doctors</option>`;
    }
}