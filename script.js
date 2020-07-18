var apiKey = "b00dff5ac139a6450487fd6a98bd0505"
var locations = JSON.parse(localStorage.getItem("city"))||[];
var currentDate = moment().format("MM/DD/YYYY");

//history func and getweather functions defined but not invoked until called upon. get weather func retrieves weather data from local storage when invoked, the value always will be the last entry searched
historyFunc();
getWeather(locations[locations.length-1]);

//submit button will capture user input which will be passed through to getWeather 
$("#submitBtn").on("click", function(event){
    event.preventDefault();
    var userInput = $("#userInput").val().trim();
    getWeather(userInput); 
});

//get weather function utilizes the api openweather, appends the city and the api key to the url when a search is made
function getWeather(city) {
    
    var currentURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid="+ apiKey; 

 //empty currentsearch div to make room for new info   
$("#currentSearch").empty();
//ajax call to retrieve weather data for city searched by the user
$.ajax({
    url:currentURL,
    method: "GET"
//information received in the form of an object, each piece we want to use is stored in a var for later access.
}).then(function(response) { 
    var cityName = $("<h3>").text(response.name);
    var weatherImg = response.weather[0].icon;
    var weatherEl = $("<img>").attr("src", "https://openweathermap.org/img/wn/"+weatherImg+".png");
    var cityTempDec = (((response.main.temp)-273.15)*9/5+32).toFixed(0);
    var cityTemp = $("<p>").text("Temperature: "+cityTempDec+"°F");
    var cityHumid= $("<p>").text("Humidity: " +response.main.humidity+"%");
    var cityWind = $("<p>").text("Wind Speed: "+response.wind.speed+""+" MPH");
    cityName.append(" ("+currentDate+")", weatherEl);
   //add cities searched to locations in local storage, set with city key and stringify locations data
    locations.push(response.name);
    localStorage.setItem("city", JSON.stringify(locations));
//build search history 
    $(".history").prepend($("<li>").addClass("list-container").text(response.name));
 //render city data into current search main card   
    $("#currentSearch").append(cityName, cityTemp, cityHumid, cityWind);

//ajax call to get Lat and Long data for UV index in current search only     
      $.ajax({
        url:"https://api.openweathermap.org/data/2.5/uvi/forecast?appid="+apiKey+"&lat="+ response.coord.lat +"&lon="+ response.coord.lon,
        method : "GET"
    }).then(function(response) {
       var uvNum = $("<p>").addClass("card-text").prepend("UV Index: "+response[0].value);
        
        $("#currentSearch").append(uvNum);
        if(response[0].value >7) {
        $(".card-text:last-child").css({ color:"red"});
        }else if(response[0].value <5) {
            $(".card-text:last-child").css({ color:"yellow"});
        }else {
            $(".card-text:last-child").css({ color:"green"});
        }
//api call for 5 day forecast data
    fiveDayForecast();
    });
    function fiveDayForecast (){
        var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q="+response.name+"&appid="+apiKey
        
$(".fiveDay").empty();

    $.ajax({
        url:forecastURL,
        method: "GET"
        
    }).then(function(response) {
    //target datasets we want to display and apped to Weathercard
        var dataIndex = [0,8,16,24,32];
        for (var i = 0; i<dataIndex.length; i++){
        
        var day = $("<p>").addClass("card-title").text(new Date(response.list[dataIndex[i]].dt_txt).toLocaleDateString());
        var weatherImg = (response.list[dataIndex[i]].weather[0].icon);
        var weatherEl = $("<img>").attr("src", "https://openweathermap.org/img/wn/"+weatherImg+".png")
        var dailyTempDec = (((response.list[dataIndex[i]].main.temp)-273.15)*9/5+32).toFixed(0);
        var dailyTemp = $("<p>").addClass("card-text").text("Temp: "+dailyTempDec+"°F" );
        var dailyHumid = $("<p>").addClass("card-text").text("Humidity: " +response.list[dataIndex[i]].main.humidity+"%");
        var weatherCard = $("<div>").addClass("card-body fiveDayForecast");
        weatherCard.append(day, weatherEl, dailyTemp,dailyHumid);
       
        $(".fiveDay").append(weatherCard);

        }
    })    
    }
})  

}
//
 function historyFunc() {
 
     for (var i=0; i<locations.length; i++) {
       $(".history").prepend($("<li>").addClass("list-container").text(locations[i]));
     }
 }
 //if a history item gets clicked, display current weather, 5 day forecast and append to history. 
$(".history").on("click", ".list-container", function() {
getWeather($(this).text());

});
