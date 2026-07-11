const appointment=document.getElementById("appointment-form");

if(appointment){

    appointment.addEventListener("submit",function(e){

        e.preventDefault();

        const name=appointment.querySelector('input[type="text"]').value.trim();
        const email=appointment.querySelector('input[type="email"]').value.trim();
        const phone=appointment.querySelector('input[type="tel"]').value.trim();
        const doctor=appointment.querySelector("select").value;
        const date=appointment.querySelector('input[type="date"]').value;
        const time=appointment.querySelector('input[type="time"]').value;
        const reason=appointment.querySelector("textarea").value.trim();

        if(name===""||email===""||phone===""||doctor===""||date===""||time===""||reason===""){
            alert("Please fill all the fields.");
            return;
        }

        if(phone.length<10){
            alert("Please enter a valid phone number.");
            return;
        }

        alert("Your appointment has been booked successfully.");

        appointment.reset();

    });

}