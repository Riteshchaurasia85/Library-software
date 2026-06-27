
function calculateDiscount(){

let amount = document.getElementById("amount").value;

let total = amount * 0.8;

document.getElementById("result")
.innerHTML =
"Discount Price = ₹" + total;

}

// Enter key press hone par calculate karega
document.getElementById("amount").addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        event.preventDefault();
        calculateDiscount();
    }

});