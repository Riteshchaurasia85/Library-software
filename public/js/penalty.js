
function calculatePenalty(){
  let bookPrice = parseFloat(document.getElementById("bookPrice").value);

  let months =parseInt(document.getElementById("months").value);

  let rareBook =document.getElementById("rareBook").value;

  let penalty = bookPrice + 100;

 if(months > 1){
    penalty += 50;
  }

 if(rareBook === "yes"){
    penalty += 200;
 }

  document.getElementById("result").innerHTML ="Total Penalty = ₹" + penalty;
}

// Enter key press hone par calculate karega
document.getElementById("months").addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        event.preventDefault();
        calculatePenalty();
    }
});