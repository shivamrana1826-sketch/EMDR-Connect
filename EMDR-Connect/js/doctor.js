const actionButtons=document.querySelectorAll(".action-btn");

actionButtons.forEach(function(button){

    button.addEventListener("click",function(){

        const row=this.parentElement.parentElement;

        const patient=row.cells[0].textContent;
        const date=row.cells[1].textContent;
        const time=row.cells[2].textContent;
        const status=row.cells[3].textContent;

        alert(
            "Patient : "+patient+
            "\nDate : "+date+
            "\nTime : "+time+
            "\nStatus : "+status
        );

    });

});

const status=document.querySelectorAll(".status");

status.forEach(function(item){

    item.addEventListener("click",function(){

        if(this.classList.contains("pending-status")){

            this.classList.remove("pending-status");
            this.classList.add("active-status");
            this.textContent="Confirmed";

        }else if(this.classList.contains("active-status")){

            this.classList.remove("active-status");
            this.classList.add("completed-status");
            this.textContent="Completed";

        }

    });

});