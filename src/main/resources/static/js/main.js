/**
 * EMDR Connect - Main Navigation & Session State
 */
document.addEventListener("DOMContentLoaded", function () {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    // Highlight active navigation link
    const links = document.querySelectorAll("nav ul li a");
    links.forEach(function (link) {
        const href = link.getAttribute("href");
        if (href === currentPage || (currentPage === "" && href === "index.html")) {
            link.classList.add("active");
        }
    });

    // Update navbar buttons based on login state
    if (typeof getCurrentUser === "function") {
        const user = getCurrentUser();
        const navBtnContainer = document.querySelector(".nav-btn");

        if (user && user.email && navBtnContainer) {
            let dashboardUrl = "patient-dashboard.html";
            let dashboardLabel = "Dashboard";

            if (user.role === "DOCTOR") {
                dashboardUrl = "doctor-dashboard.html";
                dashboardLabel = "Doctor Dashboard";
            } else if (user.role === "ADMIN") {
                dashboardUrl = "admin/doctor-management.html";
                dashboardLabel = "Doctor Management";
            }

            navBtnContainer.innerHTML = `
                <a href="${dashboardUrl}" class="login-btn active" style="margin-right: 8px;">
                    <i class="fa-solid fa-gauge"></i> ${dashboardLabel}
                </a>
                <a href="#" id="global-logout-btn" class="register-btn" style="background:#dc3545;border-color:#dc3545;">
                    <i class="fa-solid fa-right-from-bracket"></i> Logout
                </a>
            `;

            const logoutBtn = document.getElementById("global-logout-btn");
            if (logoutBtn) {
                logoutBtn.addEventListener("click", function (e) {
                    e.preventDefault();
                    if (typeof handleLogout === "function") {
                        handleLogout();
                    } else {
                        localStorage.clear();
                        window.location.href = "login.html";
                    }
                });
            }
        }
    }

    // Dynamic Doctors on Home Page
    loadHomeDoctors();
});

async function loadHomeDoctors() {
    const homeBox = document.getElementById("home-doctor-box");
    if (!homeBox) return;

    try {
        if (typeof apiUrl !== "function") return;
        const res = await fetch(apiUrl("/api/doctors/active"));
        if (!res.ok) return;

        const docs = await res.json();
        if (docs && docs.length > 0) {
            homeBox.innerHTML = "";
            docs.slice(0, 4).forEach(function (doc) {
                const card = document.createElement("div");
                card.className = "card";
                const photo = typeof resolveImageUrl === "function" ? resolveImageUrl(doc.imagePath) : (doc.imagePath || "images/doctor1.jpg");
                card.innerHTML = `
                    <img src="${photo}" alt="${doc.name}" onerror="this.src='images/doctor1.jpg'">
                    <h3>${doc.name}</h3>
                    <p>${doc.specialization || "EMDR Therapist"}</p>
                `;
                homeBox.appendChild(card);
            });
        }
    } catch (e) {
        console.error("Home doctors load error:", e);
    }
}