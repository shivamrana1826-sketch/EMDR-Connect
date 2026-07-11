const appointmentForm=document.getElementById("appointment-form");
const consultationForm=document.getElementById("consultation-form");
const prescriptionForm=document.getElementById("prescription-form");
const loginForm=document.getElementById("login-form");
const registerForm=document.getElementById("register-form");

if(appointmentForm){
    appointmentForm.addEventListener("submit",function(e){
        e.preventDefault();
        alert("Appointment booked successfully.");
        appointmentForm.reset();
    });
}

if(consultationForm){
    consultationForm.addEventListener("submit",function(e){
        e.preventDefault();
        alert("Consultation details saved successfully.");
        consultationForm.reset();
    });
}

if(prescriptionForm){
    prescriptionForm.addEventListener("submit",function(e){
        e.preventDefault();
        alert("Prescription saved successfully.");
        prescriptionForm.reset();
    });
}

if(loginForm){
    loginForm.addEventListener("submit",function(e){
        e.preventDefault();

        const email=loginForm.querySelector('input[type="email"]').value;
        const password=loginForm.querySelector('input[type="password"]').value;

        if(email===""||password===""){
            alert("Please fill all fields.");
            return;
        }

        alert("Login successful.");
        window.location.href="patient-dashboard.html";
    });
}

if(registerForm){
    registerForm.addEventListener("submit",function(e){
        e.preventDefault();

        const password=registerForm.querySelectorAll('input[type="password"]')[0].value;
        const confirmPassword=registerForm.querySelectorAll('input[type="password"]')[1].value;

        if(password!==confirmPassword){
            alert("Passwords do not match.");
            return;
        }

        alert("Registration successful.");
        registerForm.reset();
        window.location.href="login.html";
    });
}

const currentPage=window.location.pathname.split("/").pop();
const links=document.querySelectorAll("nav ul li a");

links.forEach(function(link){
    if(link.getAttribute("href")===currentPage){
        link.classList.add("active");
    }
});