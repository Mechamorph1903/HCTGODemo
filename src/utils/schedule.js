    //This function is what will be used to generate the stop times for stops in a route
    //It takes the minute offset of a stop and calculate all arrival times of that stop between 6:30am(390 mins after midnight) and 6:30pm(1110mins after midnight)

    export default function scheduleGenerator(minuteOffset, startTime, endTime, frequency, isDualBus, routeStatus){
        let adjustedOffset = minuteOffset

        if (routeStatus.status === "Active" && routeStatus.type === "Delay"){
            adjustedOffset = minuteOffset + (Number(routeStatus.time) || 0)
        }
        
        const schedule = []
        
        const currentFrequency =  isDualBus ? (frequency[1] || frequency[0]) : frequency[0]

        let counter = startTime //when route starts


        while (counter <= endTime ){
            let arrivalTime = counter + adjustedOffset //adds the minuteOffset to what counter currently is


            if (arrivalTime <= endTime) {
                 let arrivalTimeString = minutesToClockString(arrivalTime)
            schedule.push(arrivalTimeString) // add that to the schedule for the stop
            }
           
            counter += currentFrequency //add the frequency of the route to counter per iteration
        }

        return schedule
    }

    export function minutesToClockString(totalMinutes){
        let hour = Math.floor(totalMinutes/60)
        let minute = totalMinutes % 60
        let ampm = hour >= 12 ? "PM": "AM"

        if (hour > 12){
            hour -=12
        }

        if (hour === 0){
            hour = 12
        }

        if (minute < 10){
            minute = "0" + minute
        }

        return `${hour}:${minute} ${ampm}`
    }

    export function getNextArrivalStatus(stopTimesArray, endTime) {
    // 1. Get the current time in minutes past midnight
    const now = new Date();
    const currentMinutes = (now.getHours() * 60) + now.getMinutes();

    // 2. Safety Gate: If current time is strictly past the route's closing time
    if (currentMinutes > endTime || stopTimesArray.length === 0) {
        return "Ended for the day";
    }

    // Helper to turn a clock string like "6:42 AM" or "1:15 PM" back into minutes past midnight
    const clockStringToMinutes = (timeStr) => {
        const [time, ampm] = timeStr.split(" ");
        let [hours, minutes] = time.split(":").map(Number);
        
        if (ampm === "PM" && hours !== 12) hours += 12;
        if (ampm === "AM" && hours === 12) hours = 0;
        
        return (hours * 60) + minutes;
    };

    // 3. Find the first scheduled time that happens *after* or *at* right now
    for (let timeString of stopTimesArray) {
        const scheduledMinutes = clockStringToMinutes(timeString);
        if (scheduledMinutes >= currentMinutes) {
            return timeString; // Found it! Return the pretty string like "2:15 PM"
        }
    }

    // 4. Fallback if the loop finishes but somehow missed a window right at the boundary
    return "Ended for the day";
    } //made by Gemini was too tired from today's work and I needed to get ready for ms. sarah presentation