const prescription=document.getElementById("prescription-form");

if(prescription){

    prescription.addEventListener("submit",function(e){

        e.preventDefault();

        const patient=prescription.querySelector('input[type="text"]').value.trim();
        const doctor=prescription.querySelector("select").value;
        const date=prescription.querySelectorAll('input[type="date"]')[0].value;
        const followUp=prescription.querySelectorAll('input[type="date"]')[1].value;
        const medicines=prescription.querySelectorAll("textarea")[0].value.trim();
        const instructions=prescription.querySelectorAll("textarea")[1].value.trim();

        if(patient===""||doctor===""||date===""||medicines===""||instructions===""){
            alert("Please fill all the required fields.");
            return;
        }

        alert(
            "Prescription Saved Successfully.\n\n"+
            "Patient : "+patient+
            "\nDoctor : "+doctor+
            "\nDate : "+date+
            "\nFollow-up : "+(followUp||"Not Selected")
        );

        prescription.reset();

    });

}