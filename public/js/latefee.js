function calculateLateFee(){

let days =
document.getElementById("days").value;

let total = days * 5;

document.getElementById("result")
.innerHTML =
"Late Fee = ₹" + total;

}