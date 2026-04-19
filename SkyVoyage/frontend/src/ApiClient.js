const BASE        = import.meta.env.VITE_API_BASE     || 'http://localhost:8080';
const AVIATION_K  = import.meta.env.VITE_AVIATION_KEY || '';

const json = r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`));
const get  = url => fetch(url, { headers:{'Content-Type':'application/json'} }).then(json);
const post = (url, body) => fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) }).then(json);

const AIRPORT_DB = [
  {code:'DEL',city:'Delhi',name:'Indira Gandhi International',country:'India'},
  {code:'BOM',city:'Mumbai',name:'Chhatrapati Shivaji Maharaj',country:'India'},
  {code:'BLR',city:'Bengaluru',name:'Kempegowda International',country:'India'},
  {code:'MAA',city:'Chennai',name:'Chennai International',country:'India'},
  {code:'CCU',city:'Kolkata',name:'Netaji Subhas Chandra Bose',country:'India'},
  {code:'HYD',city:'Hyderabad',name:'Rajiv Gandhi International',country:'India'},
  {code:'COK',city:'Kochi',name:'Cochin International',country:'India'},
  {code:'PNQ',city:'Pune',name:'Pune Airport',country:'India'},
  {code:'AMD',city:'Ahmedabad',name:'Sardar Vallabhbhai Patel',country:'India'},
  {code:'GOI',city:'Goa',name:'Dabolim Airport',country:'India'},
  {code:'JAI',city:'Jaipur',name:'Jaipur International',country:'India'},
  {code:'LKO',city:'Lucknow',name:'Chaudhary Charan Singh',country:'India'},
  {code:'VNS',city:'Varanasi',name:'Lal Bahadur Shastri',country:'India'},
  {code:'ATQ',city:'Amritsar',name:'Sri Guru Ram Dass Jee',country:'India'},
  {code:'NAG',city:'Nagpur',name:'Dr. Babasaheb Ambedkar',country:'India'},
  {code:'IXC',city:'Chandigarh',name:'Chandigarh Airport',country:'India'},
  {code:'SXR',city:'Srinagar',name:'Sheikh ul-Alam International',country:'India'},
  {code:'GAU',city:'Guwahati',name:'Lokpriya Gopinath Bordoloi',country:'India'},
  {code:'DXB',city:'Dubai',name:'Dubai International',country:'UAE'},
  {code:'LHR',city:'London',name:'Heathrow Airport',country:'United Kingdom'},
  {code:'SIN',city:'Singapore',name:'Changi Airport',country:'Singapore'},
  {code:'JFK',city:'New York',name:'John F. Kennedy International',country:'USA'},
  {code:'HND',city:'Tokyo',name:'Haneda Airport',country:'Japan'},
  {code:'CDG',city:'Paris',name:'Charles de Gaulle',country:'France'},
  {code:'AMS',city:'Amsterdam',name:'Schiphol Airport',country:'Netherlands'},
  {code:'DOH',city:'Doha',name:'Hamad International',country:'Qatar'},
  {code:'AUH',city:'Abu Dhabi',name:'Zayed International',country:'UAE'},
  {code:'BKK',city:'Bangkok',name:'Suvarnabhumi Airport',country:'Thailand'},
  {code:'SYD',city:'Sydney',name:'Kingsford Smith Airport',country:'Australia'},
  {code:'HKG',city:'Hong Kong',name:'Hong Kong International',country:'China HK'},
  {code:'KUL',city:'Kuala Lumpur',name:'Kuala Lumpur International',country:'Malaysia'},
  {code:'ATH',city:'Athens',name:'Eleftherios Venizelos',country:'Greece'},
  {code:'LAX',city:'Los Angeles',name:'Los Angeles International',country:'USA'},
  {code:'FRA',city:'Frankfurt',name:'Frankfurt am Main',country:'Germany'},
];

async function searchAirports(query) {
  const q = (query || '').trim().toLowerCase();
  if (q.length < 2) return [];
  try {
    const data = await get(`${BASE}/api/airports?q=${encodeURIComponent(q)}`);
    if (Array.isArray(data) && data.length) return data;
  } catch (_) {}
  if (AVIATION_K) {
    try {
      const res = await fetch(`https://api.aviationstack.com/v1/airports?access_key=${AVIATION_K}&search=${encodeURIComponent(q)}&limit=6`).then(json);
      if (res?.data?.length) return res.data.map(a => ({ code:a.iata_code, city:a.city_name||a.airport_name, name:a.airport_name, country:a.country_name })).filter(a=>a.code);
    } catch (_) {}
  }
  return AIRPORT_DB.filter(a =>
    a.code.toLowerCase().startsWith(q) || a.city.toLowerCase().includes(q) ||
    a.name.toLowerCase().includes(q)   || a.country.toLowerCase().includes(q)
  ).slice(0,6);
}

function _mockFlights(origin, dest) {
  const AIRLINES = [
    {name:'Air India',code:'AI',logo:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Air_India_Logo.svg/120px-Air_India_Logo.svg.png',color:'#E31837'},
    {name:'IndiGo',code:'6E',logo:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/IndiGo_Airlines_logo.svg/120px-IndiGo_Airlines_logo.svg.png',color:'#1A1F71'},
    {name:'Air France',code:'AF',logo:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Air_France_Logo.svg/120px-Air_France_Logo.svg.png',color:'#002157'},
    {name:'Emirates',code:'EK',logo:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/120px-Emirates_logo.svg.png',color:'#D71921'},
    {name:'Akasa Air',code:'QP',logo:null,color:'#FF6B35'},
    {name:'SpiceJet',code:'SG',logo:null,color:'#E53935'},
    {name:'Vistara',code:'UK',logo:null,color:'#5C1E8C'},
    {name:'Go First',code:'G8',logo:null,color:'#E91E8C'},
  ];
  const PRICES = [4000,6961,8500,10200,12400,14284,16000,18500];
  const fmt = (h,m) => `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')} ${h<12?'AM':'PM'}`;
  return AIRLINES.map((a,i) => {
    const dH=4+i*2, dM=[0,15,30,45][i%4], durH=1+Math.floor(i/2), durM=[5,15,30,45,55][i%5];
    const aH=(dH+durH+Math.floor((dM+durM)/60))%24, aM=(dM+durM)%60;
    const stops=i<3?0:i<6?1:2;
    return { id:`${a.code}${1000+i}`, airline:a.name, airlineCode:a.code, logo:a.logo, logoColor:a.color,
      flightNo:`${a.code}${1000+i}`, origin, dest, departure:fmt(dH,dM), arrival:fmt(aH,aM),
      duration:`${durH}h ${durM}m`, stops, stopLabel:stops===0?'Non-stop':stops===1?'1 Stop':'2+ Stops',
      price:PRICES[i]+Math.floor(Math.random()*300), cabinBag:true, reschedule:i<5,
      badge:i===0?'BEST VALUE':i===2?'FASTEST':null, score:(9.5-i*0.3).toFixed(1) };
  }).sort((a,b)=>a.price-b.price);
}

async function searchFlights({ origin, dest, date, guests='1', mode='charter' }) {
  try {
    const p = new URLSearchParams({ origin, dest, date, guests, mode });
    return await get(`${BASE}/api/flights?${p}`);
  } catch (_) { return _mockFlights(origin, dest); }
}

async function createBooking(payload) { return post(`${BASE}/api/bookings`, payload); }
async function getBooking(id)         { return get(`${BASE}/api/bookings/${id}`); }
async function login(email, password) { return post(`${BASE}/api/auth/login`, { email, password }); }
async function logout()               { return post(`${BASE}/api/auth/logout`, {}); }
async function getMe()                { return get(`${BASE}/api/auth/me`); }

const ApiClient = { searchAirports, searchFlights, createBooking, getBooking, login, logout, getMe };
export default ApiClient;
