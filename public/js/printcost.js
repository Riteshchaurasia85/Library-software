

function calculatePrint(){

let pages = document.getElementById("pages").value;

let total = pages * 2;

document.getElementById("result").innerHTML ="Print Cost = ₹" + total;
}

// Enter key press hone par calculate karega
document.getElementById("pages").addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        event.preventDefault();
        calculatePrint();
    }
});