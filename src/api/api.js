import axios from "axios"

export const api = axios.create({
  baseURL: "https://geo.ipify.org/api/v2/country?apiKey=at_k18rtV6a0WHL1K7ZV8s5paKjaN1d7",
})
