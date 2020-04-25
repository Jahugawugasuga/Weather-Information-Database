var apiKey = "b00dff5ac139a6450487fd6a98bd0505"
var locations = JSON.parse(localStorage.getItem("city"))||[];
var currentDate = moment().format("MM/DD/YYYY");
historyFunc();
 getWeather(locations[locations.length-1]);

$("#submitBtn").on("click", function(event){
    event.preventDefault();
    var userInput = $("#userInput").val().trim();
    getWeather(userInput); 
});

function getWeather(city) {
    
    var currentURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid="+ apiKey; 
    
$("#currentSearch").empty();

$.ajax({
    url:currentURL,
    method: "GET"

}).then(function(response) { 
    var cityName = $("<h3>").text(response.name);
    var weatherImg = response.weather[0].icon;
    var weatherEl = $("<img>").attr("src", "http://openweathermap.org/img/wn/"+weatherImg+".png");
    var cityTempDec = (((response.main.temp)-273.15)*9/5+32).toFixed(0);
    var cityTemp = $("<p>").text("Temperature: "+cityTempDec+"°F");
    var cityHumid= $("<p>").text("Humidity: " +response.main.humidity+"%");
    var cityWind = $("<p>").text("Wind Speed: "+response.wind.speed+""+" MPH");
    cityName.append(" ("+currentDate+")", weatherEl);
   
    locations.push(response.name);
    localStorage.setItem("city", JSON.stringify(locations));

    $(".history").prepend($("<li>").addClass("list-container").text(response.name));
    
    $("#currentSearch").append(cityName, cityTemp, cityHumid, cityWind);

    
      $.ajax({
        url:"http://api.openweathermap.org/data/2.5/uvi/forecast?appid="+apiKey+"&lat="+ response.coord.lat +"&lon="+ response.coord.lon,
        method : "GET"
    }).then(function(response) {
       var uvNum = $("<p>").addClass("card-text").prepend("UV Index: "+response[0].value);
        
        $("#currentSearch").append(uvNum);
        if(response[0].value >7) {
        $(".card-text:last-child").css({ color:"red"});
        }else if(response[0].value  <5) {
            $(".card-text:last-child").css({ color:"yellow"});
        }else {
            $(".card-text:last-child").css({ color:"green"});
        }

    fiveDayForecast();
    });
    function fiveDayForecast (){
        var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q="+response.name+"&appid="+apiKey
        
$(".fiveDay").empty();

    $.ajax({
        url:forecastURL,
        method: "GET"
        
    }).then(function(response) {
    
        var dataIndex = [0,8,16,24,32];
        for (var i = 0; i<dataIndex.length; i++){
        
            var day = $("<p>").addClass("card-title").text(new Date(response.list[dataIndex[i]].dt_txt).toLocaleDateString());
        var weatherImg = (response.list[dataIndex[i]].weather[0].icon);
        var weatherEl = $("<img>").attr("src", "http://openweathermap.org/img/wn/"+weatherImg+".png")
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
 function historyFunc() {
    // $(".history").prepend($("<li>").addClass("list-container").text(locations[locations.length-1]));
     for (var i=0; i<locations.length; i++) {
       $(".history").prepend($("<li>").addClass("list-container").text(locations[i]));
     }
 }
$(".history").on("click", ".list-container", function() {
console.log($(this).text());//result is undefined or 0
getWeather($(this).text());

});
