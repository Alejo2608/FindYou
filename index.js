// APIS
const APIGEO ="https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_kTwRZgN018G9augKLFJLvPm937w7F&ipAddress=";
const APIGEODOM ="https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_kTwRZgN018G9augKLFJLvPm937w7F&domain=";
const APIPIFY = "https://api.ipify.org/?format=json";
//VARIABLES PARA GUARDAR LA INFORMACION
let ip = "";
let infoGe = "";
let infoPop = "";
//AL INICIO EL MARCADOR SE COLOCARA EN ESTAS COORDENADAS(CARACAS,VENEZUELA)
let marker;
let lati = "10.50023";
let long = "-66.94998";
let map = L.map("map").setView([lati, long], 6);
//BOTONES
const Ipbt = document.getElementById("Ipbt");
const btnDomain = document.getElementById("btnDomain");
let sndIp=document.getElementById("infosnd");
let sndDom;
// INPUTS
let form = document.getElementById("form");
let IPs=document.getElementById("ip");;
let dominio;
//FUNCIONES PARA BUSCAR LA INFORMACION DEL USUARIO
async function ipUser () {
   const infoApi = await fetch(APIPIFY);
   const infoip = await infoApi.json();
   ip = infoip.ip;
};
async function geoUser (ip) {
   const infoApi = await fetch(`${APIGEO}${ip}`);
   const infoGeo = await infoApi.json();
   infoGe = infoGeo;
};
async function geoDom (domain) {
   const infoApi = await fetch(`${APIGEODOM}${domain}`);
   const infoGeo = await infoApi.json();
   infoGe = infoGeo;
};
function markerCreate (lat, lng, infoPop = null) {
   marker = L.marker([lat, lng]).addTo(map);
   marker
      .bindPopup(
         infoPop? infoPop : "Informacion del usuario"
      ).openPopup();
}
markerCreate(lati, long, "Venezuela, Caracas")
//INICIO DE LA PAGINA
window.addEventListener("load", async function() {
   //EJECUCION DE LAS FUNCIONES DE INFORMACION
   await ipUser();
   await geoUser(ip)
   console.log(infoGe);
   await map.flyTo([infoGe.location.lat, infoGe.location.lng], 16);
   infoPop = await viewPopup(infoGe)
   marker.remove()
   await markerCreate(infoGe.location.lat, infoGe.location.lng, infoPop)
});
//FUNCION PARA EL CLICK DEL USUARIO EN EL MAPA
const popup = L.popup();
map.on("click", (e) => {
   popup
      .setLatLng(e.latlng)
      .setContent(`Latidud: ${e.latlng.lat} <br> Longitud: ${e.latlng.lng}`)
      .openOn(map);
});
//FUNCION PARA CREAR EL POPUP CON LA INFORMACION
const viewPopup = function(location) {
   infoPop = document.createRange().createContextualFragment(/*html*/
      `<section id="Popup">
         <p class="msg-popup">Pais: ${location.location.country}</p>
         <p class="msg-popup">Region: ${location.location.region}</p>
         <p class="msg-popup">Ciudad: ${location.location.city}</p>
         <p class="msg-popup">Dominio: ${location.as ? location.as.domain : location.domains[0] }</p>
         <p class="msg-popup">Nombre Dominio: ${location.isp}</p>
         <p class="msg-popup">Ip: ${location.ip}</p>
         <p class="msg-popup">Coordenadas: ${location.location.lat}, ${location.location.lng}</p>
      </section>`
   )
   return infoPop
}
//FUNCION INICIAL DE LA INFORMACION DEL USUARIO
sndIp.addEventListener("click", async (e) => {
   const rgx = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
   const actIP = IPs.value.trim()
   e.preventDefault();
   if (rgx.test(actIP)) {
      await geoUser(actIP)
      const lat = infoGe.location.lat
      const lng = infoGe.location.lng
      map.flyTo([lat, lng], 18);
      marker.remove()
      infoPop = viewPopup(infoGe)
      markerCreate(lat, lng, infoPop)
   } else {
      return console.warn("No es una IP valida");
   }
});
//BUSQUEDA POR IP
Ipbt.addEventListener("click", () => {
   const filtro = Ipbt.textContent
   filtrarBusqueda(filtro)
   IPs = document.getElementById("ip");
   sndIp = document.getElementById('sendIp')
   sndIp.addEventListener("click", async (e) => {
      e.preventDefault();
      const rgx = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      const actIP = IPs.value.trim()
      if (rgx.test(actIP)) {
         await geoUser(actIP)
         const lat = infoGe.location.lat
         const lng = infoGe.location.lng
         map.flyTo([lat, lng], 18);
         marker.remove()
         infoPop = viewPopup(infoGe)
         markerCreate(lat, lng, infoPop)
      } else {
         return console.warn("No es una IP valida");
      }
   });
})
//BUSQUEDA POR DOMINIO
btnDomain.addEventListener("click", () => {
   const filtro = btnDomain.textContent
   filtrarBusqueda(filtro)
   dom = document.getElementById("dominio");
   sndDom = document.getElementById('sendDominio')
   sndDom.addEventListener("click", async (e) => {
      e.preventDefault();
      const rgx = /^[a-zA-Z0-9]+([\-\.]{1}[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;
      const domiNu = dom.value.trim()
      if (rgx.test(domiNu)) {
         await geoDom(domiNu)
         console.log(infoGe);
         const lat = infoGe.location.lat
         const lng = infoGe.location.lng
         map.flyTo([lat, lng], 18);
         marker.remove()
         infoPop = viewPopup(infoGe)
         markerCreate(lat, lng, infoPop)
      } else {
         return console.warn("No es dominio valido");
      }
   });
})
//FILTRAR BUSQUEDA DEL INPUT
function filtrarBusqueda(filtro){
   const oneLowerCase = filtro[0].toLowerCase() + filtro.substring(1);
   const label = document.createElement("label");
   label.setAttribute('for', `${oneLowerCase}`)
   const input = document.createElement("input");
   input.type = 'text'
   input.name = `${oneLowerCase}`
   input.id = `${oneLowerCase}`
   input.classList.add('buscador')
   const btn = document.createElement("button");
   if (filtro==='Ip') {
      btn.id='sendIp'
      input.placeholder='192.154.0.1'
      btn.classList.add('btnForm')
      btn.textContent = 'Buscar IP'
   }else if(filtro==='Dominio'){
      btn.id='sendDominio'
      input.placeholder='cantv.com.ve'
      btn.classList.add('btnForm')
      btn.textContent = 'Buscar Dominio'
   }
   while(form.firstChild){
      form.removeChild(form.firstChild)
   }
   form.appendChild(input);
   form.appendChild(btn);
   ip = document.getElementById("ip");
}
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {}).addTo(map);
//EVENTO PARA EL MODO OSCURO
 const bt=document.querySelector('#check')

 bt.addEventListener('click',()=>{
   document.body.classList.toggle('dark');
   bt.classList.toggle('active')
 })