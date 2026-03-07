//get local storage if possible, if not, set default to cookeville
let storedLon = localStorage.getItem("longitude");
let storedLat = localStorage.getItem("latitude");
let storedCity = localStorage.getItem("city");


let longitude = -85.5016
let latitude = 36.1628
let curCity = 'Cookeville'

if(storedLon != null){
    latitude = Number(storedLat)
    longitude = Number(storedLon)
   
}
if(storedCity != null){
    curCity = storedCity
}





//initial load of page
refresh()

//if select changes, set new values
document.querySelector('#selCity').addEventListener('change', ()=>{
    const city = document.querySelector('#selCity').value 
    //reset cards
    const divDay = document.querySelector('#divDay')
    const divWeek = document.querySelector('#divWeek')
    divDay.innerHTML = ``
    divWeek.innerHTML = ``

    if(city == "Cookeville"){
        localStorage.setItem("longitude", -85.5016);
        localStorage.setItem("latitude", 36.1628);
        localStorage.setItem("city", 'Cookeville');

    }
    if(city == "Clinton"){
        localStorage.setItem("latitude", 36.1034);
        localStorage.setItem("longitude", -84.1319);
        localStorage.setItem("city", 'Clinton');

    }
    if(city == "Atlanta"){
        localStorage.setItem("latitude", 33.7490);
        localStorage.setItem("longitude", -84.3880);
        localStorage.setItem("city", 'Atlanta');

    }
    //refresh the site with the new info
    longitude = Number(localStorage.getItem("longitude"))
    latitude = Number(localStorage.getItem("latitude"))
    curCity = localStorage.getItem("city")
    refresh()
})




function refresh(){

    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&hourly=cloud_cover,temperature_2m,precipitation_probability&current=is_day,rain,weather_code,temperature_2m&timezone=America%2FChicago&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch`)
    .then(objResponse =>{
        if(!objResponse.ok){
            throw new Error('Bad HTTP response')
        }
        return objResponse.json()
    })
    .then(objData =>{
        const divDay = document.querySelector('#divDay')
        const divWeek = document.querySelector('#divWeek')
        const txtCurrentTemp = document.querySelector('#txtCurrentTemp')
        const txtCurrentRain = document.querySelector('#txtCurrentRain')
        const txtCurrentCity = document.querySelector('#txtCurrentCity')

        const imageWeather = document.querySelector('#imageWeather')

        //loop through today to fill in div day
        for(let i = 0; i < 24; i++){
            //gather variables (converting time to right format)
            let time = objData.hourly.time[i]
            let date = new Date(time)
            let hour = date.toLocaleTimeString([], { hour: "numeric", hour12: true });
            let temp = objData.hourly.temperature_2m[i]
            let precipitation = objData.hourly.precipitation_probability[i]

            divDay.innerHTML += `<div class="card text-center p-2 flex-shrink-0" tabindex="0" role="group" aria-label="Forecast for ${hour}">
                                    <p class="mb-1">${hour}</p>
                                    <p class="mb-1"><i class="bi bi-thermometer-half"></i> ${temp}°</p>
                                    <p><i class="bi bi-cloud-rain-fill"></i> ${precipitation}%</p>
                                </div>`
        }

        //loop through the week to dill in divWeek
        for(let i = 0; i < 7; i++){
            //gather variables (converting time to right format)
            let date = new Date(objData.daily.time[i])
            let day = date.toLocaleDateString("en-US", { weekday: "long" });
            let maxTemp = objData.daily.temperature_2m_max[i]
            let minTemp = objData.daily.temperature_2m_min[i]
            let precipitation = objData.daily.precipitation_probability_max[i]
            divWeek.innerHTML += `<div class="card text-center p-2 flex-shrink-0" tabindex="0" role="group" aria-label="Forecast for ${day}">
                                    <p class="mb-1">${day}</p>
                                    <p class="mb-1">H:${maxTemp}°</p>
                                    <p class="mb-1">L:${minTemp}°</p>
                                    <p class="mb-1"><i class="bi bi-cloud-rain-fill"></i>${precipitation}%</p>
                                    <p></p>
                                </div>`
        }

        //set current info
        let isDay = objData.current.is_day
        let code = objData.current.weather_code
        let currentRain = "Clear"
        if(code > 50 && code < 67){ //all the rain codes are between these two values
            currentRain =  `Raining`
            if(isDay){
                imageWeather.src = 'images/RainDay.png'
                imageWeather.alt = 'Image of a rainy day'
            }
            if(!isDay){
                imageWeather.src = 'images/RainNight.png'
                imageWeather.alt = 'Image of a rainy night'
            }
        }
        else{
            if(isDay){
                imageWeather.src = 'images/ClearDay.png'
                imageWeather.alt = 'Image of a clear day'
            }
            if(!isDay){
                imageWeather.src = 'images/ClearNight.png'
                imageWeather.alt = 'Image of a clean night'
            }
        }
        let currentTemp = objData.current.temperature_2m
        txtCurrentTemp.innerHTML = `${currentTemp}°`
        txtCurrentRain.innerHTML = `${currentRain}`
        txtCurrentCity.innerHTML = `${curCity}`

    })
}
