

function calculatePrint(){

let pages =
document.getElementById("pages").value;

let total = pages * 2;

document.getElementById("result")
.innerHTML =
"Print Cost = ₹" + total;

}
