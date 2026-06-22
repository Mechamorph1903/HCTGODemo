//general route data
import { greenStops, redStops, brownStops, goldStops, purpleStops, orangeStops, blueStops } from "./stops"


export const Green = { 
    stops: greenStops,
    color: '#38A800', 
    name: 'Green', alt: "(4th Street)", 
    passThru: ["USM", "Midtown", "Walmart @ 49"], 
    runtime: {start: 390 , end: 1110}, 
    offlineMap: "",
    frequency: [30],
    info: "Connects Downtown to USM campus via 4th Street, serving Midtown and the Walmart on Highway 49.",
    isDualBus: false,
    isDelayed: [false, 0]// if bus is delayed will say true and delayTime
    }

export const Blue = { 
    stops: blueStops, 
    color: '#0070FF' , 
    name: 'Blue', 
    alt: "(Hardy Street)", 
    passThru: ["Midtown", "Turtle Creek"], 
    runtime: {start: 360, end: 1110}, 
    offlineMap: "", 
    frequency: [60, 30],
    info: "Our Longest route that spans the width of hattiesburg! Runs along Hardy Street from Downtown to Turtle Creek Mall, serving USM and major retail areas.",
    isDualBus: false,
    isDelayed: [false, 0]// 
    }

export const Brown = { 
    stops: brownStops, 
    color: '#732600' , 
    name: 'Brown', 
    alt: "(7th Street)", 
    passThru: ["Highway 42", "Downtown"], 
    runtime: {start: 390, end: 1110}, 
    offlineMap: "", 
    frequency: [45],
    info: "Runs north along Highway 42 from Downtown through residential neighborhoods to North Hattiesburg.",
    isDualBus: false,
    isDelayed: [false, 0]// 
    }

export const Gold = { 
    stops: goldStops, 
    color: '#E6E600' , 
    name: 'Gold', 
    alt: "(USM)", 
    passThru: ["Southern Miss"], 
    runtime: {start: 450 , end: 1095}, 
    offlineMap: "", 
    frequency: [15],
    info: "This Route goes through and around the beautiful campus of the University of Southern Mississippi, home of the Golden Eagles. Recommended for students getting around campus!",
    isDualBus: true,
    isDelayed: [false, 0]// 
    }

export const Purple = { 
    stops: purpleStops, 
    color: '#A900E6' , 
    name: 'Purple', 
    alt: "(Palmer's Crossing)", 
    passThru: ["Edwards Street", "Downtown"], 
    runtime: {start: 390, end: 1090}, 
    offlineMap: "", 
    frequency: [50],
    info: "Connects Downtown to Palmer's Crossing and the JM Tatum Industrial corridor via Edwards Street.",
    isDualBus: false,
    isDelayed: [false, 0]// 
    }

export const Orange = { 
    stops: orangeStops, 
    color: '#FC921F', 
    name: 'Orange', 
    alt: "(Broadway)", 
    passThru: ["William Carey", "James St", "Downtown"], 
    runtime: {start: 390, end: 1110}, 
    offlineMap: "", frequency: [45],
    info: "Runs through South Hattiesburg via Broadway Drive, serving William Carey University and the Walmart on Highway 49.",
    isDualBus: false,
    isDelayed: [false, 0]// 
    }

export const Red = { 
    stops: redStops, 
    color: '#E60000', 
    name: 'Red', 
    alt: "(Country Club)", 
    passThru: ["Cloverleaf", "William Carey", "Walmart @ 49"], 
    runtime: {start: 390, end: 1110}, 
    offlineMap: "", 
    frequency: [40],
    info: "Serves the Country Club Road corridor, Cloverleaf area, and connects to William Carey University.",
    isDualBus: false,
    isDelayed: [false, 0]// 
    }
         