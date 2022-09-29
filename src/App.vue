<template>
  <div class="contenedor relative">
    <div
      :class="errorMsg != null ? 'animate__bounceInDown' : 'invisible animate__backOutDown'"
      class="animate__animated top-4 flex justify-center transition-all absolute w-full h-auto z-[9999999999]"
    >
      <p class="p-2 w-[300px] text-center bg-red-300 rounded border border-red-500">{{ errorMsg }}</p>
    </div>
    <div id="header" class="absolute shadow-lg z-[9999999]">
      <h1 class="text-3xl text-center p-4">IP Address Tracker</h1>
      <div class="p-2 flex justify-center">
        <div class="w-[320px] md:w-[420px] relative shadow-lg">
          <button
            v-if="!isLoading"
            @click="handledSubmit"
            class="submit w-[45px] text-center cursor-pointer transition-colors ease-in absolute p-2 bg-black rounded-r-md right-[-1px]"
          >
            <i class="fa-solid fa-chevron-right"></i>
          </button>
          <button
            v-else
            disabled
            class="w-[45px] text-center cursor-pointer absolute p-2 bg-black rounded-r-md right-[-1px]"
          >
            <i class="fa-solid fa-rotate animate-spin"></i>
          </button>
          <input
            v-model="userInput"
            placeholder="Search for any IP Address or domain"
            type="text"
            class="p-2 rounded-md text-black w-full"
          />
        </div>
      </div>
      <div class="p-2 flex justify-center w-full">
        <div
          class="bg-white bottom-[-155px] md:bottom-[-65px] h-[auto] md:h-[120px] flex flex-col md:flex-row justify-center items-center gap-1 text-center shadow-lg rounded-lg p-4 text-black absolute w-[75%] z-[9999999]"
        >
          <div class="w-full md:w-[23%] md:text-left p-1">
            <p class="text-gray-400 font-medium text-xs">IP ADDRESS</p>
            <h1 class="font-bold text-lg p-0 md:py-2 md:pr-3 md:border-r-2">
              {{ result.ipAddress || "...." }}
            </h1>
          </div>
          <div class="w-full md:w-[23%] md:text-left p-1">
            <p class="text-gray-400 font-medium text-xs">LOCATION</p>
            <h1 class="font-bold text-lg p-0 md:py-2 md:pr-3 md:border-r-2">{{ result.location || "...." }}</h1>
          </div>
          <div class="w-full md:w-[23%] md:text-left p-1">
            <p class="text-gray-400 font-medium text-xs">TIMEZONE</p>
            <h1 class="font-bold text-lg p-0 md:py-2 md:pr-3 md:border-r-2">{{ result.timezone || "...." }}</h1>
          </div>
          <div class="w-full md:w-[23%] md:text-left p-1">
            <p class="text-gray-400 font-medium text-xs">ISP</p>
            <h1 class="font-bold text-lg p-0 md:py-2 md:pr-3 md:border-r-2">{{ result.isp || "...." }}</h1>
          </div>
        </div>
      </div>
    </div>
    <div id="map" class="absolute inset-x-0 bottom-0"></div>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import axios from "axios"
import icon from "./assets/icon-location.svg"

const userInput = ref(null)
const errorMsg = ref(null)
const isLoading = ref(false)
const lat = ref(null)
const long = ref(null)

const result = ref({
  ipAddress: null,
  location: null,
  timezone: null,
  isp: null,
})

const mapDiv = ref()

const handledSubmit = () => {
  if (userInput.value != null && userInput.value != "") {
    result.value.ipAddress = null
    result.value.location = null
    result.value.timezone = null
    result.value.isp = null
    isLoading.value = true
    lat.value = null
    long.value = null
    axios
      .get(
        `https://geo.ipify.org/api/v2/country,city?apiKey=at_k18rtV6a0WHL1K7ZV8s5paKjaN1d7&domain=${userInput.value}`
      )
      .then(({ data }) => {
        isLoading.value = false
        const { ip, isp, location } = data
        result.value.ipAddress = ip
        result.value.location = location.region + ", " + location.country + ", " + location.postalCode
        result.value.timezone = location.timezone
        result.value.isp = isp
        mapDiv.value.setView([location.lat, location.lng], 18)

        var myIcon = L.icon({
          iconUrl: icon,
          iconSize: [38, 51],
          iconAnchor: [22, 94],
          popupAnchor: [-3, -76],
          // shadowUrl: "my-icon-shadow.png",
          shadowSize: [68, 95],
          shadowAnchor: [22, 94],
        })

        L.marker([location.lat, location.lng], { icon: myIcon }).addTo(mapDiv.value)
      })
      .catch((err) => {
        errorMsg.value = err.response.data.messages
        isLoading.value = false
        setTimeout(() => {
          errorMsg.value = null
        }, 4000)
      })
  }
}

onMounted(() => {
  mapDiv.value = L.map("map").setView([7.454241444289236, -66.30814864822081], 5)
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(mapDiv.value)
})
</script>
<style scoped>
.contenedor {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
#map {
  height: 65%;
  width: 100%;
}

#header {
  height: 35%;
  width: 100vw;
  /* position: absolute;
  top: 0px;
  */
  color: white;
  background-image: url("./assets/pattern-bg.png");
  background-repeat: no-repeat;
  background-size: cover;
}

input {
  outline: none;
}
input::placeholder {
  padding: 5px;
  font-size: 14px;
}
.submit:hover {
  background-color: rgb(46, 45, 45);
}
</style>
