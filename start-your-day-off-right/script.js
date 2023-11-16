//Get Date


/*
Set up Variables for Date
*/
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
var date = yyyy + '-' + mm + '-' + dd;
let hours = today.getHours();
let minutes = today.getMinutes();
let time = hours + ":" + minutes;
if(hours > 12) {document.querySelector("#timeOfDay").textContent = "Good Afternoon~!"}
else {document.querySelector("#timeOfDay").textContent = "Good Morning~!"}
document.querySelector("#date").textContent = "The time is " + time + " and the date is " + date;
/*
    API Call for advice.
*/
let adviceJson;
let URL = 'https://api.adviceslip.com/advice';
fetch(URL)
    .then( response => response.json())
    .then( json => {
        adviceJson = json;
    })
    .catch( err => {
        let message = 'Request to advice API did not work';
        document.querySelector("#advice").textContent = message;
    })
    .finally(() => {
        let advice = adviceJson.slip.advice;
        document.querySelector("#advice").textContent = advice;
    })
/*
    API Call for insipiration
*/
let URL4insp = 'https://type.fit/api/quotes';
let inspireJson;
fetch(URL4insp)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        inspireJson = data;
        //API Returns 16 different quotes. Get one
        i = Math.floor(Math.random() * 15);
        let div = document.querySelector("#inspiration");
        div.textContent =  inspireJson[i].text;

    })
    .catch( err => {
        document.querySelector("#inspiration").textContent = err;
    })


/*
    API Call for weather
*/

let ipURL = 'https://ipgeolocation.abstractapi.com/v1/?api_key=7b471cc3e4dc4a8da8077fa56e802dd5'
fetch(ipURL)
            .then(r => r.json())
            .then(json => {
                let weather = json;
                longitude = json.longitude;
                latitude = json.latitude;
                // this.location = "You are located in " + json.city + ", " + json.region_iso_code + ", " + json.country + " at coordinates (" + latitude + ", " + longitude + ")";
                document.querySelector("#location").innerHTML = json.city + ", " + + json.region_iso_code + ", " + json.country + " at coordinates (" + latitude + ", " + longitude + ")";
                let cwdAPI = 'https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&units=imperial' +  '&appid=483b4ebc0359c325100e78094eb0e54b' 
                return fetch(cwdAPI);
            })
            .catch(err => {
                this.location = "There was an error getting your location:" + err;
            })
            .then(j => j.json())
            .then(json => {
                let current = 'Currently ' + json.main.feels_like + "F";
                let high =  'High ' + json.main.temp_max + "F";
                let low = 'Low '  + json.main.temp_min +"F";
                let conditions = json.weather[0].description;
                let humidity = json.main.humidity + "% humidity";
                let hPa = json.main.pressure + " hPa pressure";
                // let currentStuff = {high, low, conditions, current, humidity, hPa};
                document.querySelector("#current").innerHTML = current;
                document.querySelector("#high").innerHTML = high;
                document.querySelector("#low").innerHTML = low;
                document.querySelector("#conditions").innerHTML = conditions;
                document.querySelector("#humidity").innerHTML = humidity;
                document.querySelector("#hPa").innerHTML = hPa;
            })
        
