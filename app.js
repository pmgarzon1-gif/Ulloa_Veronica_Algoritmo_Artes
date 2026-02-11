const bailes = [
  "Salsa","Hip Hop","Ballet","Reggaetón",
  "Tango","K-Pop","Breakdance",
  "Flamenco","Contemporáneo","Merengue"
];

const segmentos = {
  "J": "Jóvenes",
  "P": "Profesionales",
  "S": "Social",
  "U": "Universitarios"
};

const contextos = {
  "E": "¿Cuál tiene más energía?",
  "T": "¿Cuál requiere más técnica?",
  "S": "¿Cuál es mejor para socializar?",
  "I": "¿Cuál tiene más impacto escénico?"
};

const RATING_INICIAL = 1000;
const K = 32;
const STORAGE_KEY = "dancemash_state_v1";

function defaultState(){
  const buckets = {};
  for (const seg of Object.keys(segmentos)){
    for (const ctx of Object.keys(contextos)){
      const key = `${seg}__${ctx}`;
      buckets[key] = {};
      bailes.forEach(b => buckets[key][b] = RATING_INICIAL);
    }
  }
  return { buckets, votes: [] };
}

function loadState(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultState();
  try { return JSON.parse(raw); }
  catch { return defaultState(); }
}

function saveState(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = loadState();

function expectedScore(ra, rb){
  return 1 / (1 + Math.pow(10, (rb - ra) / 400));
}

function updateElo(bucket, a, b, winner){
  const ra = bucket[a], rb = bucket[b];
  const ea = expectedScore(ra, rb);
  const eb = expectedScore(rb, ra);
  const sa = (winner === "A") ? 1 : 0;
  const sb = (winner === "B") ? 1 : 0;
  bucket[a] = ra + K * (sa - ea);
  bucket[b] = rb + K * (sb - eb);
}

function randomPair(){
  const a = bailes[Math.floor(Math.random()*bailes.length)];
  let b = a;
  while(b===a){
    b = bailes[Math.floor(Math.random()*bailes.length)];
  }
  return [a,b];
}

function bucketKey(seg, ctx){ return `${seg}__${ctx}`; }

function topN(bucket){
  return Object.entries(bucket)
  .map(([b,r])=>({b,r}))
  .sort((x,y)=>y.r-x.r)
  .slice(0,10);
}

/* UI wiring igual que anteriores */

