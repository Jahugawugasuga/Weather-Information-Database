
//referenced activity 2 used url from openweather website
var queryURL = "api.openweathermap.org/data/2.5/forecast/daily?q={" + city + "}&cnt={cnt}&appid={" + apiKey +"}";
//api key from openweather account
var apiKey = b00dff5ac139a6450487fd6a98bd0505

//used to send and receive information from openweather website
$.ajax({
    url:queryURL,
    method: "GET"

}).then(function (response) { //promise
}).catch(function catchOurErrors(error) { //error catcher

});    

//from homework example 2 - need to find object to target from openweatherapi
// $(".city").html(response.name);
// $(".wind").html(response.wind.speed);
// $(".humidity").html(response.main.humidity);
// $(".temp").html(response.name);

var city = userInput;


var userInput = document.getElementById('userInput'); 

var submitBtn = document.querySelector('.submitBtn'); 
var submitButton = submitBtn.addEventListener("click", userSubmit);

function userSubmit (event) {
    var mostRecentSearch = document.getElementsById('userInput');
    event.preventDefault();

}




// localStorage.setItem("key", JSON.stringify()) //value to be stored

// localStorage.getItem("key", JSON.parse()) //value to be retrieved