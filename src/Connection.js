import axios from "axios";


const url = 'https://studies.cs.helsinki.fi/restcountries/api/all'

const getAll = () => {
    return axios.get(url)
}

export default {getAll}