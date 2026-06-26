        document.addEventListener("DOMContentLoaded", function() {
            const toast = document.getElementById("successToast");
            if (!toast) return;
            console.log("Candidate added successfully");
            toast.addEventListener("click", function() {
                window.location.href = "/page/reg-student";
            });
        });