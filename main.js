const ipBox = document.querySelector('.ip');
const locBox = document.querySelector('.location');
const timezoneBox = document.querySelector('.timezone');
const ispBox = document.querySelector('.isp');
const form = document.querySelector('form');
const input = document.querySelector('input');

let mymap = undefined;
let marker = undefined;

// 192.122.147.101

const getUserIP = async () => {
    const req = await fetch('https://api.ipify.org?format=json');
    let res = await req.json();
    return res.ip;
};

const getIpDetails = async (input) => {
    const geoApiKey = 'at_sITKKLJO2Rtd2lRgWEX3q7bjjHXJT';
    const geoApiUrl = 'https://geo.ipify.org/api/v1';
    const ip = await getUserIP();
    const endpoint = `${geoApiUrl}?apiKey=${geoApiKey}&ipAddress=${input || ip}`;
    try {
        const req = await fetch(endpoint);
        const res = await req.json();
        return res;
    } catch (error) {
        console.error(error);
    }
};

const renderMap = () => { 
    mymap = L.map('mapid').setView([-8.0711481, -57.0123711], 3);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {    
        maxZoom: 19,
    }).addTo(mymap);
}

const setLocationAndMarker = (lat, lng, zoom) => {    
    //Set Ip location in the the without animtaion 
    // mymap.setView([lat, lng], zoom);

    // Set Ip location in the the with animtaion 
    mymap.flyTo([lat,lng], zoom)
    
    // remove last marker if exists
    if(marker) {
        marker.remove();
    }            
    // Set marker to the map
    marker = L.marker([lat, lng]).addTo(mymap);
}


const renderIpDetails = async (input) => {
    const spanIp = document.createElement('span');
    const spanLoc = document.createElement('span');
    const spanTimezone = document.createElement('span');
    const spanIsp = document.createElement('span');

    const ipDetails = await getIpDetails(input);
    const ip = ipDetails.ip;
    const isp = ipDetails.isp;
    const { timezone, region, lat, lng } = ipDetails.location;

    // Removing last child
    ipBox.removeChild(ipBox.lastChild);
    locBox.removeChild(locBox.lastChild);
    timezoneBox.removeChild(timezoneBox.lastChild);
    ispBox.removeChild(ispBox.lastChild);
   

    spanIp.innerHTML = ip;
    spanLoc.innerHTML =  region;
    spanTimezone.innerHTML = `UTC ${timezone}`;
    spanIsp.innerHTML = isp;

    ipBox.appendChild(spanIp);
    locBox.appendChild(spanLoc);
    timezoneBox.appendChild(spanTimezone);
    ispBox.appendChild(spanIsp);

    setLocationAndMarker(lat, lng, 13);
};

form.addEventListener('submit', e => {
    e.preventDefault();
    renderIpDetails(input.value);
});

getUserIP();
renderMap();
getIpDetails();
renderIpDetails();
    

