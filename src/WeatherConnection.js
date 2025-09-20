import axios from "axios";

const apikey = import.meta.env.VITE_API_KEY;

const getWeather = (lat, lon) => {
    console.log(lat, lon, apikey)
    return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}`)
}

const getImg = (id) => {
    return axios.get(`https://openweathermap.org/img/wn/${id}@2x.png`)
}

export default {getWeather, getImg}