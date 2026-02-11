const artes = [
  "Impresionismo",
  "Surrealismo",
  "Arte Urbano",
  "Minimalismo",
  "Pop Art",
  "Arte Digital",
  "Expresionismo",
  "Arte Conceptual",
  "Arte Abstracto",
  "Realismo"
];

const segmentos = {
  "E": "Estudiantes de Arte",
  "G": "Público General",
  "D": "Diseñadores",
  "C": "Creativos Digitales"
};

const contextos = {
  "I": "¿Cuál tiene mayor impacto visual?",
  "H": "¿Cuál tiene más profundidad histórica?",
  "M": "¿Cuál transmite más emoción?",
  "C": "¿Cuál es más comercializable?"
};

const RATING_INICIAL = 1000;
const K = 32;
const STORAGE_KEY = "artmash_state_v1";

function defaultState(){
  const buckets = {};
  for (const seg of Object.keys(segmentos)){
    for (const ctx of Object.keys(contextos)){
      const key = `${seg}__${ctx}`;
      buckets[key] = {};
      artes.forEach(a => buckets[key][a] = RATING_INICIAL);
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
  const a = artes[Math.floor(Math.random() * artes.length)];
  let b = a;
  while (b === a){
    b = artes[Math.floor(Math.random() * artes.length)];
  }
  return [a,b];
}

function bucketKey(seg, ctx){ return `${seg}__${ctx}`; }

function topN(bucket){
  return Object.entries(bucket)
    .map(([arte, rating]) => ({arte, rating}))
    .sort((x,y) => y.rating - x.rating)
    .slice(0,10);
}

/* UI wiring similar al anterior */

