// script.js

//Custom function
function calculateTip() {

    //    Store the date of inputs
    var billAmount = document.getElementById("billAmount").value;
    var servicesQuality = document.getElementById("servicesQuality").value;
    var numPeople = document.getElementById("totalPeople").value;

    //    Quick validation
    if(billAmount === "" || servicesQuality == 0) {
        window.alert("Please entersome values to get this baby up and running!");
        return; 
    }
    
    // Chek to see if this input is empty or <=1
    if(numPeople === "" || numPeople <=1) {
        numPeople = 1;
        document.getElementById("each").style.display = "none"
    } else {
        document.getElementById("each").style.display = "block";
    }
    
//    Do some math
    var total = (billAmount * servicesQuality) / numPeople;
    total = Math.round(total * 100) / 100;
    total = total.toFixed(2);
    
//    Display the tip
    document.getElementById("totalTip").style.display = "block";
    document.getElementById("tip").innerHTML = total;
}




// Hide the tip amount on load
document.getElementById("totalTip").style.display = "none";
document.getElementById("each").style.display = "none";

// Clicking the button calls our custom function
document.getElementById("calculate").onclick = function () {
    calculateTip();
};