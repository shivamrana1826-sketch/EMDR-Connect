const forms=document.querySelectorAll("form");

forms.forEach(function(form){

    form.addEventListener("submit",function(e){

        const inputs=form.querySelectorAll("input[required],select[required],textarea[required]");
        let valid=true;

        inputs.forEach(function(input){

            if(input.value.trim()===""){
                valid=false;
                input.style.borderColor="red";
            }else{
                input.style.borderColor="#0d6efd";
            }

        });

        const email=form.querySelector('input[type="email"]');

        if(email){
            const pattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if(!pattern.test(email.value)){
                valid=false;
                email.style.borderColor="red";
                alert("Please enter a valid email address.");
            }
        }

        const phone=form.querySelector('input[type="tel"]');

        if(phone){
            const phonePattern=/^[6-9]\d{9}$/;

            if(!phonePattern.test(phone.value)){
                valid=false;
                phone.style.borderColor="red";
                alert("Please enter a valid mobile number.");
            }
        }

        const passwords=form.querySelectorAll('input[type="password"]');

        if(passwords.length===2){
            if(passwords[0].value!==passwords[1].value){
                valid=false;
                passwords[1].style.borderColor="red";
                alert("Passwords do not match.");
            }
        }

        if(!valid){
            e.preventDefault();
        }

    });

});