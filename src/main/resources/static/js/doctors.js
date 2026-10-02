/**
 * EMDR Connect - Public Doctors Directory Controller
 */
document.addEventListener("DOMContentLoaded", function () {
    const doctorContainer = document.getElementById("doctor-container");
    const profileModal = document.getElementById("profile-modal");
    const closeModalBtn = document.getElementById("close-profile-modal");

    // Modal fields
    const modalDocImg = document.getElementById("modal-doc-img");
    const modalDocName = document.getElementById("modal-doc-name");
    const modalDocSpec = document.getElementById("modal-doc-spec");
    const modalDocAvail = document.getElementById("modal-doc-avail");
    const modalDocQual = document.getElementById("modal-doc-qual");
    const modalDocExp = document.getElementById("modal-doc-exp");
    const modalDocFee = document.getElementById("modal-doc-fee");
    const modalDocEmail = document.getElementById("modal-doc-email");
    const modalDocBio = document.getElementById("modal-doc-bio");
    const modalBookBtn = document.getElementById("modal-book-btn");

    let activeDoctors = [];

    async function loadActiveDoctors() {
        if (!doctorContainer) return;

        try {
            const response = await fetch(apiUrl("/api/doctors/active"));
            if (!response.ok) {
                throw new Error("Unable to fetch therapists from server.");
            }

            activeDoctors = await response.json();
            doctorContainer.innerHTML = "";

            if (!activeDoctors || activeDoctors.length === 0) {
                doctorContainer.innerHTML = `
                    <div style="text-align: center; width: 100%; padding: 40px 20px;">
                        <i class="fa-solid fa-user-doctor" style="font-size: 40px; color: #aaa; margin-bottom: 15px;"></i>
                        <h3 style="color: #666;">No Therapists Currently Available</h3>
                        <p style="color: #888;">Please check back soon or contact support.</p>
                    </div>
                `;
                return;
            }

            activeDoctors.forEach(function (doctor) {
                const card = document.createElement("div");
                card.className = "card";

                const photoUrl = resolveImageUrl(doctor.imagePath);
                const isAvail = doctor.available !== false;
                const availBadge = isAvail
                    ? `<span class="badge-available"><i class="fa-solid fa-circle-check"></i> Available</span>`
                    : `<span class="badge-unavailable"><i class="fa-solid fa-clock"></i> Currently Busy</span>`;

                card.innerHTML = `
                    <img src="${photoUrl}" alt="${doctor.name}" onerror="this.src='images/doctor1.jpg'">
                    <h3>${doctor.name}</h3>
                    <p style="color:#0d6efd; font-weight: 500; margin-bottom: 4px;">${doctor.specialization || "EMDR Therapist"}</p>
                    <div class="doc-qual">${doctor.qualification || "Qualified Specialist"}</div>
                    <div class="doc-exp">${doctor.experience || 0} Years Experience</div>
                    <div>${availBadge}</div>

                    <div class="card-btn-group">
                        <button class="btn-view-profile" data-id="${doctor.id}">
                            <i class="fa-solid fa-id-card"></i> View Profile
                        </button>
                        <a href="appointment.html?doctor=${encodeURIComponent(doctor.name)}&email=${encodeURIComponent(doctor.email || '')}" class="primary-btn">
                            Book Now
                        </a>
                    </div>
                `;

                doctorContainer.appendChild(card);
            });
        } catch (error) {
            console.error("Error loading doctors:", error);
            doctorContainer.innerHTML = `
                <div style="text-align: center; width: 100%; color: red; padding: 30px;">
                    <p>Failed to load doctors: ${error.message}</p>
                </div>
            `;
        }
    }

    // Modal Interaction
    if (doctorContainer) {
        doctorContainer.addEventListener("click", function (e) {
            const btn = e.target.closest(".btn-view-profile");
            if (!btn) return;

            const docId = btn.getAttribute("data-id");
            const doc = activeDoctors.find(d => String(d.id) === String(docId));
            if (!doc) return;

            openProfileModal(doc);
        });
    }

    function openProfileModal(doc) {
        if (!profileModal) return;

        modalDocImg.src = resolveImageUrl(doc.imagePath);
        modalDocName.textContent = doc.name;
        modalDocSpec.textContent = doc.specialization;
        modalDocQual.textContent = doc.qualification || "Not specified";
        modalDocExp.textContent = (doc.experience || 0) + " Years";
        modalDocFee.textContent = doc.consultationFee ? "₹" + doc.consultationFee : "Standard Rates";
        modalDocEmail.textContent = doc.email || "Confidential";
        modalDocBio.textContent = doc.biography || "Compassionate EMDR specialist dedicated to mental health and trauma recovery.";

        const isAvail = doc.available !== false;
        modalDocAvail.innerHTML = isAvail
            ? `<span class="badge-available"><i class="fa-solid fa-circle-check"></i> Available for Consultations</span>`
            : `<span class="badge-unavailable"><i class="fa-solid fa-clock"></i> Currently Busy</span>`;

        modalBookBtn.href = `appointment.html?doctor=${encodeURIComponent(doc.name)}&email=${encodeURIComponent(doc.email || '')}`;

        profileModal.style.display = "flex";
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", function () {
            profileModal.style.display = "none";
        });
    }

    if (profileModal) {
        profileModal.addEventListener("click", function (e) {
            if (e.target === profileModal) {
                profileModal.style.display = "none";
            }
        });
    }

    loadActiveDoctors();
});