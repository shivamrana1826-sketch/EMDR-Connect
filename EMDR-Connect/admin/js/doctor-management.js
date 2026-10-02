/**
 * EMDR Connect - Admin Doctor Management Controller
 */
document.addEventListener("DOMContentLoaded", function () {
    // 1. Enforce Admin Access Control
    const adminUser = requireAuth(["ADMIN"]);
    if (!adminUser) return;

    // Elements
    const doctorsTableBody = document.getElementById("doctors-table-body");
    const doctorForm = document.getElementById("doctor-form");
    const docIdInput = document.getElementById("doc-id");
    const docNameInput = document.getElementById("doc-name");
    const docEmailInput = document.getElementById("doc-email");
    const docPasswordInput = document.getElementById("doc-password");
    const docPhoneInput = document.getElementById("doc-phone");
    const docSpecInput = document.getElementById("doc-specialization");
    const docQualInput = document.getElementById("doc-qualification");
    const docExpInput = document.getElementById("doc-experience");
    const docFeeInput = document.getElementById("doc-fee");
    const docActiveSelect = document.getElementById("doc-active");
    const docAvailableSelect = document.getElementById("doc-available");
    const docBioInput = document.getElementById("doc-biography");
    const docPhotoInput = document.getElementById("doc-photo");
    const docPreviewImg = document.getElementById("doc-preview-img");
    const previewText = document.getElementById("preview-text");
    const formHeading = document.getElementById("form-heading");
    const saveDoctorBtn = document.getElementById("save-doctor-btn");
    const resetDoctorBtn = document.getElementById("reset-doctor-btn");
    const refreshBtn = document.getElementById("refresh-doctors-btn");

    // Stats elements
    const statTotal = document.getElementById("stat-total-doctors");
    const statActive = document.getElementById("stat-active-doctors");
    const statAvailable = document.getElementById("stat-available-doctors");

    // Photo Modal
    const photoModal = document.getElementById("photo-modal");
    const photoUploadForm = document.getElementById("photo-upload-form");
    const photoDoctorIdInput = document.getElementById("photo-doctor-id");
    const photoFileInput = document.getElementById("photo-file-input");
    const photoModalCancel = document.getElementById("photo-modal-cancel");

    // Admin Logout
    const logoutBtn = document.getElementById("admin-logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (e) {
            e.preventDefault();
            handleLogout();
        });
    }

    // Image preview handler
    if (docPhotoInput) {
        docPhotoInput.addEventListener("change", function () {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    if (docPreviewImg) docPreviewImg.src = e.target.result;
                    if (previewText) previewText.textContent = "Selected: " + docPhotoInput.files[0].name;
                };
                reader.readAsDataURL(this.files[0]);
            }
        });
    }

    // 2. Load and Render Doctors
    let cachedDoctors = [];

    async function loadDoctors() {
        try {
            doctorsTableBody.innerHTML = `<tr><td colspan="8" class="text-center">Loading therapists...</td></tr>`;

            const response = await fetch(apiUrl("/api/doctors"));
            if (!response.ok) throw new Error("Failed to fetch doctors");

            cachedDoctors = await response.json();

            // Update stats
            const total = cachedDoctors.length;
            const activeCount = cachedDoctors.filter(d => d.active).length;
            const availableCount = cachedDoctors.filter(d => d.available && d.active).length;

            if (statTotal) statTotal.textContent = total;
            if (statActive) statActive.textContent = activeCount;
            if (statAvailable) statAvailable.textContent = availableCount;

            renderTable(cachedDoctors);
        } catch (error) {
            console.error("Error loading doctors:", error);
            doctorsTableBody.innerHTML = `<tr><td colspan="8" class="text-center" style="color:red;">Error loading doctors: ${error.message}</td></tr>`;
        }
    }

    function renderTable(doctors) {
        if (!doctors || doctors.length === 0) {
            doctorsTableBody.innerHTML = `<tr><td colspan="8" class="text-center">No doctors registered yet. Add one using the form below.</td></tr>`;
            return;
        }

        doctorsTableBody.innerHTML = "";

        doctors.forEach(function (doc) {
            const row = document.createElement("tr");

            const photoUrl = resolveImageUrl(doc.imagePath);
            const activeBadge = doc.active
                ? `<span class="badge-active" title="Click to Deactivate" data-action="toggle-active" data-id="${doc.id}" data-status="true"><i class="fa-solid fa-check"></i> Active</span>`
                : `<span class="badge-inactive" title="Click to Activate" data-action="toggle-active" data-id="${doc.id}" data-status="false"><i class="fa-solid fa-xmark"></i> Inactive</span>`;

            const availableBadge = doc.available
                ? `<span class="badge-available" title="Click to toggle" data-action="toggle-avail" data-id="${doc.id}" data-status="true"><i class="fa-solid fa-clock"></i> Available</span>`
                : `<span class="badge-busy" title="Click to toggle" data-action="toggle-avail" data-id="${doc.id}" data-status="false"><i class="fa-solid fa-ban"></i> Busy</span>`;

            const feeDisplay = doc.consultationFee ? `₹${doc.consultationFee}` : "N/A";

            row.innerHTML = `
                <td>
                    <img src="${photoUrl}" alt="${doc.name}" class="doctor-thumb" onerror="this.src='../images/doctor1.jpg'">
                </td>
                <td>
                    <strong>${doc.name}</strong><br>
                    <small style="color:#666;"><i class="fa-regular fa-envelope"></i> ${doc.email || 'N/A'}</small>
                </td>
                <td>
                    <span>${doc.specialization}</span><br>
                    <small style="color:#666;">${doc.qualification}</small>
                </td>
                <td>${doc.experience} Years</td>
                <td>${feeDisplay}</td>
                <td>${activeBadge}</td>
                <td>${availableBadge}</td>
                <td>
                    <button class="btn-sm btn-edit" data-action="edit" data-id="${doc.id}">
                        <i class="fa-solid fa-pen-to-square"></i> Edit
                    </button>
                    <button class="btn-sm btn-photo" data-action="photo" data-id="${doc.id}" data-name="${doc.name}">
                        <i class="fa-solid fa-camera"></i> Photo
                    </button>
                    <button class="btn-sm btn-delete" data-action="delete" data-id="${doc.id}" data-name="${doc.name}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            `;

            doctorsTableBody.appendChild(row);
        });
    }

    // 3. Delegate Table Button Clicks
    doctorsTableBody.addEventListener("click", async function (e) {
        const target = e.target.closest("[data-action]");
        if (!target) return;

        const action = target.getAttribute("data-action");
        const docId = target.getAttribute("data-id");

        if (action === "toggle-active") {
            const currentStatus = target.getAttribute("data-status") === "true";
            const newStatus = !currentStatus;
            try {
                const res = await fetch(apiUrl(`/api/doctors/${docId}/toggle-active?active=${newStatus}`), {
                    method: "PUT"
                });
                if (res.ok) {
                    loadDoctors();
                } else {
                    alert("Failed to toggle status.");
                }
            } catch (err) {
                alert("Server error toggling status.");
            }
        } else if (action === "toggle-avail") {
            const currentStatus = target.getAttribute("data-status") === "true";
            const newStatus = !currentStatus;
            try {
                const res = await fetch(apiUrl(`/api/doctors/${docId}/toggle-availability?available=${newStatus}`), {
                    method: "PUT"
                });
                if (res.ok) {
                    loadDoctors();
                } else {
                    alert("Failed to toggle availability.");
                }
            } catch (err) {
                alert("Server error toggling availability.");
            }
        } else if (action === "edit") {
            const doc = cachedDoctors.find(d => String(d.id) === String(docId));
            if (doc) populateEditForm(doc);
        } else if (action === "photo") {
            const docName = target.getAttribute("data-name");
            openPhotoModal(docId, docName);
        } else if (action === "delete") {
            const docName = target.getAttribute("data-name");
            if (confirm(`Are you sure you want to delete ${docName}? This will also delete their login account.`)) {
                try {
                    const res = await fetch(apiUrl(`/api/doctors/${docId}`), {
                        method: "DELETE"
                    });
                    if (res.ok) {
                        alert("Doctor deleted successfully.");
                        loadDoctors();
                    } else {
                        alert("Failed to delete doctor.");
                    }
                } catch (err) {
                    alert("Server error deleting doctor.");
                }
            }
        }
    });

    // 4. Populate Form for Edit
    function populateEditForm(doc) {
        docIdInput.value = doc.id;
        docNameInput.value = doc.name || "";
        docEmailInput.value = doc.email || "";
        docPhoneInput.value = doc.phone || "";
        docSpecInput.value = doc.specialization || "";
        docQualInput.value = doc.qualification || "";
        docExpInput.value = doc.experience || 0;
        docFeeInput.value = doc.consultationFee || "";
        docActiveSelect.value = String(doc.active);
        docAvailableSelect.value = String(doc.available);
        docBioInput.value = doc.biography || "";

        docPasswordInput.value = "";
        docPasswordInput.required = false;

        const photoUrl = resolveImageUrl(doc.imagePath);
        docPreviewImg.src = photoUrl;
        previewText.textContent = "Current Photo (select new file to replace)";

        formHeading.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Edit Doctor: ${doc.name}`;
        saveDoctorBtn.innerHTML = `<i class="fa-solid fa-save"></i> Update Doctor`;

        // Scroll smoothly to form
        doctorForm.scrollIntoView({ behavior: "smooth" });
    }

    // 5. Reset Form
    function resetForm() {
        docIdInput.value = "";
        doctorForm.reset();
        docPasswordInput.required = true;
        docPreviewImg.src = "../images/doctor1.jpg";
        previewText.textContent = "Choose an image from your device or reuse default photo.";
        formHeading.innerHTML = `<i class="fa-solid fa-user-plus"></i> Add New Doctor`;
        saveDoctorBtn.innerHTML = `<i class="fa-solid fa-save"></i> Save Doctor`;
    }

    resetDoctorBtn.addEventListener("click", resetForm);
    refreshBtn.addEventListener("click", loadDoctors);

    // 6. Handle Form Submission (Add or Update)
    doctorForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        saveDoctorBtn.disabled = true;
        saveDoctorBtn.textContent = "Saving...";

        const editingId = docIdInput.value.trim();

        try {
            if (editingId) {
                // EDIT EXISTING DOCTOR
                const updatePayload = {
                    id: Number(editingId),
                    name: docNameInput.value.trim(),
                    email: docEmailInput.value.trim().toLowerCase(),
                    phone: docPhoneInput.value.trim(),
                    specialization: docSpecInput.value.trim(),
                    qualification: docQualInput.value.trim(),
                    experience: Number(docExpInput.value) || 0,
                    biography: docBioInput.value.trim(),
                    consultationFee: docFeeInput.value ? Number(docFeeInput.value) : null,
                    active: docActiveSelect.value === "true",
                    available: docAvailableSelect.value === "true"
                };

                // Check if user chose a new photo file during edit
                if (docPhotoInput.files && docPhotoInput.files[0]) {
                    const photoData = new FormData();
                    photoData.append("photo", docPhotoInput.files[0]);
                    const photoRes = await fetch(apiUrl(`/api/doctors/${editingId}/upload-image`), {
                        method: "POST",
                        body: photoData
                    });
                    if (photoRes.ok) {
                        const updatedWithPhoto = await photoRes.json();
                        updatePayload.imagePath = updatedWithPhoto.imagePath;
                    }
                }

                const res = await fetch(apiUrl(`/api/doctors/${editingId}`), {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatePayload)
                });

                if (res.ok) {
                    alert("Doctor profile updated successfully!");
                    resetForm();
                    loadDoctors();
                } else {
                    const err = await res.json().catch(() => ({}));
                    alert("Failed to update doctor: " + (err.error || "Unknown error"));
                }
            } else {
                // ADD NEW DOCTOR VIA MULTIPART
                const formData = new FormData();
                formData.append("name", docNameInput.value.trim());
                formData.append("email", docEmailInput.value.trim().toLowerCase());
                formData.append("password", docPasswordInput.value || "password123");
                formData.append("phone", docPhoneInput.value.trim());
                formData.append("specialization", docSpecInput.value.trim());
                formData.append("qualification", docQualInput.value.trim());
                formData.append("experience", docExpInput.value || "0");
                if (docFeeInput.value) formData.append("consultationFee", docFeeInput.value);
                formData.append("biography", docBioInput.value.trim());
                formData.append("active", docActiveSelect.value);
                formData.append("available", docAvailableSelect.value);

                if (docPhotoInput.files && docPhotoInput.files[0]) {
                    formData.append("photo", docPhotoInput.files[0]);
                }

                const res = await fetch(apiUrl("/api/doctors/with-image"), {
                    method: "POST",
                    body: formData
                });

                if (res.ok) {
                    alert("New doctor added and account created successfully!");
                    resetForm();
                    loadDoctors();
                } else {
                    const err = await res.json().catch(() => ({}));
                    alert("Failed to create doctor: " + (err.error || "Please verify email is not already taken."));
                }
            }
        } catch (error) {
            console.error("Save doctor error:", error);
            alert("Connection error: " + error.message);
        } finally {
            saveDoctorBtn.disabled = false;
            saveDoctorBtn.innerHTML = editingId
                ? `<i class="fa-solid fa-save"></i> Update Doctor`
                : `<i class="fa-solid fa-save"></i> Save Doctor`;
        }
    });

    // 7. Dedicated Photo Upload Modal Handlers
    function openPhotoModal(docId, docName) {
        photoDoctorIdInput.value = docId;
        document.getElementById("photo-modal-subtitle").textContent = `Upload a new profile picture for ${docName}.`;
        photoFileInput.value = "";
        photoModal.style.display = "flex";
    }

    photoModalCancel.addEventListener("click", function () {
        photoModal.style.display = "none";
    });

    photoUploadForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const docId = photoDoctorIdInput.value;
        const file = photoFileInput.files[0];

        if (!file) {
            alert("Please choose an image file.");
            return;
        }

        const formData = new FormData();
        formData.append("photo", file);

        try {
            const res = await fetch(apiUrl(`/api/doctors/${docId}/upload-image`), {
                method: "POST",
                body: formData
            });

            if (res.ok) {
                alert("Doctor image updated successfully!");
                photoModal.style.display = "none";
                loadDoctors();
            } else {
                alert("Failed to upload image.");
            }
        } catch (err) {
            alert("Error uploading image: " + err.message);
        }
    });

    // Initialize list
    loadDoctors();
});
