// Prescription Management JavaScript - EMDR Connect

document.addEventListener("DOMContentLoaded", function () {
    const user = getCurrentUser();

    if (!user || !user.email) {
        alert("Please log in to access the prescription management system.");
        window.location.href = "login.html";
        return;
    }

    // If patient visits, redirect to their personal dashboard where their prescriptions are shown
    if (user.role === "PATIENT") {
        alert("Patients can view their issued prescriptions on the Patient Dashboard.");
        window.location.href = "patient-dashboard.html";
        return;
    }

    const form = document.getElementById("prescription-form");
    const patientNameInput = document.getElementById("prescription-patient-name");
    const patientEmailInput = document.getElementById("prescription-patient-email");
    const doctorNameInput = document.getElementById("prescription-doctor-name");
    const dateInput = document.getElementById("prescription-date");
    const medicineInput = document.getElementById("prescription-medicine");
    const dosageInput = document.getElementById("prescription-dosage");
    const instructionsInput = document.getElementById("prescription-instructions");

    // Default to today's date
    if (dateInput) {
        dateInput.value = new Date().toISOString().split("T")[0];
    }

    // Pre-fill doctor info if logged in as DOCTOR
    if (doctorNameInput && user.role === "DOCTOR") {
        doctorNameInput.value = user.doctorName || user.fullName || user.email;
        doctorNameInput.readOnly = true;
    }

    // Parse URL query parameters if redirected from appointment/dashboard
    const urlParams = new URLSearchParams(window.location.search);
    const queryEmail = urlParams.get("patientEmail") || urlParams.get("email");
    const queryName = urlParams.get("patientName") || urlParams.get("name");

    if (queryEmail && patientEmailInput) {
        patientEmailInput.value = queryEmail;
    }
    if (queryName && patientNameInput) {
        patientNameInput.value = queryName;
    }

    // Form Submission
    if (form) {
        form.addEventListener("submit", async function (e) {
            e.preventDefault();

            const patientName = patientNameInput.value.trim();
            const patientEmail = patientEmailInput.value.trim();
            const doctorName = doctorNameInput.value.trim();
            const prescriptionDate = dateInput.value;
            const medicine = medicineInput.value.trim();
            const dosage = dosageInput.value.trim();
            const instructions = instructionsInput.value.trim();

            if (!patientName || !patientEmail || !doctorName || !prescriptionDate || !medicine || !dosage || !instructions) {
                alert("Please fill in all prescription fields.");
                return;
            }

            const payload = {
                patientName: patientName,
                email: patientEmail,
                doctorName: doctorName,
                doctorEmail: user.role === "DOCTOR" ? user.email : null,
                prescriptionDate: prescriptionDate,
                medicine: medicine,
                dosage: dosage,
                instructions: instructions
            };

            const submitBtn = document.getElementById("save-prescription-btn");
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Saving Prescription...`;
            }

            try {
                const response = await fetch(apiUrl("/api/prescriptions"), {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error("Server error saving prescription");
                }

                alert(`Prescription for ${patientName} (${medicine}) successfully recorded and delivered to their patient dashboard.`);
                
                if (user.role === "DOCTOR") {
                    window.location.href = "doctor-dashboard.html";
                } else if (user.role === "ADMIN") {
                    window.location.href = "admin/doctor-management.html";
                } else {
                    form.reset();
                }

            } catch (err) {
                console.error("Prescription error:", err);
                alert("Could not save prescription. Please verify backend connection and try again.");
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `<i class="fa-solid fa-file-prescription"></i> Issue & Save Digital Prescription`;
                }
            }
        });
    }
});