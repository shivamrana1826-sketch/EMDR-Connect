const consultation = document.getElementById("consultation-form");

const loggedInUserEmail =
    localStorage.getItem("loggedInUserEmail");

if (!loggedInUserEmail) {

    alert("Please login to access consultation.");

    window.location.href = "login.html";

}

if (consultation && loggedInUserEmail) {

    consultation.addEventListener("submit", async function(e) {

        e.preventDefault();
        e.stopImmediatePropagation();

        const patientName =
            consultation.querySelector('input[type="text"]').value.trim();

        const doctorName =
            consultation.querySelector("select").value;

        const consultationDate =
            consultation.querySelector('input[type="date"]').value;

        const consultationTime =
            consultation.querySelector('input[type="time"]').value;

        const notes =
            consultation.querySelector("textarea").value.trim();

        if (
            patientName === "" ||
            doctorName === "" ||
            consultationDate === "" ||
            consultationTime === "" ||
            notes === ""
        ) {

            alert("Please fill all the required fields.");
            return;

        }

        const consultationData = {

            patientName: patientName,

            email: loggedInUserEmail,

            doctorName: doctorName,

            consultationDate: consultationDate,

            consultationTime: consultationTime,

            status: "Scheduled",

            notes: notes

        };

        try {

            const response = await fetch(
                "http://localhost:8080/api/consultations",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(consultationData)
                }
            );

            if (response.ok) {

                const result = await response.json();

                console.log("Consultation saved:", result);

                alert("Consultation saved successfully.");

                consultation.reset();

            } else {

                alert("Consultation could not be saved.");

            }

        } catch (error) {

            console.error("Consultation error:", error);

            alert("Cannot connect to backend server.");

        }

    });

}


const video = document.getElementById("video");
const start = document.getElementById("startCamera");
const stop = document.getElementById("stopCamera");

let stream;

if (start && loggedInUserEmail) {

    start.addEventListener("click", async function() {

        try {

            stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            });

            video.srcObject = stream;

        } catch (error) {

            console.error("Camera error:", error);

            alert("Camera permission denied.");

        }

    });

}


if (stop) {

    stop.addEventListener("click", function() {

        if (stream) {

            stream.getTracks().forEach(function(track) {
                track.stop();
            });

            video.srcObject = null;

            stream = null;

        }

    });

}