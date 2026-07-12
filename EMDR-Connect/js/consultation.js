const consultation=document.getElementById("consultation-form");

if(consultation){

    consultation.addEventListener("submit",function(e){

        e.preventDefault();

        alert("Consultation saved successfully.");

        consultation.reset();

    });

}

const video=document.getElementById("video");
const start=document.getElementById("startCamera");
const stop=document.getElementById("stopCamera");

let stream;

if(start){

    start.addEventListener("click",async function(){

        try{

            stream=await navigator.mediaDevices.getUserMedia({
                video:true,
                audio:false
            });

            video.srcObject=stream;

        }catch(error){

            alert("Camera permission denied.");

        }

    });

}

if(stop){

    stop.addEventListener("click",function(){

        if(stream){

            stream.getTracks().forEach(function(track){
                track.stop();
            });

            video.srcObject=null;

        }

    });

}