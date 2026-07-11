const consultation=document.getElementById("consultation-form");

if(consultation){

    consultation.addEventListener("submit",function(e){

        e.preventDefault();

        const patient=consultation.querySelector('input[type="text"]').value.trim();
        const doctor=consultation.querySelector("select").value;
        const date=consultation.querySelector('input[type="date"]').value;
        const time=consultation.querySelector('input[type="time"]').value;
        const notes=consultation.querySelector("textarea").value.trim();

        if(patient===""||doctor===""||date===""||time===""||notes===""){
            alert("Please fill all the fields.");
            return;
        }

        alert("Consultation details saved successfully.");

        consultation.reset();

    });

}