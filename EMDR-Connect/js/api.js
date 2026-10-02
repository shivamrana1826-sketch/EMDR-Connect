/**
 * EMDR Connect - Central API Configuration & Auth Helper
 * Works both locally (http://localhost:8080) and in production without code changes.
 */

const API_BASE_URL = (window.location.protocol === 'http:' || window.location.protocol === 'https:')
    ? window.location.origin
    : 'http://localhost:8080';

function apiUrl(endpoint) {
    if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
        return endpoint;
    }
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : "/" + endpoint;
    return `${API_BASE_URL}${cleanEndpoint}`;
}

function resolveImageUrl(path) {
    if (!path || path.trim() === "") {
        return "images/doctor1.jpg";
    }
    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }
    if (path.startsWith("/uploads/")) {
        return `${API_BASE_URL}${path}`;
    }
    if (path.startsWith("uploads/")) {
        return `${API_BASE_URL}/${path}`;
    }
    return path;
}

function getCurrentUser() {
    try {
        const userJson = localStorage.getItem("emdr_user");
        if (userJson) {
            return JSON.parse(userJson);
        }
    } catch (e) {
        console.error("Error reading current user:", e);
    }

    // Fallback to legacy localStorage keys
    const email = localStorage.getItem("loggedInUserEmail");
    const role = localStorage.getItem("loggedInUserRole");
    const name = localStorage.getItem("loggedInUserName");
    const doctorId = localStorage.getItem("loggedInDoctorId");

    if (email && role) {
        return {
            email: email,
            role: role.toUpperCase(),
            fullName: name || email,
            doctorId: doctorId || null
        };
    }

    return null;
}

function setCurrentUser(userData) {
    if (!userData) {
        clearCurrentUser();
        return;
    }
    const normalized = {
        email: userData.email,
        role: (userData.role || "").toUpperCase(),
        fullName: userData.fullName || userData.name || userData.email,
        doctorId: userData.doctorId || null,
        doctorName: userData.doctorName || userData.fullName || null,
        photo: userData.photo || null,
        userId: userData.userId || null
    };

    localStorage.setItem("emdr_user", JSON.stringify(normalized));
    // Maintain backwards compatibility with existing legacy scripts
    localStorage.setItem("loggedInUserEmail", normalized.email);
    localStorage.setItem("loggedInUserRole", normalized.role);
    if (normalized.fullName) {
        localStorage.setItem("loggedInUserName", normalized.fullName);
    }
    if (normalized.doctorId) {
        localStorage.setItem("loggedInDoctorId", normalized.doctorId);
    }
}

function clearCurrentUser() {
    localStorage.removeItem("emdr_user");
    localStorage.removeItem("loggedInUserEmail");
    localStorage.removeItem("loggedInUserRole");
    localStorage.removeItem("loggedInUserName");
    localStorage.removeItem("loggedInDoctorId");
}

function requireAuth(allowedRoles) {
    const user = getCurrentUser();

    if (!user || !user.email) {
        alert("Access restricted. Please log in first.");
        window.location.href = "login.html";
        return null;
    }

    if (allowedRoles && Array.isArray(allowedRoles) && allowedRoles.length > 0) {
        const userRole = (user.role || "").toUpperCase();
        const hasRole = allowedRoles.some(r => r.toUpperCase() === userRole);
        if (!hasRole) {
            alert(`Access denied for role: ${userRole}.`);
            if (userRole === "PATIENT") {
                window.location.href = "patient-dashboard.html";
            } else if (userRole === "DOCTOR") {
                window.location.href = "doctor-dashboard.html";
            } else if (userRole === "ADMIN") {
                window.location.href = "admin/doctor-management.html";
            } else {
                window.location.href = "index.html";
            }
            return null;
        }
    }

    return user;
}

function handleLogout() {
    clearCurrentUser();
    alert("You have been logged out successfully.");
    window.location.href = "login.html";
}
