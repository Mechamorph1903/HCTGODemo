// this is where all data for the bus stops will live
/**
 * Parameters:
 * ID - Identification for each stop across all routes
 * stopNum - Identification for stops within a route
 * name - what is the name of this particular stop
 * transfer - does this stop have a transfer to another route and if so what route(s)
 * route - what route is this stop on
 * Direction - Is this stop on the way out of the city centre(Outbound) or is it going towards the city centre(Inbound)
 * coords - lat/lng for the stop for leaflet
 * minuteOffset - The Minute Offset is unique to each individual bus stop along the road. It measures how many minutes of driving it takes to get from that starting line to that specific stop.
 */

/**
 * Expanding on the Minute Offset - Gemini
 * 1. The Route Base (The Starting Line)
 * Think of the Base as the scheduled time the bus driver physically turns the key in the ignition at the first stop (e.g., Walmart) to start a brand new lap.
 * If a bus leaves Walmart every hour on the hour, your Base is :00.
 * If it leaves every hour at half-past, your Base is :30.
 * 
 * 2. The Minute Offset (The Stop's Timer)
 * The Minute Offset is unique to each individual bus stop along the road. 
 * It measures how many minutes of driving it takes to get from that starting line to that specific stop.
 * If it takes 14 minutes to drive from Walmart to the USM Coliseum stop, that stop has a fixed minuteOffset of 14.
 * 
 * 
 * Putting them together in your code:
 * 
 * When your JavaScript helper function generates a full daily schedule, it simply adds them together like a basic math problem:
 * 
 *                          Route Base Time + Stop Minute Offset = Actual Arrival Time
 * 
 * 
 * If a bus has loops starting at 7:00 AM and 7:30 AM (the Route Bases), and a user is waiting at a stop with a minuteOffset of 12:
 * Loop 1: 7:00 AM Base + 12 minutes -> 7:12 AM
 * Loop 2: 7:30 AM Base + 12 minutes -> 7:42 AM
 */
export const greenStops = [
    {
        "id": 135,
        "stopNum": 1,
        "name": "Walmart 49",
        "transfer": [false, ""],
        "route": "Green Route (4th St)",
        "direction": "Station",
        "coords": [31.308032710449936, -89.31943481352033],
        "minuteOffset": 0
    },
    {
        "id": 164,
        "stopNum": 2,
        "name": "Washington St and Live Well Center",
        "transfer": [false, ""],
        "route": "Green Route (4th St)",
        "direction": "Outbound",
        "coords": [31.309506314265818, -89.3207194043768],
        "minuteOffset": 1
    },
    {
        "id": 170,
        "stopNum": 3,
        "name": "N 26th Ave and Quinn St",
        "transfer": [false, ""],
        "route": "Green Route (4th St)",
        "direction": "Outbound",
        "coords": [31.32744098762298, -89.3286964441009],
         "minuteOffset": 4
    },
    {
        "id": 169,
        "stopNum": 4,
        "name": "W 7th St at Hillcrest Lot",
        "transfer": [false, ""],
        "route": "Green Route (4th St)",
        "direction": "Outbound",
        "coords": [31.335390396092492, -89.32972950667778],
         "minuteOffset": 6
    },
    {
        "id": 1000,
        "stopNum": 5,
        "name": "Hillcrest Hall",
        "transfer": [true, ["Green", "Gold"]],
        "route": "Green Route (4th St)",
        "direction": "Outbound",
        "coords": [31.33364514342889, -89.32936978406738],
         "minuteOffset": 7

    },
    {
        "id": 130,
        "stopNum": 6,
        "name": "4th St and Eagle Walk",
        "transfer": [false, ""],
        "route": "Green Route (4th St)",
        "direction": "Outbound",
        "coords": [31.332083339573245, -89.33051104097507],
         "minuteOffset": 8
    },
    {
        "id": 131,
        "stopNum": 7,
        "name": "W 4th St and USM Coliseum",
        "transfer": [false, ""],
        "route": "Green Route (4th St)",
        "direction": "Outbound",
        "coords": [31.332305859783744, -89.33771552955471],
         "minuteOffset": 12
    },
    {
        "id": 1000,
        "stopNum": 8,
        "name": "W 4th St and Virginia Dr",
        "transfer": [false, ""],
        "route": "Green Route (4th St)",
        "direction": "Outbound",
        "coords": [31.334829891415204, -89.3438501271963],
         "minuteOffset": 13
    },
    {
        "id": 132,
        "stopNum": 9,
        "name": "ThornHill Dr @ Mark IV",
        "transfer": [false, ""],
        "route": "Green Route (4th St)",
        "direction": "Outbound",
        "coords": [31.3347765660788, -89.34924989780441],
         "minuteOffset": 15
    },
    {
        "id": 161,
        "stopNum": 10,
        "name": "Grand Theatre",
        "transfer": [false, ""],
        "route": "Green Route (4th St)",
        "direction": "Outbound",
        "coords": [31.330487317127208, -89.35077703378762],
         "minuteOffset": 16
    },
    {
        "id": 162,
        "stopNum": 11,
        "name": "Montague Blvd and 40th Ave",
        "transfer": [false, ""],
        "route": "Green Route (4th St)",
        "direction": "Outbound",
        "coords": [31.328446210524376, -89.348019205865],
         "minuteOffset": 17
    },
    {
        "id": 163,
        "stopNum": 12,
        "name": "Pearl St and 38th Ave",
        "transfer": [false, ""],
        "route": "Green Route (4th St)",
        "direction": "Outbound",
        "coords": [31.326926861837293, -89.3456296872089],
         "minuteOffset": 19
    },
    {
        "id": 160,
        "stopNum": 13,
        "name": "Hardy St at Midtown Market Shopping Center",
        "transfer": [true, ["Blue"]],
        "route": "Green Route (4th St)",
        "direction": "Inbound",
        "coords": [31.324831962068586, -89.3445067931036],
         "minuteOffset": 21
    },
    {
        "id": 133,
        "stopNum": 14,
        "name": "Hardy St and 34th Av",
        "transfer": [true, ["Blue"]],
        "route": "Green Route (4th St)",
        "direction": "Inbound",
        "coords": [31.32473987749266, -89.34051827324156],
         "minuteOffset": 22
    },
    {
        "id": 185,
        "stopNum": 15,
        "name": "Hardy St and 30th Av",
        "transfer": [true, ["Blue"]],
        "route": "Green Route (4th St)",
        "direction": "Inbound",
        "coords": [31.324663140277252, -89.33443667876722],
         "minuteOffset": 23
    },
    {
        "id": 159,
        "stopNum": 16,
        "name": "Hardy St and 29th Ave",
        "transfer": [true, ["Blue"]],
        "route": "Green Route (4th St)",
        "direction": "Inbound",
        "coords": [31.323811352985786, -89.33262208189304],
         "minuteOffset": 24
    },
    {
        "id": 134,
        "stopNum": 17,
        "name": "Midtown stop 28th st",
        "transfer": [false, ""],
        "route": "Green Route (4th St)",
        "direction": "Inbound",
        "coords": [31.32100270245347, -89.33097816492288],
         "minuteOffset": 26
    },
    {
        "id": 1850,
        "stopNum": 18,
        "name": "Mamie St at Forrest General Hospital",
        "transfer": [false, ""],
        "route": "Green Route (4th St)",
        "direction": "Inbound",
        "coords": [31.31927359842183, -89.3296919607634],
         "minuteOffset": 27
    },
    {
        "id": 135,
        "stopNum": 19,
        "name": "Walmart 49 (return)",
        "transfer": [false, ""],
        "route": "Green Route (4th St)",
        "direction": "Station",
        "coords": [31.308032710449936, -89.31943481352033],
         "minuteOffset": 30
    }
];

export const goldStops = [
    {
        "id": 194,
        "stopNum": 1,
        "name": "Parking Lot past Hillcrest",
        "transfer": [true, ["Green", "Brown"]],
        "route": "Gold Route (USM)",
        "direction": "Outbound",
        "coords": [31.335390396092492, -89.32972950667778],
        "minuteOffset": 0
    },
    {
        "id": 195,
        "stopNum": 2,
        "name": "Hillcrest",
        "transfer": [false, ""],
        "route": "Gold Route (USM)",
        "direction": "Outbound",
        "coords": [31.33389417841954, -89.32942407948113],
        "minuteOffset": 1
    },
    {
        "id": 196,
        "stopNum": 3,
        "name": "Stadium Ave @ Athletic Center",
        "transfer": [false, ""],
        "route": "Gold Route (USM)",
        "direction": "Outbound",
        "coords": [31.33047197062615, -89.33063680511486],
        "minuteOffset": 2
    },
    {
        "id": 197,
        "stopNum": 4,
        "name": "Eagle Walk and College Dr",
        "transfer": [false, ""],
        "route": "Gold Route (USM)",
        "direction": "Outbound",
        "coords": [31.327978130966855, -89.33062782196201],
        "minuteOffset": 3
    },
    {
        "id": 198,
        "stopNum": 5,
        "name": "Southern Miss Dr and W Memorial Dr",
        "transfer": [false, ""],
        "route": "Gold Route (USM)",
        "direction": "Outbound",
        "coords": [31.32588325459288, -89.33300835746526],
        "minuteOffset": 4
    },
    {
        "id": 199,
        "stopNum": 6,
        "name": "W Memorial Dr @ Hardy St",
        "transfer": [false, ""],
        "route": "Gold Route (USM)",
        "direction": "Outbound",
        "coords": [31.32495474136303, -89.33295445854822],
        "minuteOffset": 5
    },
    {
        "id": 200,
        "stopNum": 7,
        "name": "Hardy St and 30th St  (JR Gas Station)",
        "transfer": [true, ["Blue"]],
        "route": "Gold Route (USM)",
        "direction": "Outbound",
        "coords": [31.324901025441406, -89.33584703376349],
        "minuteOffset": 6
    },
    {
        "id": 201,
        "stopNum": 8,
        "name": "North 31st @ Pearl St",
        "transfer": [false, ""],
        "route": "Gold Route (USM)",
        "direction": "Inbound",
        "coords": [31.326650613986757, -89.3359368652919],
        "minuteOffset": 7
    },
    {
        "id": 202,
        "stopNum": 9,
        "name": "Pearl St @ N 34th Ave",
        "transfer": [false, ""],
        "route": "Gold Route (USM)",
        "direction": "Inbound",
        "coords": [31.32682710576256, -89.3407608183683],
        "minuteOffset": 8
    },
    {
        "id": 203,
        "stopNum": 10,
        "name": "N 35th Ave @ Montague Blvd",
        "transfer": [false, ""],
        "route": "Gold Route (USM)",
        "direction": "Inbound",
        "coords": [31.328415516854207, -89.34196456084918],
        "minuteOffset": 9
    },
    {
        "id": 204,
        "stopNum": 11,
        "name": "Montague Blvd @ DuBard School",
        "transfer": [false, ""],
        "route": "Gold Route (USM)",
        "direction": "Inbound",
        "coords": [31.328377149752427, -89.33829045133662],
        "minuteOffset": 10
    },
    {
        "id": 205,
        "stopNum": 12,
        "name": "Golden Eagle Ave @ Montague Blvd",
        "transfer": [false, ""],
        "route": "Gold Route (USM)",
        "direction": "Inbound",
        "coords": [31.328331109209643, -89.33485888695081],
        "minuteOffset": 11
    },
    {
        "id": 206,
        "stopNum": 13,
        "name": "Golden Eagle Ave @ Charles Lane Dr",
        "transfer": [false, ""],
        "route": "Gold Route (USM)",
        "direction": "Inbound",
        "coords": [31.32945909602502, -89.33472413965816],
        "minuteOffset": 12
    },
    {
        "id": 207,
        "stopNum": 14,
        "name": "4th Street @ Moffet Health Center",
        "transfer": [false, ""],
        "route": "Gold Route (USM)",
        "direction": "Inbound",
        "coords": [31.331906857652896, -89.33294547539538],
        "minuteOffset": 13
    },
    {
        "id": 194,
        "stopNum": 15,
        "name": "Parking Lot past Hillcrest (return)",
        "transfer": [true, ["Green", "Brown"]],
        "route": "Gold Route (USM)",
        "direction": "Outbound",
        "coords": [31.335390396092492, -89.32972950667778],
        "minuteOffset": 14
    }
];

export const redStops = [
    {
        "id": 78,
        "stopNum": 1,
        "name": "Walmart @ 49",
        "transfer": [true, ["Green", "Orange"]],
        "route": "Red Route (Country Club)",
        "direction": "Station",
        "coords": [31.308032710449936, -89.31943481352033],
        "minuteOffset": 0
    },
    {
        "id": 166,
        "stopNum": 2,
        "name": "On Service Rd near Cspire",
        "transfer": [false, ""],
        "route": "Red Route (Country Club)",
        "direction": "Outbound",
        "coords": [31.31095687050771, -89.31995583638519],
        "minuteOffset": 3
    },
    {
        "id": 77,
        "stopNum": 3,
        "name": "On Service Rd near Popeye's Chicken",
        "transfer": [false, ""],
        "route": "Red Route (Country Club)",
        "direction": "Outbound",
        "coords": [31.30932979002398, -89.31816818896955],
        "minuteOffset": 4
    },
    {
        "id": 76,
        "stopNum": 4,
        "name": "Bartur St and Broadway St",
        "transfer": [false, ""],
        "route": "Red Route (Country Club)",
        "direction": "Outbound",
        "coords": [31.311302237749132, -89.31312864022493],
        "minuteOffset": 5
    },
    {
        "id": 75,
        "stopNum": 5,
        "name": "S 17th St and Service Rd",
        "transfer": [false, ""],
        "route": "Red Route (Country Club)",
        "direction": "Outbound",
        "coords": [31.3097979622884, -89.31355983156138],
        "minuteOffset": 6
    },
    {
        "id": 74,
        "stopNum": 6,
        "name": "Service Dr and W Pine St",
        "transfer": [false, ""],
        "route": "Red Route (Country Club)",
        "direction": "Outbound",
        "coords": [31.30534639418434, -89.3136496630898],
        "minuteOffset": 8
    },
    {
        "id": 73,
        "stopNum": 7,
        "name": "Lincoln Rd and Hill St (Central Sunbelt)",
        "transfer": [false, ""],
        "route": "Red Route (Country Club)",
        "direction": "Outbound",
        "coords": [31.304210443120695, -89.3179256438428],
        "minuteOffset": 10
    },
    {
        "id": 72,
        "stopNum": 8,
        "name": "Lincoln Rd and Roosevelt Blvd (dollar general)",
        "transfer": [false, ""],
        "route": "Red Route (Country Club)",
        "direction": "Outbound",
        "coords": [31.30422579390205, -89.32306400726867],
        "minuteOffset": 12
    },
    {
        "id": 79,
        "stopNum": 9,
        "name": "28th Ave at Winn Dixie",
        "transfer": [false, ""],
        "route": "Red Route (Country Club)",
        "direction": "Outbound",
        "coords": [31.3033738217553, -89.33129257527236],
        "minuteOffset": 13
    },
    {
        "id": 80,
        "stopNum": 10,
        "name": "28th Ave and McInnis Loop",
        "transfer": [false, ""],
        "route": "Red Route (Country Club)",
        "direction": "Outbound",
        "coords": [31.299090818046068, -89.33082545132456],
        "minuteOffset": 14
    },
    {
        "id": 167,
        "stopNum": 11,
        "name": "McInnis Loop at Greenbriar Apts",
        "transfer": [false, ""],
        "route": "Red Route (Country Club)",
        "direction": "Outbound",
        "coords": [31.299090818046068, -89.32848084843268],
        "minuteOffset": 15
    },
    {
        "id": 81,
        "stopNum": 12,
        "name": "McInnis Loop near Disability office",
        "transfer": [false, ""],
        "route": "Red Route (Country Club)",
        "direction": "Outbound",
        "coords": [31.299106169661457, -89.32411503615124],
        "minuteOffset": 16
    },
    {
        "id": 82,
        "stopNum": 13,
        "name": "Right before McInnis Loop and Country Club Rd",
        "transfer": [false, ""],
        "route": "Red Route (Country Club)",
        "direction": "Outbound",
        "coords": [31.298108309459053, -89.31692851387729],
        "minuteOffset": 17
    },
    {
        "id": 83,
        "stopNum": 14,
        "name": "Country Club Rd at Bonhomie Apartments",
        "transfer": [false, ""],
        "route": "Red Route (Country Club)",
        "direction": "Outbound",
        "coords": [31.30221482025067, -89.31426950063593],
        "minuteOffset": 18
    },
    {
        "id": 84,
        "stopNum": 15,
        "name": "Country Club Rd at Pineview Apartments",
        "transfer": [false, ""],
        "route": "Red Route (Country Club)",
        "direction": "Outbound",
        "coords": [31.30434860006271, -89.31106251507117],
        "minuteOffset": 19
    },
    {
        "id": 85,
        "stopNum": 16,
        "name": "Country Club Rd at the park",
        "transfer": [false, ""],
        "route": "Red Route (Country Club)",
        "direction": "Outbound",
        "coords": [31.307326600452484, -89.30761298437967],
        "minuteOffset": 20
    },
    {
        "id": 86,
        "stopNum": 17,
        "name": "Country Club Rd and Killingsworth Dr",
        "transfer": [false, ""],
        "route": "Red Route (Country Club)",
        "direction": "Outbound",
        "coords": [31.310135658870692, -89.30437904935638],
        "minuteOffset": 21
    },
    {
        "id": 88,
        "stopNum": 18,
        "name": "Dumas Av and Martin Luther King Av",
        "transfer": [false, ""],
        "route": "Red Route (Country Club)",
        "direction": "Outbound",
        "coords": [31.311732026325544, -89.29955509628],
        "minuteOffset": 22
    },
    {
        "id": 87,
        "stopNum": 19,
        "name": "Martin Luther king Av and Tuscan Av",
        "transfer": [false, ""],
        "route": "Red Route (Country Club)",
        "direction": "Outbound",
        "coords": [31.306413254670787, -89.29958204573853],
        "minuteOffset": 24
    },
    {
        "id": 89,
        "stopNum": 20,
        "name": "William Carey Pkwy and Tuscan",
        "transfer": [false, ""],
        "route": "Red Route (Country Club)",
        "direction": "Outbound",
        "coords": [31.306206023723163, -89.29416520457453],
        "minuteOffset": 26
    },
    {
        "id": 90,
        "stopNum": 21,
        "name": "William Carey Pkwy at Wisteria Apartments Entrance 1",
        "transfer": [false, ""],
        "route": "Red Route (Country Club)",
        "direction": "Outbound",
        "coords": [31.300219155114576, -89.29482995788487],
        "minuteOffset": 27
    },
    {
        "id": 91,
        "stopNum": 22,
        "name": "William Carey Pkwy at Wisteria Apartments Entrance 3",
        "transfer": [false, ""],
        "route": "Red Route (Country Club)",
        "direction": "Outbound",
        "coords": [31.29942087722597, -89.2963391275624],
        "minuteOffset": 29
    },
    {
        "id": 92,
        "stopNum": 23,
        "name": "William Carey Pkwy and Dosset St",
        "transfer": [false, ""],
        "route": "Red Route (Country Club)",
        "direction": "Outbound",
        "coords": [31.29925968567788, -89.30153138990534],
        "minuteOffset": 30
    },
    {
        "id": 93,
        "stopNum": 24,
        "name": "William Carey Pkwy at JR (Just before entering HWY 49)",
        "transfer": [false, ""],
        "route": "Red Route (Country Club)",
        "direction": "Outbound",
        "coords": [31.299228982494597, -89.30769383275526],
        "minuteOffset": 31
    },
    {
        "id": 172,
        "stopNum": 25,
        "name": "Service Dr and Fred's Pharmacy",
        "transfer": [false, ""],
        "route": "Red Route (Country Club)",
        "direction": "Inbound",
        "coords": [31.306712587457042, -89.31461984359679],
        "minuteOffset": 33
    },
    {
        "id": 173,
        "stopNum": 26,
        "name": "Service Dr and Carriage Inn",
        "transfer": [false, ""],
        "route": "Red Route (Country Club)",
        "direction": "Inbound",
        "coords": [31.309621438593112, -89.3135867810199],
        "minuteOffset": 34
    },
    {
        "id": 174,
        "stopNum": 27,
        "name": "Service Dr and Summit",
        "transfer": [true, ["Orange"]],
        "route": "Red Route (Country Club)",
        "direction": "Inbound",
        "coords": [31.309199315371785, -89.31533849582418],
        "minuteOffset": 35
    },
    {
        "id": 175,
        "stopNum": 28,
        "name": "Service Dr and Popeye's Chicken",
        "transfer": [true, ["Orange"]],
        "route": "Red Route (Country Club)",
        "direction": "Inbound",
        "coords": [31.31005123483861, -89.31799750906553],
        "minuteOffset": 36
    },
    {
        "id": 176,
        "stopNum": 29,
        "name": "Cloverleaf Mall",
        "transfer": [true, ["Orange"]],
        "route": "Red Route (Country Club)",
        "direction": "Inbound",
        "coords": [31.31148643309345, -89.31839276779061],
        "minuteOffset": 37
    },
    {
        "id": 78,
        "stopNum": 30,
        "name": "Walmart @ 49 (return)",
        "transfer": [true, ["Green", "Orange"]],
        "route": "Red Route (Country Club)",
        "direction": "Station",
        "coords": [31.308032710449936, -89.31943481352033],
        "minuteOffset": 40
    }
];

export const blueStops = [
    {
        "id": 1,
        "stopNum": 1,
        "name": "Train Depot",
        "transfer": [true, ["Red", "Brown", "Purple"]],
        "route": "Blue Route (Hardy St)",
        "direction": "Station",
        "coords": [31.329904148328566, -89.28373576412446],
        "minuteOffset": 0
    },
    {
        "id": 2,
        "stopNum": 2,
        "name": "Main St and W Front",
        "transfer": [false, ""],
        "route": "Blue Route (Hardy St)",
        "direction": "Outbound",
        "coords": [31.326397386078284, -89.28950294824931],
        "minuteOffset": 2
    },
    {
        "id": 3,
        "stopNum": 3,
        "name": "Main St and New Orleans St (Federal Building)",
        "transfer": [false, ""],
        "route": "Blue Route (Hardy St)",
        "direction": "Outbound",
        "coords": [31.328024171682273, -89.29192839951676],
        "minuteOffset": 3
    },
    {
        "id": 4,
        "stopNum": 4,
        "name": "On McLeod St (By FireStation No.1)",
        "transfer": [false, ""],
        "route": "Blue Route (Hardy St)",
        "direction": "Outbound",
        "coords": [31.327993477874514, -89.2937340132381],
        "minuteOffset": 4
    },
    {
        "id": 5,
        "stopNum": 5,
        "name": "On Hardy St (Main Library)",
        "transfer": [false, ""],
        "route": "Blue Route (Hardy St)",
        "direction": "Outbound",
        "coords": [31.324908699146377, -89.29694099880285],
        "minuteOffset": 5
    },
    {
        "id": 6,
        "stopNum": 6,
        "name": "Hardy St and Hutchinson Ave.",
        "transfer": [false, ""],
        "route": "Blue Route (Hardy St)",
        "direction": "Outbound",
        "coords": [31.324847309489158, -89.30993063781303],
        "minuteOffset": 7
    },
    {
        "id": 7,
        "stopNum": 7,
        "name": "Hardy and 17th Ave. (Across Zoo)",
        "transfer": [false, ""],
        "route": "Blue Route (Hardy St)",
        "direction": "Outbound",
        "coords": [31.324847309489158, -89.31440424792856],
        "minuteOffset": 8
    },
    {
        "id": 8,
        "stopNum": 8,
        "name": "Hardy St and Park Ave.",
        "transfer": [false, ""],
        "route": "Blue Route (Hardy St)",
        "direction": "Outbound",
        "coords": [31.324847309489158, -89.31774598078596],
        "minuteOffset": 9
    },
    {
        "id": 9,
        "stopNum": 9,
        "name": "Hardy St and 20th Ave",
        "transfer": [false, ""],
        "route": "Blue Route (Hardy St)",
        "direction": "Outbound",
        "coords": [31.324854983198506, -89.32269569800214],
        "minuteOffset": 10
    },
    {
        "id": 10,
        "stopNum": 10,
        "name": "Hardy St and 25th Ave",
        "transfer": [false, ""],
        "route": "Blue Route (Hardy St)",
        "direction": "Outbound",
        "coords": [31.32487800432277, -89.3276813478297],
        "minuteOffset": 11
    },
    {
        "id": 11,
        "stopNum": 11,
        "name": "Hardy St and USM Rose Garden",
        "transfer": [false, ""],
        "route": "Blue Route (Hardy St)",
        "direction": "Outbound",
        "coords": [31.32487800432277, -89.33120274374394],
        "minuteOffset": 13
    },
    {
        "id": 12,
        "stopNum": 12,
        "name": "Hardy St and 30th Ave (JR Gas Station)",
        "transfer": [true, ["Gold"]],
        "route": "Blue Route (Hardy St)",
        "direction": "Outbound",
        "coords": [31.324901025441406, -89.33584703376349],
        "minuteOffset": 14
    },
    {
        "id": 13,
        "stopNum": 13,
        "name": "Hardy St and Ross St (34th)",
        "transfer": [false, ""],
        "route": "Blue Route (Hardy St)",
        "direction": "Outbound",
        "coords": [31.32495474136303, -89.33946724435899],
        "minuteOffset": 15
    },
    {
        "id": 14,
        "stopNum": 14,
        "name": "Hardy St and 36th Ave",
        "transfer": [false, ""],
        "route": "Blue Route (Hardy St)",
        "direction": "Outbound",
        "coords": [31.325039152035075, -89.34311440441301],
        "minuteOffset": 16
    },
    {
        "id": 15,
        "stopNum": 15,
        "name": "Hardy St and 38th Ave",
        "transfer": [true, ["Green"]],
        "route": "Blue Route (Hardy St)",
        "direction": "Outbound",
        "coords": [31.32508519418795, -89.3454590073049],
        "minuteOffset": 17
    },
    {
        "id": 16,
        "stopNum": 16,
        "name": "Hardy St and 40th Ave",
        "transfer": [false, ""],
        "route": "Blue Route (Hardy St)",
        "direction": "Outbound",
        "coords": [31.325115888943998, -89.34757903137572],
        "minuteOffset": 18
    },
    {
        "id": 17,
        "stopNum": 17,
        "name": "Hardy St and Coco Cola Ave",
        "transfer": [false, ""],
        "route": "Blue Route (Hardy St)",
        "direction": "Outbound",
        "coords": [31.324379212036376, -89.35920323115384],
        "minuteOffset": 21
    },
    {
        "id": 18,
        "stopNum": 18,
        "name": "Hardy St (Across from McDonald's)",
        "transfer": [false, ""],
        "route": "Blue Route (Hardy St)",
        "direction": "Outbound",
        "coords": [31.32370391980713, -89.36347921190684],
        "minuteOffset": 22
    },
    {
        "id": 19,
        "stopNum": 19,
        "name": "Wesley (Green Eye Institute)",
        "transfer": [false, ""],
        "route": "Blue Route (Hardy St)",
        "direction": "Outbound",
        "coords": [31.32441758076763, -89.3660304273141],
        "minuteOffset": 23
    },
    {
        "id": 20,
        "stopNum": 20,
        "name": "Wesley (Front Entrance)",
        "transfer": [false, ""],
        "route": "Blue Route (Hardy St)",
        "direction": "Outbound",
        "coords": [31.325576309083942, -89.36663229855453],
        "minuteOffset": 24
    },
    {
        "id": 21,
        "stopNum": 21,
        "name": "Wesley (Millsaps Dr)",
        "transfer": [false, ""],
        "route": "Blue Route (Hardy St)",
        "direction": "Outbound",
        "coords": [31.323972502523915, -89.3677012937428],
        "minuteOffset": 25
    },
    {
        "id": 22,
        "stopNum": 22,
        "name": "Turtle Creek Mall (Between Dillards and Pier 1 imports)",
        "transfer": [false, ""],
        "route": "Blue Route (Hardy St)",
        "direction": "Outbound",
        "coords": [31.324402233277013, -89.37435780999904],
        "minuteOffset": 27
    },
    {
        "id": 23,
        "stopNum": 23,
        "name": "Turtle Creek Mall (Between Dick's and Dillards)",
        "transfer": [false, ""],
        "route": "Blue Route (Hardy St)",
        "direction": "Outbound",
        "coords": [31.323419988673407, -89.37577714814816],
        "minuteOffset": 28
    },
    {
        "id": 24,
        "stopNum": 24,
        "name": "Turtle Creek Mall (In front of Rio Grande)",
        "transfer": [false, ""],
        "route": "Blue Route (Hardy St)",
        "direction": "Outbound",
        "coords": [31.32739494662232, -89.37804988581729],
        "minuteOffset": 29
    },
    {
        "id": 25,
        "stopNum": 25,
        "name": "Cross Creek Parkway (Across Bed Bath and Beyond)",
        "transfer": [false, ""],
        "route": "Blue Route (Hardy St)",
        "direction": "Outbound",
        "coords": [31.323627181747327, -89.38135568606332],
        "minuteOffset": 30
    },
    {
        "id": 26,
        "stopNum": 26,
        "name": "Walmart @ 98",
        "transfer": [false, ""],
        "route": "Blue Route (Hardy St)",
        "direction": "Station",
        "coords": [31.320511563699426, -89.37926261145103],
        "minuteOffset": 31
    },
    {
        "id": 27,
        "stopNum": 27,
        "name": "Hardy St (Lowes)",
        "transfer": [false, ""],
        "route": "Blue Route (Hardy St)",
        "direction": "Inbound",
        "coords": [31.321992646218632, -89.37514832744918],
        "minuteOffset": 33
    },
    {
        "id": 28,
        "stopNum": 28,
        "name": "Hardy St (TJ Max)",
        "transfer": [false, ""],
        "route": "Blue Route (Hardy St)",
        "direction": "Inbound",
        "coords": [31.322276581656865, -89.37153710000652],
        "minuteOffset": 34
    },
    {
        "id": 29,
        "stopNum": 29,
        "name": "Hardy St (Shell Gas station)",
        "transfer": [false, ""],
        "route": "Blue Route (Hardy St)",
        "direction": "Inbound",
        "coords": [31.32272934180054, -89.36671314693012],
        "minuteOffset": 35
    },
    {
        "id": 30,
        "stopNum": 30,
        "name": "Hardy St (McDonald's)",
        "transfer": [false, ""],
        "route": "Blue Route (Hardy St)",
        "direction": "Inbound",
        "coords": [31.32322814282803, -89.3631109026403],
        "minuteOffset": 36
    },
    {
        "id": 31,
        "stopNum": 31,
        "name": "Hardy St on Service Rd (Best Buy)",
        "transfer": [false, ""],
        "route": "Blue Route (Hardy St)",
        "direction": "Inbound",
        "coords": [31.323036296591738, -89.35785575822747],
        "minuteOffset": 37
    },
    {
        "id": 32,
        "stopNum": 32,
        "name": "Georgia Blue",
        "transfer": [false, ""],
        "route": "Blue Route (Hardy St)",
        "direction": "Inbound",
        "coords": [31.323289533541086, -89.35586149829645],
        "minuteOffset": 39
    },
    {
        "id": 33,
        "stopNum": 33,
        "name": "Hardy St and 38th Ave",
        "transfer": [true, ["Green"]],
        "route": "Blue Route (Hardy St)",
        "direction": "Inbound",
        "coords": [31.324831962068586, -89.3445067931036],
        "minuteOffset": 41
    },
    {
        "id": 34,
        "stopNum": 34,
        "name": "Hardy St and 34th Ave",
        "transfer": [true, ["Green"]],
        "route": "Blue Route (Hardy St)",
        "direction": "Inbound",
        "coords": [31.32473987749266, -89.34051827324156],
        "minuteOffset": 42
    },
    {
        "id": 35,
        "stopNum": 35,
        "name": "Hardy St and 30th Ave",
        "transfer": [true, ["Green"]],
        "route": "Blue Route (Hardy St)",
        "direction": "Inbound",
        "coords": [31.324663140277252, -89.33443667876722],
        "minuteOffset": 43
    },
    {
        "id": 36,
        "stopNum": 36,
        "name": "Hardy St and 29th Ave",
        "transfer": [true, ["Blue", "Green"]],
        "route": "Blue Route (Hardy St)",
        "direction": "Inbound",
        "coords": [31.323811352985786, -89.33262208189304],
        "minuteOffset": 44
    },
    {
        "id": 37,
        "stopNum": 37,
        "name": "28th Ave @ Pine Grove Health Center",
        "transfer": [false, ""],
        "route": "Blue Route (Hardy St)",
        "direction": "Inbound",
        "coords": [31.321240596866488, -89.33122969320246],
        "minuteOffset": 46
    },
    {
        "id": 38,
        "stopNum": 38,
        "name": "28th Ave and Hardy",
        "transfer": [false, ""],
        "route": "Blue Route (Hardy St)",
        "direction": "Inbound",
        "coords": [31.324775723714975, -89.3311647714052],
        "minuteOffset": 47
    },
    {
        "id": 39,
        "stopNum": 39,
        "name": "Hardy St and 25th Ave",
        "transfer": [false, ""],
        "route": "Blue Route (Hardy St)",
        "direction": "Inbound",
        "coords": [31.324794053588054, -89.32783883225653],
        "minuteOffset": 49
    },
    {
        "id": 40,
        "stopNum": 40,
        "name": "Hardy and 21st Ave",
        "transfer": [false, ""],
        "route": "Blue Route (Hardy St)",
        "direction": "Inbound",
        "coords": [31.324601750459905, -89.32287536105899],
        "minuteOffset": 50
    },
    {
        "id": 41,
        "stopNum": 41,
        "name": "Hardy St and Park Ave(Shelter)",
        "transfer": [false, ""],
        "route": "Blue Route (Hardy St)",
        "direction": "Inbound",
        "coords": [31.3246247716461, -89.31797055960702],
        "minuteOffset": 51
    },
    {
        "id": 42,
        "stopNum": 42,
        "name": "Hardy and 17th Ave. (Zoo)",
        "transfer": [false, ""],
        "route": "Blue Route (Hardy St)",
        "direction": "Inbound",
        "coords": [31.324617097918008, -89.31467374251385],
        "minuteOffset": 52
    },
    {
        "id": 43,
        "stopNum": 43,
        "name": "Hardy St and Hutchinson Ave.",
        "transfer": [false, ""],
        "route": "Blue Route (Hardy St)",
        "direction": "Inbound",
        "coords": [31.32464779282668, -89.3095443622408],
        "minuteOffset": 53
    },
    {
        "id": 44,
        "stopNum": 44,
        "name": "Hardy St and Pinehurst St",
        "transfer": [false, ""],
        "route": "Blue Route (Hardy St)",
        "direction": "Inbound",
        "coords": [31.324655466552272, -89.30365141397616],
        "minuteOffset": 54
    },
    {
        "id": 45,
        "stopNum": 45,
        "name": "Hardy St and Mamie St",
        "transfer": [false, ""],
        "route": "Blue Route (Hardy St)",
        "direction": "Inbound",
        "coords": [31.324701508892787, -89.29994137185223],
        "minuteOffset": 55
    },
    {
        "id": 46,
        "stopNum": 46,
        "name": "Hardy St and 1st Ave",
        "transfer": [false, ""],
        "route": "Blue Route (Hardy St)",
        "direction": "Inbound",
        "coords": [31.324709182614015, -89.29569234055775],
        "minuteOffset": 56
    },
    {
        "id": 47,
        "stopNum": 47,
        "name": "Front St and Forrest St.",
        "transfer": [true, ["Blue", "Orange", "Red"]],
        "route": "Blue Route (Hardy St)",
        "direction": "Inbound",
        "coords": [31.325476551578035, -89.29076957280009],
        "minuteOffset": 57
    },
    {
        "id": 48,
        "stopNum": 48,
        "name": "Main St and Short St",
        "transfer": [true, ["Blue", "Brown", "Orange"]],
        "route": "Blue Route (Hardy St)",
        "direction": "Inbound",
        "coords": [31.325967664432426, -89.28922447051119],
        "minuteOffset": 58
    },
    {
        "id": 49,
        "stopNum": 49,
        "name": "Buschman St and River Av",
        "transfer": [false, ""],
        "route": "Blue Route (Hardy St)",
        "direction": "Inbound",
        "coords": [31.326374365325563, -89.2856491756799],
        "minuteOffset": 59
    },
    {
        "id": 50,
        "stopNum": 50,
        "name": "Train Depot (return)",
        "transfer": [true, ["Red", "Brown", "Purple"]],
        "route": "Blue Route (Hardy St)",
        "direction": "Station",
        "coords": [31.329904148328566, -89.28373576412446],
        "minuteOffset": 60
    }
];

export const purpleStops = [
    {
        "id": 1,
        "stopNum": 1,
        "name": "Train Depot",
        "transfer": [true, ["Blue", "Brown", "Orange"]],
        "route": "Purple Route (Palmer's Crossing)",
        "direction": "Station",
        "coords": [31.329904148328566, -89.28373576412446],
        "minuteOffset": 0
    },
    {
        "id": 2,
        "stopNum": 2,
        "name": "Main St and Buschman St",
        "transfer": [false, ""],
        "route": "Purple Route (Palmer's Crossing)",
        "direction": "Outbound",
        "coords": [31.32437153828826, -89.28733800841427],
        "minuteOffset": 2
    },
    {
        "id": 3,
        "stopNum": 3,
        "name": "Bay St and Rebecca Av",
        "transfer": [false, ""],
        "route": "Purple Route (Palmer's Crossing)",
        "direction": "Outbound",
        "coords": [31.319068828794016, -89.28637681106014],
        "minuteOffset": 4
    },
    {
        "id": 4,
        "stopNum": 4,
        "name": "Katie St and Arnold St",
        "transfer": [false, ""],
        "route": "Purple Route (Palmer's Crossing)",
        "direction": "Outbound",
        "coords": [31.31567677986456, -89.29014973525396],
        "minuteOffset": 5
    },
    {
        "id": 5,
        "stopNum": 5,
        "name": "Edwards St and Katie St",
        "transfer": [true, ["Orange"]],
        "route": "Purple Route (Palmer's Crossing)",
        "direction": "Outbound",
        "coords": [31.315761198854375, -89.28519103488493],
        "minuteOffset": 6
    },
    {
        "id": 6,
        "stopNum": 6,
        "name": "Edwards St and Duke Av",
        "transfer": [false, ""],
        "route": "Purple Route (Palmer's Crossing)",
        "direction": "Outbound",
        "coords": [31.311939245117046, -89.28514611912071],
        "minuteOffset": 9
    },
    {
        "id": 7,
        "stopNum": 7,
        "name": "Edwards St and Tuscan Av",
        "transfer": [true, ["Brown"]],
        "route": "Purple Route (Palmer's Crossing)",
        "direction": "Outbound",
        "coords": [31.30630580164373, -89.28514611912071],
        "minuteOffset": 10
    },
    {
        "id": 8,
        "stopNum": 8,
        "name": "Lilac St and Hattiesburg St",
        "transfer": [false, ""],
        "route": "Purple Route (Palmer's Crossing)",
        "direction": "Outbound",
        "coords": [31.301186290420233, -89.28283744884021],
        "minuteOffset": 11
    },
    {
        "id": 9,
        "stopNum": 9,
        "name": "Edwards St and Dixie Pine Rd",
        "transfer": [false, ""],
        "route": "Purple Route (Palmer's Crossing)",
        "direction": "Outbound",
        "coords": [31.29643495094342, -89.28633189529593],
        "minuteOffset": 12
    },
    {
        "id": 10,
        "stopNum": 10,
        "name": "Edwards St and Fellowship Center",
        "transfer": [false, ""],
        "route": "Purple Route (Palmer's Crossing)",
        "direction": "Outbound",
        "coords": [31.293203289168787, -89.28685291816079],
        "minuteOffset": 13
    },
    {
        "id": 11,
        "stopNum": 11,
        "name": "Edwards St and Barkley Rd",
        "transfer": [false, ""],
        "route": "Purple Route (Palmer's Crossing)",
        "direction": "Outbound",
        "coords": [31.28818286324315, -89.28573002405548],
        "minuteOffset": 14
    },
    {
        "id": 12,
        "stopNum": 12,
        "name": "Edwards St and Central School Rd",
        "transfer": [false, ""],
        "route": "Purple Route (Palmer's Crossing)",
        "direction": "Outbound",
        "coords": [31.28088971937322, -89.28835310468547],
        "minuteOffset": 15
    },
    {
        "id": 13,
        "stopNum": 13,
        "name": "Old Airport Rd and Edwards St",
        "transfer": [false, ""],
        "route": "Purple Route (Palmer's Crossing)",
        "direction": "Outbound",
        "coords": [31.27734274449351, -89.28874836341055],
        "minuteOffset": 16
    },
    {
        "id": 14,
        "stopNum": 14,
        "name": "Old Airport Rd at Family Health Center",
        "transfer": [true, ["Red"]],
        "route": "Purple Route (Palmer's Crossing)",
        "direction": "Outbound",
        "coords": [31.277350422072402, -89.28299016243854],
        "minuteOffset": 17
    },
    {
        "id": 15,
        "stopNum": 15,
        "name": "Old Airport Rd and Chancellor Rd",
        "transfer": [false, ""],
        "route": "Purple Route (Palmer's Crossing)",
        "direction": "Outbound",
        "coords": [31.277319711753194, -89.27575872440036],
        "minuteOffset": 18
    },
    {
        "id": 16,
        "stopNum": 16,
        "name": "Old Airport Rd and Hattiesburg Ave",
        "transfer": [false, ""],
        "route": "Purple Route (Palmer's Crossing)",
        "direction": "Outbound",
        "coords": [31.27727364625568, -89.27161749093999],
        "minuteOffset": 19
    },
    {
        "id": 17,
        "stopNum": 17,
        "name": "Sullivan St at Palmer's Crossing Apartments",
        "transfer": [false, ""],
        "route": "Purple Route (Palmer's Crossing)",
        "direction": "Outbound",
        "coords": [31.276429108147042, -89.2669193020034],
        "minuteOffset": 19
    },
    {
        "id": 18,
        "stopNum": 18,
        "name": "Tatum Rd and Hood Rd",
        "transfer": [false, ""],
        "route": "Purple Route (Palmer's Crossing)",
        "direction": "Outbound",
        "coords": [31.27817959691076, -89.2628140011544],
        "minuteOffset": 22
    },
    {
        "id": 19,
        "stopNum": 19,
        "name": "Tatum Rd and Steps Ave",
        "transfer": [false, ""],
        "route": "Purple Route (Palmer's Crossing)",
        "direction": "Outbound",
        "coords": [31.279239087484925, -89.25882548129236],
        "minuteOffset": 23
    },
    {
        "id": 20,
        "stopNum": 20,
        "name": "Travillion Rd and Steps Ave",
        "transfer": [false, ""],
        "route": "Purple Route (Palmer's Crossing)",
        "direction": "Outbound",
        "coords": [31.276014513944617, -89.25617545120383],
        "minuteOffset": 24
    },
    {
        "id": 21,
        "stopNum": 21,
        "name": "JM Tatum Industrial Dr at Georgia Pacific",
        "transfer": [false, ""],
        "route": "Purple Route (Palmer's Crossing)",
        "direction": "Outbound",
        "coords": [31.269088985793815, -89.26551793015997],
        "minuteOffset": 27
    },
    {
        "id": 22,
        "stopNum": 22,
        "name": "JM Tatum Industrial Dr at Kohler",
        "transfer": [false, ""],
        "route": "Purple Route (Palmer's Crossing)",
        "direction": "Outbound",
        "coords": [31.266931372607345, -89.26976696145445],
        "minuteOffset": 27
    },
    {
        "id": 23,
        "stopNum": 23,
        "name": "Lowery A Woodall Tech Center",
        "transfer": [false, ""],
        "route": "Purple Route (Palmer's Crossing)",
        "direction": "Outbound",
        "coords": [31.261947942200393, -89.27311767746468],
        "minuteOffset": 28
    },
    {
        "id": 24,
        "stopNum": 24,
        "name": "Southhill Dr and Sullivan Dr",
        "transfer": [false, ""],
        "route": "Purple Route (Palmer's Crossing)",
        "direction": "Outbound",
        "coords": [31.266378524277414, -89.27774400117855],
        "minuteOffset": 29
    },
    {
        "id": 25,
        "stopNum": 25,
        "name": "JM Tatum Industrial Dr at DMV",
        "transfer": [false, ""],
        "route": "Purple Route (Palmer's Crossing)",
        "direction": "Outbound",
        "coords": [31.266616556594343, -89.2815438748309],
        "minuteOffset": 30
    },
    {
        "id": 26,
        "stopNum": 26,
        "name": "PRCC",
        "transfer": [false, ""],
        "route": "Purple Route (Palmer's Crossing)",
        "direction": "Outbound",
        "coords": [31.28594891805281, -89.29695896510853],
        "minuteOffset": 34
    },
    {
        "id": 27,
        "stopNum": 27,
        "name": "Edwards St past Central School Rd",
        "transfer": [false, ""],
        "route": "Purple Route (Palmer's Crossing)",
        "direction": "Inbound",
        "coords": [31.281012555940165, -89.28805666064167],
        "minuteOffset": 37
    },
    {
        "id": 28,
        "stopNum": 28,
        "name": "Edwards St and Barkley Rd (return)",
        "transfer": [false, ""],
        "route": "Purple Route (Palmer's Crossing)",
        "direction": "Inbound",
        "coords": [31.28839013382479, -89.28471492778428],
        "minuteOffset": 38
    },
    {
        "id": 29,
        "stopNum": 29,
        "name": "McCall St and Collins Rd",
        "transfer": [false, ""],
        "route": "Purple Route (Palmer's Crossing)",
        "direction": "Inbound",
        "coords": [31.292051838961854, -89.28417593861373],
        "minuteOffset": 39
    },
    {
        "id": 30,
        "stopNum": 30,
        "name": "McCall St and Dixie Pine Rd",
        "transfer": [false, ""],
        "route": "Purple Route (Palmer's Crossing)",
        "direction": "Inbound",
        "coords": [31.295536851781804, -89.28414898915521],
        "minuteOffset": 40
    },
    {
        "id": 31,
        "stopNum": 31,
        "name": "Lilac St and Hattiesburg St (return)",
        "transfer": [false, ""],
        "route": "Purple Route (Palmer's Crossing)",
        "direction": "Inbound",
        "coords": [31.301178614782245, -89.28274761731178],
        "minuteOffset": 41
    },
    {
        "id": 32,
        "stopNum": 32,
        "name": "Tuscan St and Edwards St",
        "transfer": [false, ""],
        "route": "Purple Route (Palmer's Crossing)",
        "direction": "Inbound",
        "coords": [31.306121596169376, -89.28498442236956],
        "minuteOffset": 43
    },
    {
        "id": 33,
        "stopNum": 33,
        "name": "Edwards St and Duke Av (return)",
        "transfer": [true, ["Brown"]],
        "route": "Purple Route (Palmer's Crossing)",
        "direction": "Inbound",
        "coords": [31.311946919878338, -89.2849934055224],
        "minuteOffset": 44
    },
    {
        "id": 34,
        "stopNum": 34,
        "name": "Edwards St and Katie St (return)",
        "transfer": [true, ["Orange"]],
        "route": "Purple Route (Palmer's Crossing)",
        "direction": "Inbound",
        "coords": [31.315761198854375, -89.28502933813377],
        "minuteOffset": 45
    },
    {
        "id": 35,
        "stopNum": 35,
        "name": "Bay St and Rebecca Av (return)",
        "transfer": [false, ""],
        "route": "Purple Route (Palmer's Crossing)",
        "direction": "Inbound",
        "coords": [31.319076502974312, -89.28630494583739],
        "minuteOffset": 46
    },
    {
        "id": 36,
        "stopNum": 36,
        "name": "Main St and Buschman St (return)",
        "transfer": [false, ""],
        "route": "Purple Route (Palmer's Crossing)",
        "direction": "Inbound",
        "coords": [31.324486644444463, -89.28721224427449],
        "minuteOffset": 47
    },
    {
        "id": 37,
        "stopNum": 37,
        "name": "Train Depot (return)",
        "transfer": [true, ["Blue", "Brown", "Orange"]],
        "route": "Purple Route (Palmer's Crossing)",
        "direction": "Station",
        "coords": [31.329904148328566, -89.28373576412446],
        "minuteOffset": 20
    }
];

export const orangeStops = [
    {
        "id": 71,
        "stopNum": 1,
        "name": "Train Depot",
        "transfer": [false, ""],
        "route": "Orange Route (Broadway)",
        "direction": "Station",
        "coords": [31.329904148328566, -89.28373576412446],
        "minuteOffset": 0
    },
    {
        "id": 47,
        "stopNum": 2,
        "name": "River Ave and Williams St",
        "transfer": [false, ""],
        "route": "Orange Route (Broadway)",
        "direction": "Outbound",
        "coords": [31.32517727842611, -89.28437356797627],
        "minuteOffset": 1
    },
    {
        "id": 48,
        "stopNum": 3,
        "name": "Mc Innis and Tipton",
        "transfer": [false, ""],
        "route": "Orange Route (Broadway)",
        "direction": "Outbound",
        "coords": [31.32407993539607, -89.28016046929316],
        "minuteOffset": 3
    },
    {
        "id": 49,
        "stopNum": 4,
        "name": "Tipton St and Rebecca St",
        "transfer": [false, ""],
        "route": "Orange Route (Broadway)",
        "direction": "Outbound",
        "coords": [31.319206963943984, -89.28014250298747],
        "minuteOffset": 4
    },
    {
        "id": 50,
        "stopNum": 5,
        "name": "Tipton St and Alcorn St",
        "transfer": [false, ""],
        "route": "Orange Route (Broadway)",
        "direction": "Outbound",
        "coords": [31.315830268880674, -89.28008860407041],
        "minuteOffset": 5
    },
    {
        "id": 51,
        "stopNum": 6,
        "name": "James St and Alcorn St",
        "transfer": [false, ""],
        "route": "Orange Route (Broadway)",
        "direction": "Outbound",
        "coords": [31.315784222202083, -89.2829811792857],
        "minuteOffset": 6
    },
    {
        "id": 186,
        "stopNum": 7,
        "name": "Edwards St and Katie St",
        "transfer": [true, ["Orange", "Purple"]],
        "route": "Orange Line (Broadway)",
        "direction": "Outbound",
        "coords": [31.315761198854375, -89.28519103488493],
        "minuteOffset": 7
    },
    {
        "id": 52,
        "stopNum": 8,
        "name": "Edwards St and Duke St",
        "transfer": [true, ["Orange", "Purple"]],
        "route": "Orange Route (Broadway)",
        "direction": "Outbound",
        "coords": [31.311939245117046, -89.28514611912071],
        "minuteOffset": 8
    },
    {
        "id": 53,
        "stopNum": 9,
        "name": "Edwards St and Tuscan Av",
        "transfer": [true, ["Orange", "Purple"]],
        "route": "Orange Route (Broadway)",
        "direction": "Outbound",
        "coords": [31.30630580164373, -89.28514611912071],
        "minuteOffset": 9
    },
    {
        "id": 54,
        "stopNum": 10,
        "name": "William Carey and Tuscan Av",
        "transfer": [false, ""],
        "route": "Orange Route (Broadway)",
        "direction": "Outbound",
        "coords": [31.306359528172564, -89.29403045728189],
        "minuteOffset": 10
    },
    {
        "id": 55,
        "stopNum": 11,
        "name": "Cypress St and Penton St",
        "transfer": [false, ""],
        "route": "Orange Route (Broadway)",
        "direction": "Outbound",
        "coords": [31.31012798396182, -89.29406638989326],
        "minuteOffset": 11
    },
    {
        "id": 56,
        "stopNum": 12,
        "name": "Wills Av and John St",
        "transfer": [false, ""],
        "route": "Orange Route (Broadway)",
        "direction": "Outbound",
        "coords": [31.31278346511114, -89.29463232852234],
        "minuteOffset": 12
    },
    {
        "id": 57,
        "stopNum": 13,
        "name": "Katie St and Charles St",
        "transfer": [false, ""],
        "route": "Orange Route (Broadway)",
        "direction": "Outbound",
        "coords": [31.31569980323293, -89.29535098074973],
        "minuteOffset": 14
    },
    {
        "id": 58,
        "stopNum": 14,
        "name": "Hall St and Dabbs St",
        "transfer": [false, ""],
        "route": "Orange Route (Broadway)",
        "direction": "Outbound",
        "coords": [31.317426539818655, -89.29309620938628],
        "minuteOffset": 15
    },
    {
        "id": 59,
        "stopNum": 15,
        "name": "6th Av and W Pine St",
        "transfer": [false, ""],
        "route": "Orange Route (Broadway)",
        "direction": "Outbound",
        "coords": [31.318923019249183, -89.29930356800041],
        "minuteOffset": 17
    },
    {
        "id": 60,
        "stopNum": 16,
        "name": "Broadway Dr and Corinne St",
        "transfer": [false, ""],
        "route": "Orange Route (Broadway)",
        "direction": "Outbound",
        "coords": [31.316728174612606, -89.30376819496311],
        "minuteOffset": 18
    },
    {
        "id": 61,
        "stopNum": 17,
        "name": "Broadway Dr and Timothy Ln",
        "transfer": [false, ""],
        "route": "Orange Route (Broadway)",
        "direction": "Outbound",
        "coords": [31.314042106324507, -89.30920300243278],
        "minuteOffset": 19
    },
    {
        "id": 168,
        "stopNum": 18,
        "name": "Bartur St and Broadway St",
        "transfer": [false, ""],
        "route": "Orange Line (Broadway)",
        "direction": "Outbound",
        "coords": [31.31141735988153, -89.31311067391925],
        "minuteOffset": 20
    },
    {
        "id": 62,
        "stopNum": 19,
        "name": "On Service Rd at Waffle House",
        "transfer": [false, ""],
        "route": "Orange Route (Broadway)",
        "direction": "Outbound",
        "coords": [31.309199315371785, -89.31533849582418],
        "minuteOffset": 21
    },
    {
        "id": 63,
        "stopNum": 20,
        "name": "On Service Rd near Popeye's Chicken",
        "transfer": [false, ""],
        "route": "Orange Route (Broadway)",
        "direction": "Outbound",
        "coords": [31.31005123483861, -89.31799750906553],
        "minuteOffset": 24
    },
    {
        "id": 187,
        "stopNum": 21,
        "name": "Service Road and Cloverleaf Dr",
        "transfer": [false, ""],
        "route": "Orange Line (Broadway)",
        "direction": "Outbound",
        "coords": [31.31148643309345, -89.31839276779061],
        "minuteOffset": 25
    },
    {
        "id": 64,
        "stopNum": 22,
        "name": "On Service Rd by Walmart",
        "transfer": [true, ["Orange", "Green"]],
        "route": "Orange Route (Broadway)",
        "direction": "Station",
        "coords": [31.308032710449936, -89.31943481352033],
        "minuteOffset": 27
    },
    {
        "id": 136,
        "stopNum": 23,
        "name": "Roosevelt Blvd Before Lincoln Rd",
        "transfer": [false, ""],
        "route": "Orange Line (Broadway)",
        "direction": "Inbound",
        "coords": [31.304954953134697, -89.3222645066657],
        "minuteOffset": 29
    },
    {
        "id": 189,
        "stopNum": 24,
        "name": "Lincoln Rd at Central Sunbelt Bank",
        "transfer": [false, ""],
        "route": "Orange Line (Broadway)",
        "direction": "Inbound",
        "coords": [31.30407228597612, -89.31806937428829],
        "minuteOffset": 30
    },
    {
        "id": 65,
        "stopNum": 25,
        "name": "W Pine St by Service Dr",
        "transfer": [false, ""],
        "route": "Orange Route (Broadway)",
        "direction": "Inbound",
        "coords": [31.30559200342435, -89.31318253914199],
        "minuteOffset": 33
    },
    {
        "id": 66,
        "stopNum": 26,
        "name": "W Pine St by Health Dept",
        "transfer": [false, ""],
        "route": "Orange Route (Broadway)",
        "direction": "Inbound",
        "coords": [31.311171765828973, -89.308107057786],
        "minuteOffset": 34
    },
    {
        "id": 67,
        "stopNum": 27,
        "name": "Timothy Ln and Broadway",
        "transfer": [false, ""],
        "route": "Orange Route (Broadway)",
        "direction": "Inbound",
        "coords": [31.313888614394145, -89.30900537307026],
        "minuteOffset": 36
    },
    {
        "id": 68,
        "stopNum": 28,
        "name": "Broadway Dr and Florence Ave",
        "transfer": [false, ""],
        "route": "Orange Route (Broadway)",
        "direction": "Inbound",
        "coords": [31.316052827509637, -89.30563669075433],
        "minuteOffset": 37
    },
    {
        "id": 69,
        "stopNum": 29,
        "name": "Halls St and W Pine St",
        "transfer": [false, ""],
        "route": "Orange Route (Broadway)",
        "direction": "Inbound",
        "coords": [31.318823254693697, -89.29941136583452],
        "minuteOffset": 38
    },
    {
        "id": 70,
        "stopNum": 30,
        "name": "W Pine St and 1st Ave",
        "transfer": [false, ""],
        "route": "Orange Route (Broadway)",
        "direction": "Inbound",
        "coords": [31.323519748358493, -89.29400350782338],
        "minuteOffset": 39
    },
    {
        "id": 171,
        "stopNum": 31,
        "name": "Front St and Forrest St.",
        "transfer": [true, ["Blue", "Orange"]],
        "route": "Orange Line (Broadway)",
        "direction": "Inbound",
        "coords": [31.325476551578035, -89.29076957280009],
        "minuteOffset": 42
    },
    {
        "id": 190,
        "stopNum": 32,
        "name": "Main St and Short St",
        "transfer": [true, ["Blue", "Brown", "Orange"]],
        "route": "Orange Line (Broadway)",
        "direction": "Inbound",
        "coords": [31.325967664432426, -89.28922447051119],
        "minuteOffset": 43
    },
    {
        "id": 71,
        "stopNum": 33,
        "name": "Train Depot",
        "transfer": [false, ""],
        "route": "Orange Route (Broadway)",
        "direction": "Station",
        "coords": [31.329904148328566, -89.28373576412446],
        "minuteOffset": 44
    }
];

export const brownStops = [
    {
        "id": 154,
        "stopNum": 1,
        "name": "Train Depot",
        "transfer": [false, ""],
        "route": "Brown Route (Hwy 42)",
        "direction": "Station",
        "coords": [31.329873455133807, -89.2838076293472],
        "minuteOffset": 0
    },
    {
        "id": 137,
        "stopNum": 2,
        "name": "Briarfield Apt and E 2nd",
        "transfer": [false, ""],
        "route": "Brown Route (Hwy 42)",
        "direction": "Outbound",
        "coords": [31.33069449464635, -89.2874907220126],
        "minuteOffset": 1
    },
    {
        "id": 106,
        "stopNum": 3,
        "name": "E 2nd St and Mobile St",
        "transfer": [false, ""],
        "route": "Brown Route (Hwy 42)",
        "direction": "Outbound",
        "coords": [31.330019247719747, -89.2899251564329],
        "minuteOffset": 2
    },
    {
        "id": 191,
        "stopNum": 4,
        "name": "Mobile St and E 4th St",
        "transfer": [false, ""],
        "route": "Brown Route (Hwy 42)",
        "direction": "Outbound",
        "coords": [31.332037300843297, -89.2899251564329],
        "minuteOffset": 4
    },
    {
        "id": 107,
        "stopNum": 5,
        "name": "Mobile St and E 7th St",
        "transfer": [false, ""],
        "route": "Brown Route (Hwy 42)",
        "direction": "Outbound",
        "coords": [31.33568963677243, -89.28995210589143],
        "minuteOffset": 6
    },
    {
        "id": 108,
        "stopNum": 6,
        "name": "E 7th St and Fairley St",
        "transfer": [false, ""],
        "route": "Brown Route (Hwy 42)",
        "direction": "Outbound",
        "coords": [31.335635926976863, -89.28441848374048],
        "minuteOffset": 8
    },
    {
        "id": 109,
        "stopNum": 7,
        "name": "E 9th St and Bouie St",
        "transfer": [false, ""],
        "route": "Brown Route (Hwy 42)",
        "direction": "Outbound",
        "coords": [31.338451813501052, -89.28720326112163],
        "minuteOffset": 9
    },
    {
        "id": 110,
        "stopNum": 8,
        "name": "E 9th St and Mobile St",
        "transfer": [false, ""],
        "route": "Brown Route (Hwy 42)",
        "direction": "Outbound",
        "coords": [31.338283016138178, -89.28989820697437],
        "minuteOffset": 10
    },
    {
        "id": 192,
        "stopNum": 9,
        "name": "E 9th St and Memphis",
        "transfer": [false, ""],
        "route": "Brown Route (Hwy 42)",
        "direction": "Outbound",
        "coords": [31.338290688752167, -89.29237755715889],
        "minuteOffset": 11
    },
    {
        "id": 111,
        "stopNum": 10,
        "name": "Coit St and Lula",
        "transfer": [false, ""],
        "route": "Brown Route (Hwy 42)",
        "direction": "Outbound",
        "coords": [31.340592444695446, -89.29434486763138],
        "minuteOffset": 12
    },
    {
        "id": 112,
        "stopNum": 11,
        "name": "Coit st and Hwy 42",
        "transfer": [false, ""],
        "route": "Brown Route (Hwy 42)",
        "direction": "Outbound",
        "coords": [31.34290181656627, -89.29438978339559],
        "minuteOffset": 13
    },
    {
        "id": 113,
        "stopNum": 12,
        "name": "US Hwy 42 and Redus St",
        "transfer": [false, ""],
        "route": "Brown Route (Hwy 42)",
        "direction": "Outbound",
        "coords": [31.342525876171237, -89.3013337605428],
        "minuteOffset": 14
    },
    {
        "id": 114,
        "stopNum": 13,
        "name": "US Hwy 42 and Glendale Ave",
        "transfer": [false, ""],
        "route": "Brown Route (Hwy 42)",
        "direction": "Outbound",
        "coords": [31.34260259882285, -89.30735247294724],
        "minuteOffset": 16
    },
    {
        "id": 115,
        "stopNum": 14,
        "name": "US Hwy 42 and Pritchard St",
        "transfer": [false, ""],
        "route": "Brown Route (Hwy 42)",
        "direction": "Outbound",
        "coords": [31.34646933941744, -89.31497018655763],
        "minuteOffset": 17
    },
    {
        "id": 116,
        "stopNum": 15,
        "name": "US Hwy 42 and Cahal St",
        "transfer": [false, ""],
        "route": "Brown Route (Hwy 42)",
        "direction": "Outbound",
        "coords": [31.346799232545848, -89.32448334541779],
        "minuteOffset": 18
    },
    {
        "id": 117,
        "stopNum": 16,
        "name": "US Hwy 42 at Health Dept.",
        "transfer": [false, ""],
        "route": "Brown Route (Hwy 42)",
        "direction": "Outbound",
        "coords": [31.34735928102144, -89.33153512039911],
        "minuteOffset": 19
    },
    {
        "id": 119,
        "stopNum": 17,
        "name": "Service Dr and N 31st Ave",
        "transfer": [false, ""],
        "route": "Brown Route (Hwy 42)",
        "direction": "Outbound",
        "coords": [31.348448680832846, -89.3351104152304],
        "minuteOffset": 20
    },
    {
        "id": 118,
        "stopNum": 18,
        "name": "N 31st and Hwy 49",
        "transfer": [false, ""],
        "route": "Brown Route (Hwy 42)",
        "direction": "Outbound",
        "coords": [31.347689171028634, -89.33531702774577],
        "minuteOffset": 21
    },
    {
        "id": 120,
        "stopNum": 19,
        "name": "Campbell Dr at Mark Apartment",
        "transfer": [false, ""],
        "route": "Brown Route (Hwy 42)",
        "direction": "Inbound",
        "coords": [31.346776216783738, -89.33764366433196],
        "minuteOffset": 22
    },
    {
        "id": 179,
        "stopNum": 20,
        "name": "Campbell Dr and Overlook Apartments",
        "transfer": [false, ""],
        "route": "Brown Route (Hwy 42)",
        "direction": "Inbound",
        "coords": [31.346753201015986, -89.34322220224712],
        "minuteOffset": 23
    },
    {
        "id": 180,
        "stopNum": 21,
        "name": "Beverly Hills Dr and Plantation Apartments",
        "transfer": [false, ""],
        "route": "Brown Route (Hwy 42)",
        "direction": "Inbound",
        "coords": [31.345633093512987, -89.34839649828439],
        "minuteOffset": 26
    },
    {
        "id": 184,
        "stopNum": 22,
        "name": "Beverly Hills and 37th",
        "transfer": [false, ""],
        "route": "Brown Route (Hwy 42)",
        "direction": "Inbound",
        "coords": [31.33957967901769, -89.34399475339158],
        "minuteOffset": 28
    },
    {
        "id": 121,
        "stopNum": 23,
        "name": "W 7th St and N 31st Ave",
        "transfer": [false, ""],
        "route": "Brown Route (Hwy 42)",
        "direction": "Inbound",
        "coords": [31.335658945464417, -89.33555058971967],
        "minuteOffset": 30
    },
    {
        "id": 122,
        "stopNum": 24,
        "name": "W 7th St and Service Dr(Hillcrest Lot)",
        "transfer": [true, ["Green", "Gold"]],
        "route": "Brown Route (Hwy 42)",
        "direction": "Inbound",
        "coords": [31.33559756281842, -89.32957679307945],
        "minuteOffset": 31
    },
    {
        "id": 193,
        "stopNum": 25,
        "name": "W 7th St and 25th Ave",
        "transfer": [false, ""],
        "route": "Brown Route (Hwy 42)",
        "direction": "Inbound",
        "coords": [31.335643599806673, -89.32786999403939],
        "minuteOffset": 32
    },
    {
        "id": 123,
        "stopNum": 26,
        "name": "W 7th St and 19th St",
        "transfer": [false, ""],
        "route": "Brown Route (Hwy 42)",
        "direction": "Inbound",
        "coords": [31.33568963677243, -89.31958752711866],
        "minuteOffset": 33
    },
    {
        "id": 124,
        "stopNum": 27,
        "name": "W 7th St and Oliver Av",
        "transfer": [false, ""],
        "route": "Brown Route (Hwy 42)",
        "direction": "Inbound",
        "coords": [31.33570498242267, -89.31368559570117],
        "minuteOffset": 34
    },
    {
        "id": 125,
        "stopNum": 28,
        "name": "W 7th St and North St",
        "transfer": [false, ""],
        "route": "Brown Route (Hwy 42)",
        "direction": "Inbound",
        "coords": [31.33570498242267, -89.30587923588108],
        "minuteOffset": 35
    },
    {
        "id": 126,
        "stopNum": 29,
        "name": "W 7th St and Main St",
        "transfer": [false, ""],
        "route": "Brown Route (Hwy 42)",
        "direction": "Inbound",
        "coords": [31.335651272635857, -89.2992586522362],
        "minuteOffset": 36
    },
    {
        "id": 128,
        "stopNum": 30,
        "name": "Main St and 4th St",
        "transfer": [false, ""],
        "route": "Brown Route (Hwy 42)",
        "direction": "Inbound",
        "coords": [31.33216774385295, -89.29675235259316],
        "minuteOffset": 38
    },
    {
        "id": 127,
        "stopNum": 31,
        "name": "Main St and Eaton St",
        "transfer": [false, ""],
        "route": "Brown Route (Hwy 42)",
        "direction": "Inbound",
        "coords": [31.327816988285534, -89.29183856798834],
        "minuteOffset": 40
    },
    {
        "id": 129,
        "stopNum": 32,
        "name": "Main St and Short St",
        "transfer": [true, ["Blue", "Orange"]],
        "route": "Brown Route (Hwy 42)",
        "direction": "Inbound",
        "coords": [31.325967664432426, -89.28922447051119],
        "minuteOffset": 42
    },
    {
        "id": 154,
        "stopNum": 33,
        "name": "Train Depot",
        "transfer": [true, ["Blue", "Purple", "Orange"]],
        "route": "Brown Route (Hwy 42)",
        "direction": "Station",
        "coords": [31.329873455133807, -89.2838076293472],
        "minuteOffset": 43
    }
];


