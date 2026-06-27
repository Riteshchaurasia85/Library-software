function calculateLateFee(){

let days =
document.getElementById("days").value;

let total = days * 5;

document.getElementById("result")
.innerHTML =
"Late Fee = ₹" + total;
}

// Enter key press hone par calculate karega
document.getElementById("days").addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        event.preventDefault();
        calculateLateFee();
    }

});