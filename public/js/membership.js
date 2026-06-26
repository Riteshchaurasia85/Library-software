
function calculateDiscount(){

let amount =
document.getElementById("amount").value;

let total = amount * 0.8;

document.getElementById("result")
.innerHTML =
"Discount Price = ₹" + total;

}
