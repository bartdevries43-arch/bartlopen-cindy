/* ================================================================== *
 *  Cindy, Run Coach · 25 km voor oud en nieuw
 *  9 weken vanaf ma 26 okt 2026, 25 km op zaterdag 19 december, daarna lekker het jaar uit.
 *  2 flexibele trainingen per week: snelheid en rustig langer.
 *  Gebouwd op de hoofdapp van Kim. Alles lokaal in de browser.
 * ================================================================== */

const CONFIG = {
  unit:       "km",
  zonePaceSuffix: "/km",
  footEmoji:  "🏃‍♀️",
  mottos: [
    "Zet 'm op, strijder!",
    "Lekker begonnen, strijder!",
    "Je bouwt 'm op, strijder.",
    "Halverwege, knap volgehouden! ⚡",
    "De 25 km komt eraan, strijder!",
    "25 km gelopen! Wat een strijder 🎉",
  ],
  appName:    "Op naar 25K",
  runner:     "Cindy",
  goal:       "25 km voor oud en nieuw",
  startDate:  new Date(2026, 9, 26),
  storeKey:   "cindy.log.v1",
  coachName:  "Coach Bart",
  coachHandle:"@bartlopen",
  coachPhoto: "coach.jpg",
  athleteWord:"strijder",
  catchphrase:"Zet 'm op, strijder!",
};

const RUNNER = CONFIG.runner;
const GOAL = CONFIG.goal;
const START_DATE = CONFIG.startDate;
const STORE_KEY = CONFIG.storeKey;
const TOTAL_WEEKS = 9;
const UNIT = CONFIG.unit === "min" ? "min" : "km";
const UNIT_LABEL = UNIT;
const nlNum = (v) => String(v).replace(".", ",");
const ZONE_SUFFIX = CONFIG.zonePaceSuffix ?? "/km";
const COACH_INITIAL = (CONFIG.coachName.replace(/^coach\s+/i, "")[0] || "C").toUpperCase();

const ZONES = [
  { key: "herstel",  name: "Heel rustig",    pace: "langzamer dan 8:00", info: "RPE 2 · los en makkelijk" },
  { key: "duur",     name: "Rustig",         pace: "7:20–8:00",          info: "RPE 3-4 · praten kan makkelijk" },
  { key: "lang",     name: "Lange duurloop", pace: "7:30–8:15",          info: "RPE 3-4 · tijd op de benen" },
  { key: "tempo",    name: "Tempo",          pace: "6:25–6:45",          info: "RPE 6-7 · stevig, korte zinnen" },
  { key: "interval", name: "Snel",           pace: "6:00–6:20",          info: "RPE 8 · kort en snel, nooit sprinten" },
];
const zoneByKey = Object.fromEntries(ZONES.map((z) => [z.key, z]));

const COACH = {
  herstel: [
    "Vandaag echt rustig, strijder. Hier word je sterker van.",
    "Lichte dag. Je knie wordt er blij van.",
    "Niets forceren, gewoon lekker bewegen.",
    "Slim rusten is ook trainen, strijder.",
  ],
  duur: [
    "Rustig, strijder. Kun je praten? Dan zit je goed.",
    "Ontspannen schouders, rustige adem. Lekker bezig.",
    "Rustige kilometers zijn de basis onder je 25 km.",
    "Wandelen tussendoor mag altijd.",
  ],
  lang: [
    "Lange zaterdag, strijder. Rustiger starten dan je wil.",
    "Elke kilometer erbij brengt je dichter bij die 25.",
    "Eten en drinken onderweg. Oefen het nu.",
    "Wandelen bij een drinkmoment is prima. Doorlopen is het doel.",
  ],
  tempo: [
    "Tempo, strijder. Stevig maar beheerst.",
    "Tussen de blokjes echt rustig, dat hoort erbij.",
    "Dit maakt je straks sneller op de 10 km.",
    "Comfortabel oncomfortabel, precies goed.",
  ],
  interval: [
    "Snel maar beheerst, strijder. Nooit sprinten.",
    "Elk blokje even snel, ook de laatste.",
    "Hier haal je je snelheid vandaan.",
    "Volle focus, dan rustig herstellen.",
  ],
};
const coachLine = (zone) => {
  const arr = COACH[zone] || COACH.duur;
  return arr[Math.floor(Math.random() * arr.length)];
};

const DONE = [
  "💪 Sterk gedaan, strijder!",
  "🔥 Weer eentje afgevinkt.",
  "🌈 Lekker bezig, strijder.",
  "☀️ Weer een stap richting 25 km.",
  "✅ Weer een stukje sterker.",
  "🌟 Knap volgehouden!",
];

const WHY = {
  herstel:  "Heel rustig lopen brengt bloed naar je spieren en ruimt vermoeidheid op, zonder nieuwe belasting. Juist dan worden je pezen en je knie sterker.",
  duur:     "Rustige kilometers bouwen je basis: een sterker hart, betere vetverbranding en pezen die wennen aan het lopen. Het meeste van je training is rustig, en dat is precies goed.",
  lang:     "De lange duurloop is de belangrijkste training van je week. Je lichaam leert energie te sparen en je hoofd leert lang door te gaan. Zo kom je stap voor stap bij die 25 km.",
  tempo:    "Tempoblokken liggen net onder je verzuringsgrens. Daardoor kun je langer een hoger tempo volhouden, en daar word je sneller van op de 10 km.",
  interval: "Korte snelle blokjes verbeteren je conditie en je looppas. Daardoor voelt je gewone tempo straks een stuk makkelijker.",
};

/* --- Helpers: twee flexibele trainingen, de finale op de echte zondag --- */
/* Het label onder een training volgt de zone, tenzij een sessie zelf een kind meegeeft. */
const KIND_BY_ZONE = { herstel: "Heel rustig", duur: "Rustig", lang: "Lange duurloop", tempo: "Tempo", interval: "Snel" };
const di  = (o) => ({ day: "di", dayLabel: "Dinsdag",   kind: KIND_BY_ZONE[o.zone], ...o });
const don = (o) => ({ day: "do", dayLabel: "Donderdag", kind: KIND_BY_ZONE[o.zone], ...o });
const za  = (o) => ({ day: "za", dayLabel: "Zaterdag",  kind: KIND_BY_ZONE[o.zone], ...o });

const PLAN = [
  /* ---------- Fase 1 · Slim opbouwen ---------- */
  { week: 1, dates: "26 okt–1 nov", phase: "Fase 1 · Slim opbouwen", note: "We beginnen bewust rustig. Je kunt al 10 km, maar je knie moet wennen aan vaker lopen. Liever te makkelijk dan te zwaar.", sessions: [
    di({ zone: "duur", km: 6, title: "Rustig instappen", goal: "Lekker beginnen, niets forceren", why: "Je kunt al 10 km, maar je knie liet merken dat het te snel ging. Daarom begint dit schema bewust rustig. Je longen zijn snel, je pezen en gewrichten hebben meer tijd nodig. Rustig opbouwen is hier de snelste weg naar 25 km.", blocks: [
      "6 km op 7:20–8:00/km",
      "Rustig betekent: je kunt nog praten",
      "Wandelen tussendoor mag altijd",
    ] }),
    don({ zone: "duur", km: 6, title: "Rustig lopen, daarna kracht", goal: "Eerst lopen, dan je krachttraining", blocks: [
      "6 km op 7:20–8:00/km",
      "Loop eerst en doe daarna je krachttraining, dan zijn je benen fris voor het lopen",
    ] }),
    za({ zone: "lang", km: 11, title: "Je eerste lange zaterdag", goal: "Net iets verder dan je al kunt", blocks: [
      "11 km op 7:30–8:15/km",
      "Rustig starten, het tempo maakt niet uit",
      "Voel je je knie? Wandel even en loop rustig verder. Blijft het, stop dan",
    ] }),
  ]},
  { week: 2, dates: "2–8 nov", phase: "Fase 1 · Slim opbouwen", note: "Dinsdag je eerste tempoblokjes. Zaterdag loop je verder dan je ooit liep: 13 km.", sessions: [
    di({ zone: "tempo", km: 7, title: "Eerste tempoblokjes", goal: "Even voelen hoe stevig voelt", blocks: [
      "2 km rustig inlopen",
      "3× 4 min op 6:25–6:45/km, met 2 min rustig ertussen",
      "Rustig uitlopen tot 7 km",
      "Stevig is niet hard: je kunt nog korte zinnen zeggen",
    ] }),
    don({ zone: "duur", km: 6, title: "Rustig doorlopen", goal: "Basis, daarna kracht", blocks: ["6 km op 7:20–8:00/km"] }),
    za({ zone: "lang", km: 13, title: "Lange loop, iets verder", goal: "13 km, je nieuwe record", blocks: [
      "13 km op 7:30–8:15/km",
      "Neem wat te drinken mee",
    ] }),
  ]},
  { week: 3, dates: "9–15 nov", phase: "Fase 1 · Slim opbouwen", note: "Zaterdag je eerste 15 km! Neem drinken en iets te eten mee, en wandel gerust bij een drinkmoment.", sessions: [
    di({ zone: "interval", km: 7, title: "Snelle blokjes", goal: "Je benen sneller laten draaien", blocks: [
      "2 km rustig inlopen",
      "6× 2 min op 6:00–6:20/km, met 2 min rustig ertussen",
      "Rustig uitlopen tot 7 km",
      "Snel is niet sprinten: houd elk blokje even snel",
    ] }),
    don({ zone: "duur", km: 7, title: "Rustig doorlopen", goal: "Basis, daarna kracht", blocks: ["7 km op 7:20–8:00/km"] }),
    za({ zone: "lang", km: 15, title: "🎉 Je eerste 15 km", goal: "Een mooie mijlpaal", blocks: [
      "15 km op 7:30–8:15/km",
      "Drink onderweg en eet na een uur iets",
      "Wandelen bij een drinkmoment is prima",
    ] }),
  ]},
  { week: 4, dates: "16–22 nov", phase: "Fase 1 · Slim opbouwen", recovery: true, note: "Rustweek: korter lopen en sterker worden. Dinsdag test je je snelheid met een 5 km tijdrit.", sessions: [
    di({ zone: "tempo", km: 7, title: "⏱️ 5 km tijdrit", goal: "Waar sta je nu?", why: "Deze tijdrit laat zien hoe snel je nu bent. Daarmee kunnen we je tempo's straks precies goed zetten, en zien we hoe ver je van die 52 minuten op de 10 km af zit.", blocks: [
      "1 km rustig inlopen plus 3 korte versnellingen",
      "5 km zo vlot als je vandaag eerlijk kunt",
      "Start rustiger dan je wil, de eerste kilometer voelt altijd makkelijk",
      "1 km rustig uitlopen",
      "Vul je tijd in, dan kijkt Coach Bart mee",
    ] }),
    don({ zone: "herstel", km: 5, title: "Heel rustig herstellen", goal: "Bijkomen van je tijdrit", blocks: ["5 km langzamer dan 8:00/km"] }),
    za({ zone: "lang", km: 12, title: "Rustweek: ontspannen lange loop", goal: "Korter, en lekker genieten", why: "Rustweek: je lange loop is deze week korter. Je wordt sterker tijdens het herstellen, en je knie krijgt de tijd om bij te komen.", blocks: ["12 km op 7:30–8:15/km"] }),
  ]},

  /* ---------- Fase 2 · Op naar 25 km ---------- */
  { week: 5, dates: "23–29 nov", phase: "Fase 2 · Op naar 25 km", note: "Na de rustweek gaan we weer verder. Zaterdag 17 km, en probeer eens een bospad of de duinen.", sessions: [
    di({ zone: "tempo", km: 8, title: "Langere tempoblokken", goal: "Langer stevig volhouden", blocks: [
      "2 km rustig inlopen",
      "2× 10 min op 6:25–6:45/km, met 3 min rustig ertussen",
      "Rustig uitlopen tot 8 km",
    ] }),
    don({ zone: "duur", km: 7, title: "Rustig doorlopen", goal: "Basis, daarna kracht", blocks: ["7 km op 7:20–8:00/km"] }),
    za({ zone: "lang", km: 17, title: "Lange loop: op naar 17 km", goal: "Tijd op je benen", blocks: [
      "17 km op 7:30–8:15/km",
      "Eet elke 30 tot 40 min iets, drink onderweg",
      "Loop hem eens op een bospad of door de duinen, goede oefening voor je trail later",
    ] }),
  ]},
  { week: 6, dates: "30 nov–6 dec", phase: "Fase 2 · Op naar 25 km", note: "Zaterdag bijna een halve marathon. Oefen met eten onderweg, dan weet je straks wat je maag aankan.", sessions: [
    di({ zone: "interval", km: 8, title: "Snelle blokjes, iets langer", goal: "Snelheid", blocks: [
      "2 km rustig inlopen",
      "5× 3 min op 6:00–6:20/km, met 2 min rustig ertussen",
      "Rustig uitlopen tot 8 km",
    ] }),
    don({ zone: "duur", km: 7, title: "Rustig doorlopen", goal: "Basis, daarna kracht", blocks: ["7 km op 7:20–8:00/km"] }),
    za({ zone: "lang", km: 19, title: "Bijna een halve marathon", goal: "19 km, rustig en sterk", blocks: [
      "19 km op 7:30–8:15/km",
      "Eet elke 30 tot 40 min iets, drink onderweg",
    ] }),
  ]},
  { week: 7, dates: "7–13 dec", phase: "Fase 2 · Op naar 25 km", note: "Je generale: 22 km op zaterdag. Hierna weet je dat die 25 km gaat lukken.", sessions: [
    di({ zone: "tempo", km: 8, title: "Laatste stevige training", goal: "Nog één keer stevig", blocks: [
      "2 km rustig inlopen",
      "3× 8 min op 6:25–6:45/km, met 2 min rustig ertussen",
      "Rustig uitlopen tot 8 km",
    ] }),
    don({ zone: "duur", km: 7, title: "Rustig doorlopen", goal: "Basis, daarna kracht", blocks: ["7 km op 7:20–8:00/km"] }),
    za({ zone: "lang", km: 22, title: "🎉 Verder dan een halve marathon", goal: "22 km, je generale", blocks: [
      "22 km op 7:30–8:15/km",
      "Eet elke 30 tot 40 min iets, drink onderweg",
      "Volgende week je 25 km!",
    ] }),
  ]},
  { week: 8, dates: "14–20 dec", phase: "Fase 2 · Op naar 25 km", finish: true, raceLabel: "🎉 Jouw 25 km", raceSub: "25 km lopen, voor oud en nieuw", note: "Dit is je week! Doordeweeks lekker rustig, en zaterdag loop je je 25 km.", sessions: [
    di({ zone: "duur", km: 6, title: "Los en fris", goal: "Benen wakker houden", blocks: [
      "5,5 km rustig",
      "4× 20 sec soepel versnellen",
      "Deze week geen zware benen in de krachttraining",
    ] }),
    don({ zone: "herstel", km: 5, title: "Benen sparen", goal: "Fris naar zaterdag", blocks: ["5 km langzamer dan 8:00/km", "Vrijdag rust, en eet goed"] }),
    za({ zone: "lang", km: 25, kind: "Mijlpaal", title: "🎉 25 km", goal: "Jouw doel: 25 km voor oud en nieuw", why: "Acht weken geleden was 10 km je langste loop. Vandaag loop je er 25. Rustig, op je eigen tempo, en wandelen bij een drinkmoment mag gewoon. Lukt het vandaag niet of zit het weer tegen? Dan loop je hem volgende week, nog ruim voor oud en nieuw.", blocks: [
      "Goed ontbijt, twee à drie uur voor je begint",
      "25 km op 7:30–8:15/km, de eerste 5 km extra rustig",
      "Eet elke 30 tot 40 min iets en drink regelmatig",
      "Wandelen bij een drinkmoment is prima, doorlopen is het doel",
      "Gelukt? Wat een strijder 🎉",
    ] }),
  ]},

  /* ---------- Fase 3 · Lekker het jaar uit ---------- */
  { week: 9, dates: "21–27 dec", phase: "Fase 3 · Lekker het jaar uit", recovery: true, note: "Bijkomen en genieten van de kerst. Liep je je 25 km nog niet? Dan doe je hem deze zaterdag.", sessions: [
    di({ zone: "herstel", km: 5, title: "Heel rustig bijkomen", goal: "Los na je 25 km", blocks: ["5 km langzamer dan 8:00/km"] }),
    don({ zone: "duur", km: 6, title: "Rustig kerstrondje", goal: "Lekker luchtig", blocks: ["6 km rustig", "Liep je je 25 km nog niet? Dan doe je hem deze zaterdag"] }),
    za({ zone: "duur", km: 10, title: "Lekker het jaar uitlopen", goal: "Gewoon genieten", blocks: [
      "10 km rustig",
      "Benieuwd naar je 10 km-tijd? Loop de laatste 3 km iets vlotter",
      "Op naar 2027 en die 50 km trail 🌲",
    ] }),
  ]},
];

const INFO = [
  { icon: "📱", title: "Zo werkt je app", items: [
    "Tik op een training: je ziet precies wat je doet en waarom.",
    "Klaar? Vul je afstand en tijd in en vink hem af. Zo zie je je voortgang groeien.",
    "Bovenaan elke week staat in één zin waar het die week om draait.",
    "Kan een week niet? Schuif alles een week op met de knop bij het schema, of zet een vakantie in je planning.",
  ]},
  { icon: "🎯", title: "Je doelen, eerlijk bekeken", items: [
    "Je hoofddoel van dit blok: 25 km lopen voor oud en nieuw. Die staat op zaterdag 19 december, met een week reserve erachter.",
    "10 km in 52 minuten is 5:12 per km. Je liep 1:07, dat is anderhalve minuut per kilometer sneller. Dat haal je niet in acht weken, maar het is een prachtig doel voor 2027.",
    "Binnen dit blok zit een 10 km rond het uur er goed in. Je 5 km tijdrit in week 4 laat zien waar je staat.",
    "Snel en ver tegelijk is lastig. Dit blok kiest voor ver, en daar word je vanzelf ook sneller van.",
  ]},
  { icon: "🦵", title: "Je knie, slim opbouwen", items: [
    "Na je eerste 10 km had je kniepijn. Dat kwam waarschijnlijk doordat je te snel te ver ging: je pezen moesten nog wennen.",
    "Daarom groeit je lange duurloop met 2 à 3 km per week, en is week 4 een rustweek.",
    "Wandelen tijdens een lange loop is geen falen. Het scheelt je knie en je komt verder.",
    "Pijn tijdens het lopen? Wandelen. Gaat het niet weg, stoppen. Komt het terug, laat er dan een fysiotherapeut naar kijken en laat het Coach Bart weten.",
  ]},
  { icon: "🗓️", title: "Zo werkt je week", items: [
    "Dinsdag: je kwaliteitstraining, met tempo, snelle blokjes of een tijdrit.",
    "Donderdag: rustig lopen. Daarna je krachttraining.",
    "Zaterdag: je lange duurloop, de belangrijkste training van je week.",
    "Zondag zin in een vierde loop? Doe dan 5 à 6 km heel rustig, het liefst op een bospad. Het hoeft niet.",
    "Komt een week niet uit? Gebruik de knop bij het schema om alles een week op te schuiven.",
  ]},
  { icon: "🏋️", title: "Kracht en hardlopen samen", items: [
    "Je krachttraining op maandag en donderdag is goud waard voor je knie en voor de lange afstanden.",
    "Zware benen het liefst op maandag. Op donderdag eerst lopen, daarna kracht.",
    "Goede oefeningen voor lopers: squats, lunges, step-ups, bruggetje, kuitheffen en planken.",
    "In de week van je 25 km geen zware benen meer.",
  ]},
  { icon: "🌲", title: "Op weg naar 50 km trail", items: [
    "50 km trailrunnen is een groot en mooi doel. Na dit blok bouwen we daar verder naartoe.",
    "Loop je lange duurloop af en toe al op onverhard: bos, duinen of een parkpad. Dan wennen je enkels en knieën aan oneffen grond.",
    "Bij trail draait het om tijd op je benen, niet om tempo. Bergop wandelen is daar heel normaal.",
    "Een goede volgende stap na de 25 km is een trail van 25 tot 30 km in het voorjaar.",
  ]},
  { icon: "🥤", title: "Eten en drinken", items: [
    "Langer dan een uur lopen: neem drinken mee.",
    "Vanaf anderhalf uur: elke 30 tot 40 min iets eten, zoals een gel, een banaan of wat winegums.",
    "Je 25 km duurt al snel ruim drie uur. Oefen dus op je lange zaterdagen wat je maag aankan.",
    "Avond ervoor: gewoon goed eten, met pasta, rijst of brood erbij.",
  ]},
  { icon: "🔥", title: "Warming-up en afkoelen", items: [
    "Bij tempo en snelle blokjes altijd eerst 2 km rustig inlopen.",
    "Rustige lopen mogen meteen rustig beginnen.",
    "Na afloop 5 min wandelen en losmaken: kuiten, bovenbenen, heupen.",
  ]},
  { icon: "😴", title: "Herstel en slaap", items: [
    "Drie keer lopen en twee keer kracht is veel. Slaap is je beste training.",
    "Na je lange zaterdag: goed eten en een rustige avond.",
    "Moe of slecht geslapen? Maak de donderdag korter, nooit de zaterdag.",
  ]},
];

const BADGES = [
  { id: "first",    icon: "👟", name: "Begonnen",        desc: "1 training afgevinkt",    test: (s) => s.done >= 1 },
  { id: "week",     icon: "✅", name: "Week compleet",   desc: "Een hele week afgerond",  test: (s) => s.fullWeeks >= 1 },
  { id: "tien",     icon: "🔟", name: "Dubbele cijfers", desc: "10 km in één training",   test: (s) => s.maxDist >= 10 },
  { id: "tijdrit",  icon: "⏱️", name: "Getest",          desc: "5 km tijdrit gelopen",    test: (s) => s.tijdritDone },
  { id: "vijftien", icon: "🌼", name: "Vijftien",        desc: "15 km in één training",   test: (s) => s.maxDist >= 15 },
  { id: "streak",   icon: "🔥", name: "Twee weken vol",  desc: "Reeks van 6 trainingen",  test: (s) => s.streak >= 6 },
  { id: "half",     icon: "⚡", name: "Halverwege",      desc: "50% van je schema",       test: (s) => s.done >= s.total / 2 },
  { id: "halve",    icon: "🌈", name: "Halve marathon",  desc: "21,1 km in één training", test: (s) => s.maxDist >= 21.1 },
  { id: "km200",    icon: "🚀", name: "Tweehonderd km",  desc: "200 km totaal gelopen",   test: (s) => s.km >= 200 },
  { id: "finish",   icon: "🎉", name: "25 km!",          desc: "Je doel voor oud en nieuw", test: (s) => s.km25Done },
];

/* ================================================================== *
 *  State
 * ================================================================== */
const LEGACY_KEYS = CONFIG.legacyKeys || [];

function leesSleutel(k) {
  try { const v = JSON.parse(localStorage.getItem(k)); return v && typeof v === "object" ? v : null; }
  catch { return null; }
}
function aantalSessies(o) { return o ? Object.keys(o).filter((k) => /^w\d+-/.test(k)).length : 0; }
function samenvoegen(hoofd, extra) { return { ...extra, ...hoofd }; }

/* Voortgang laden. Staat er iets onder een oudere opslagsleutel, dan nemen we
   dat over, zodat niemand zijn afgevinkte trainingen kwijtraakt. */
function loadLog() {
  let uit = leesSleutel(STORE_KEY) || {};
  const eigen = aantalSessies(uit);
  LEGACY_KEYS.forEach((k) => {
    const oud = leesSleutel(k);
    if (aantalSessies(oud)) uit = samenvoegen(uit, oud);
  });
  if (aantalSessies(uit) > eigen) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(uit)); } catch {}
  }
  return uit;
}
function saveLog() {
  log.__saved = Date.now();
  try { localStorage.setItem(STORE_KEY, JSON.stringify(log)); } catch {}
  idbZet(log);
  renderLaatstOpgeslagen();
}

/* ----- Tweede back-up in IndexedDB ---------------------------------- *
 *  localStorage kan door de browser worden opgeruimd. Elke opslag gaat
 *  daarom ook naar IndexedDB; bij opstarten halen we terug wat vollediger is.
 * -------------------------------------------------------------------- */
const IDB_NAAM = "bartlopen-runcoach", IDB_STORE = "logs";
function idbOpen() {
  return new Promise((ok, nee) => {
    if (!window.indexedDB) return nee(new Error("geen indexedDB"));
    const r = indexedDB.open(IDB_NAAM, 1);
    r.onupgradeneeded = () => {
      if (!r.result.objectStoreNames.contains(IDB_STORE)) r.result.createObjectStore(IDB_STORE);
    };
    r.onsuccess = () => ok(r.result);
    r.onerror = () => nee(r.error);
  });
}
async function idbZet(data) {
  try {
    const db = await idbOpen();
    await new Promise((ok, nee) => {
      const t = db.transaction(IDB_STORE, "readwrite");
      t.objectStore(IDB_STORE).put(JSON.parse(JSON.stringify(data)), STORE_KEY);
      t.oncomplete = ok; t.onerror = () => nee(t.error);
    });
  } catch {}
}
async function idbHaal() {
  try {
    const db = await idbOpen();
    return await new Promise((ok, nee) => {
      const t = db.transaction(IDB_STORE, "readonly");
      const q = t.objectStore(IDB_STORE).get(STORE_KEY);
      q.onsuccess = () => ok(q.result || null);
      q.onerror = () => nee(q.error);
    });
  } catch { return null; }
}
function herstelUitBackup() {
  return idbHaal().then((kopie) => {
    if (!kopie) { idbZet(log); return false; }
    if (aantalSessies(kopie) > aantalSessies(log)) {
      log = samenvoegen(log, kopie);
      saveLog(); renderAll();
      toast("Je voortgang is teruggehaald 🔄");
      return true;
    }
    idbZet(log);
    return false;
  }).catch(() => false);
}
function renderLaatstOpgeslagen() {
  const el = document.getElementById("lastSaved");
  if (!el) return;
  const t = log.__saved;
  if (!t) { el.textContent = ""; return; }
  const d = new Date(t), pad = (n) => String(n).padStart(2, "0");
  el.textContent = `Laatst opgeslagen: ${d.getDate()}-${pad(d.getMonth() + 1)} om ${pad(d.getHours())}:${pad(d.getMinutes())} · ${aantalSessies(log)} trainingen ingevuld`;
}
let log = loadLog();

const sid = (week, day) => `w${week}-${day}`;
const flatSessions = PLAN.flatMap((w) => w.sessions.map((s) => ({ ...s, week: w.week })));
const totalSessions = flatSessions.length;
const LAST_SESSION = flatSessions[flatSessions.length - 1];
/* Vaste ankers, zodat behaalde badges niet verschuiven als er weken bijkomen. */
const TIJDRIT_SESSION = { week: 4, day: "di" }; /* 5 km tijdrit, 17 nov */
const KM25_SESSION = { week: 8, day: "za" };    /* 25 km, 19 dec */
const DAY_OFFSET = { ma: 0, di: 1, wo: 2, do: 3, vr: 4, za: 5, zo: 6, d1: 0, d2: 2, d3: 4, d4: 6 };

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

function dateAtDay(dayIndex) {
  const date = new Date(schedStartMs());
  date.setDate(date.getDate() + dayIndex);
  date.setHours(12, 0, 0, 0);
  return date;
}

function sessionDate(week, day) {
  return dateAtDay((week - 1) * 7 + (DAY_OFFSET[day] ?? 0));
}

function isoDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function planningEntries() {
  return Array.isArray(log.__planning) ? log.__planning : [];
}

function planningForWeek(week) {
  const start = isoDate(dateAtDay((week - 1) * 7));
  const end = isoDate(dateAtDay((week - 1) * 7 + 6));
  return planningEntries().filter((entry) => entry.start <= end && (entry.end || entry.start) >= start);
}

function parseTime(str) {
  if (!str) return null;
  const parts = String(str).split(":").map((p) => parseInt(p, 10));
  if (parts.some((n) => Number.isNaN(n))) return null;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] * 60;
}

function durationParts(str) {
  const total = parseTime(str) || 0;
  return { minutes: Math.floor(total / 60), seconds: total % 60 };
}

function durationValue(minutes, seconds) {
  const m = Math.max(0, parseInt(minutes, 10) || 0);
  const s = Math.min(59, Math.max(0, parseInt(seconds, 10) || 0));
  return `${m}:${String(s).padStart(2, "0")}`;
}
function paceSeconds(distance, timeStr) {
  const d = parseFloat(String(distance).replace(",", "."));
  const sec = parseTime(timeStr);
  if (!d || !sec) return null;
  return sec / d;
}
function fmtPace(perKm) {
  if (!perKm) return null;
  const m = Math.floor(perKm / 60);
  const s = Math.round(perKm % 60);
  return `${m}:${String(s).padStart(2, "0")} /km`;
}

/* Afgeleide statistieken uit de log */
function computeStats() {
  let done = 0, km = 0, maxDist = 0, maxTime = 0, bestPace = 0, secs = 0, raceDone = false;
  flatSessions.forEach((s) => {
    const e = log[sid(s.week, s.day)];
    if (!e || !e.done) return;
    done++;
    const d = parseFloat(String(e.distance || "").replace(",", ".")) || 0;
    km += d;
    if (d > maxDist) maxDist = d;
    const t = parseTime(e.time) || 0;
    secs += t;
    if (t > maxTime) maxTime = t;
    const p = paceSeconds(e.distance, e.time);
    if (p && (bestPace === 0 || p < bestPace)) bestPace = p;
    if (s.week === LAST_SESSION.week && s.day === LAST_SESSION.day) raceDone = true;
  });
  let streak = 0, run = 0;
  flatSessions.forEach((s) => {
    const e = log[sid(s.week, s.day)];
    if (e && e.done) { run++; streak = Math.max(streak, run); } else run = 0;
  });
  let fullWeeks = 0;
  PLAN.forEach((w) => {
    if (w.sessions.every((s) => log[sid(w.week, s.day)]?.done)) fullWeeks++;
  });
  const klaar = (a) => !!log[sid(a.week, a.day)]?.done;
  const tijdritDone = klaar(TIJDRIT_SESSION), km25Done = klaar(KM25_SESSION);
  return { done, total: totalSessions, km, maxDist, maxTime, bestPace, secs, raceDone, tijdritDone, km25Done, streak, fullWeeks };
}

function currentWeek() {
  const diff = Math.floor((Date.now() - schedStartMs()) / (7 * 864e5));
  /* Uit PLAN afleiden, niet uit TOTAL_WEEKS: anders blijft de huidige week
     hangen op de oude laatste week zodra er weken bijkomen. */
  return Math.min(PLAN[PLAN.length - 1].week, Math.max(1, diff + 1));
}

/* ================================================================== *
 *  Rendering
 * ================================================================== */
const $ = (id) => document.getElementById(id);

function animateCount(el, to, suffix = "") {
  const dur = 700, t0 = performance.now();
  const dec = to % 1 !== 0;
  function step(t) {
    const k = Math.min(1, (t - t0) / dur);
    const v = to * (1 - Math.pow(1 - k, 3));
    el.textContent = (dec ? v.toFixed(1).replace(".", ",") : Math.round(v)) + suffix;
    if (k < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function renderHero(stats) {
  $("runnerName").textContent = RUNNER;
  $("goalText").textContent = GOAL;
  const pct = Math.round((stats.done / stats.total) * 100);
  $("ringPct").textContent = `${pct}%`;
  const r = 52, c = 2 * Math.PI * r;
  const fg = $("ringFg");
  fg.style.strokeDasharray = c;
  fg.style.strokeDashoffset = c;
  requestAnimationFrame(() => { fg.style.strokeDashoffset = c * (1 - pct / 100); });
  const mottos = CONFIG.mottos || ["Zet 'm op, strijder!", "Lekker bezig, strijder!", "Je bouwt 'm rustig op, strijder.", "Halverwege, knap volgehouden! ⚡", "Bijna race-klaar, strijder!", "Finisher! Wat een prestatie, strijder. 🏅"];
  $("heroMotto").textContent =
    stats.raceDone ? mottos[5] : pct >= 80 ? mottos[4] : pct >= 50 ? mottos[3] : pct >= 20 ? mottos[2] : pct > 0 ? mottos[1] : mottos[0];
  renderCountdown();
  renderSubgoal();
}

function raceTarget() {
  /* Het eerstvolgende doel dat nog moet komen. Gelopen = datum voorbij óf afgevinkt.
     Via dateAtDay rekenen, niet met milliseconden: dat schuift bij de zomertijd. */
  const vandaag = new Date().setHours(0, 0, 0, 0);
  const datumVan = (w) => {
    const d = w.sessions[w.sessions.length - 1].day;
    return dateAtDay((w.week - 1) * 7 + (DAY_OFFSET[d] ?? 6)).setHours(0, 0, 0, 0);
  };
  const doelen = PLAN.filter((w) => w.race || w.finish || w.tuneup);
  const gelopen = (w) => {
    const d = w.sessions[w.sessions.length - 1].day;
    return datumVan(w) < vandaag || !!log[sid(w.week, d)]?.done;
  };
  const volgende = doelen.find((w) => !gelopen(w));
  const rw = volgende || doelen[doelen.length - 1] || PLAN[PLAN.length - 1];
  const rs = rw.sessions[rw.sessions.length - 1];
  return { rw, rs, date: new Date(datumVan(rw)), allesGelopen: !volgende };
}

function raceInfo() {
  const { rs, date, allesGelopen } = raceTarget();
  const days = Math.round((new Date(date).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) / 864e5);
  return { days: allesGelopen ? -1 : days, name: rs.title.replace(/^[^\p{L}\d]+/u, "").trim() };
}

const NL_DAG = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];
const NL_MAAND = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
function renderSubgoal() {
  const el = document.querySelector(".hero-subgoal");
  if (!el) return;
  const { rw, rs, date, allesGelopen } = raceTarget();
  const d = new Date(date);
  const voorbij = allesGelopen || new Date(date).setHours(12, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
  const soort = rw.race ? "🏁 Doelrace" : rw.finish ? "🎉 Mijlpaal" : "🎯 Tussendoel";
  /* Flexibele trainingen hebben geen vaste dag: dan noemen we de week. */
  const ma = dateAtDay((rw.week - 1) * 7);
  const wanneer = /^d\d+$/.test(rs.day)
    ? `week van ${ma.getDate()} ${NL_MAAND[ma.getMonth()]}`
    : `${NL_DAG[d.getDay()]} ${d.getDate()} ${NL_MAAND[d.getMonth()]}`;
  const kop = `${voorbij ? "🎉 Gelopen" : soort} · ${wanneer}`;
  el.innerHTML = `<span>${kop}</span><strong>${rw.raceSub || rs.title.replace(/^[^\p{L}\d]+/u, "").trim()}</strong>`;
}

function renderCountdown() {
  const motto = $("heroMotto");
  if (!motto) return;
  let el = $("raceCountdown");
  if (!el) {
    el = document.createElement("p");
    el.id = "raceCountdown";
    el.className = "hero-countdown";
    motto.after(el);
  }
  const { days, name } = raceInfo();
  const wks = Math.round(days / 7), mon = Math.round(days / 30);
  el.textContent =
    days > 180 ? `🗓️ jouw grote doel: over ~${mon} maanden, ${name}` :
    days > 14 ? `🗓️ nog ${wks} weken tot je ${name}` :
    days > 1 ? `🗓️ nog ${days} dagen tot je ${name}` :
    days === 1 ? `🗓️ morgen is het zover: ${name}!` :
    days === 0 ? `🔥 vandaag is het zover: ${name}!` :
    `🎉 ${name} volbracht, chapeau!`;
}

function renderStats(stats) {
  animateCount($("statDone"), stats.done);
  animateCount($("statKm"), Math.round(stats.km * 10) / 10, " km");
  animateCount($("statStreak"), stats.streak);
  const cw = currentWeek();
  const wk = PLAN.find((w) => w.week === cw);
  const wkDone = wk.sessions.filter((s) => log[sid(cw, s.day)]?.done).length;
  $("statWeek").textContent = `${wkDone}/${wk.sessions.length}`;
}

function renderNextUp() {
  const cw = currentWeek();
  const next =
    flatSessions.find((s) => s.week >= cw && !log[sid(s.week, s.day)]?.done) ||
    flatSessions.find((s) => !log[sid(s.week, s.day)]?.done);
  const box = $("nextUp");
  if (!next) {
    box.innerHTML = `<div class="nextup-card done"><span class="nextup-eyebrow">🏅 Schema compleet</span><strong>Alles afgevinkt, chapeau, ${RUNNER}!</strong></div>`;
    return;
  }
  const z = zoneByKey[next.zone];
  box.innerHTML = `
    <button class="nextup-card zone-${next.zone}" data-week="${next.week}" data-day="${next.day}">
      <span class="nextup-eyebrow">Volgende training · week ${next.week} · ${next.dayLabel}</span>
      <strong>${next.title}</strong>
      <span class="nextup-meta">${nlNum(next[UNIT])} ${UNIT_LABEL} · ${z.name}</span>
      <span class="nextup-go">Openen ›</span>
    </button>`;
  box.querySelector(".nextup-card").addEventListener("click", () => openDetail(next.week, next.day));
}

const PLANNING_META = {
  race: {
    icon: "🏁", label: "Tussentijdse race",
    advice: "Laat deze race je lange training vervangen. Houd de training ervoor rustig en plan daarna minimaal één hersteldag.",
  },
  vacation: {
    icon: "🌴", label: "Vakantie",
    advice: "Gemiste trainingen hoef je niet in te halen. Pak bij thuiskomst de eerstvolgende rustige training op.",
  },
  rest: {
    icon: "🩹", label: "Rust / blessure",
    advice: "Herstel gaat voor het schema. Hervat pas pijnvrij en bouw de eerste week extra rustig op.",
  },
};

function formatPlanDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T12:00:00`);
  return date.toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" });
}

function renderPlanning() {
  const list = $("planningList");
  if (!list) return;
  const entries = [...planningEntries()].sort((a, b) => a.start.localeCompare(b.start));
  if (!entries.length) {
    list.innerHTML = `<div class="planning-empty"><span>🗓️</span><p>Nog niets gepland. Voeg een vakantie of oefenwedstrijd toe zodra je die weet.</p></div>`;
    return;
  }
  list.innerHTML = entries.map((entry) => {
    const meta = PLANNING_META[entry.type] || PLANNING_META.rest;
    const period = entry.end && entry.end !== entry.start
      ? `${formatPlanDate(entry.start)} – ${formatPlanDate(entry.end)}`
      : formatPlanDate(entry.start);
    return `<article class="planning-item plan-${entry.type}">
      <span class="planning-icon">${meta.icon}</span>
      <div class="planning-copy">
        <span class="planning-type">${meta.label} · ${period}</span>
        <strong>${escapeHtml(entry.title)}</strong>
        ${entry.note ? `<p>${escapeHtml(entry.note)}</p>` : ""}
        <p class="planning-advice"><b>Coachadvies:</b> ${meta.advice}</p>
      </div>
      <button class="planning-remove" type="button" data-plan-id="${escapeHtml(entry.id)}" aria-label="${escapeHtml(entry.title)} verwijderen">×</button>
    </article>`;
  }).join("");
  list.querySelectorAll(".planning-remove").forEach((button) => {
    button.addEventListener("click", () => {
      log.__planning = planningEntries().filter((entry) => entry.id !== button.dataset.planId);
      saveLog();
      renderAll();
      toast("Uit je planning verwijderd");
    });
  });
}

function renderZones() {
  $("zonesList").innerHTML = ZONES.map((z) => `
    <div class="zone-row zone-${z.key}">
      <span class="zone-dot"></span>
      <div class="zone-main"><strong>${z.name}</strong><span>${z.info}</span></div>
      <span class="zone-pace">${z.pace}${ZONE_SUFFIX ? `<small>${ZONE_SUFFIX}</small>` : ""}</span>
    </div>`).join("");
}

function renderChart() {
  const volumeSub = document.querySelector("#volumeChart")?.closest(".panel")?.querySelector(".panel-sub");
  if (volumeSub) volumeSub.textContent = `${(typeof UNIT !== "undefined" ? UNIT : "min") === "min" ? "minuten" : "kilometers"} · gepland · gedaan`;
  const cwBar = currentWeek();
  const max = Math.max(...PLAN.map((w) => w.sessions.reduce((n, s) => n + s[UNIT], 0)));
  $("volumeChart").innerHTML = PLAN.map((w) => {
    const planned = w.sessions.reduce((n, s) => n + s[UNIT], 0);
    const doneMin = w.sessions.reduce((n, s) => n + (log[sid(w.week, s.day)]?.done ? s[UNIT] : 0), 0);
    const h = Math.round((planned / max) * 100);
    const fill = planned ? Math.round((doneMin / planned) * 100) : 0;
    const cls = ((w.race || w.tuneup || w.finish) ? "is-race" : w.recovery ? "is-rest" : "") + (w.week === cwBar ? " is-now" : "");
    return `
      <div class="bar ${cls}" title="Week ${w.week}: ${nlNum(Math.round(planned * 10) / 10)} ${UNIT_LABEL} gepland">
        <div class="bar-track" style="height:${h}%">
          <div class="bar-fill" style="height:${fill}%"></div>
        </div>
        <span class="bar-x">${w.week}</span>
      </div>`;
  }).join("");
}

function tagOf(w) {
  if (w.finish) return `<span class="week-tag tag-race">Finale</span>`;
  if (w.race) return `<span class="week-tag tag-race">Raceweek</span>`;
  if (w.tuneup) return `<span class="week-tag tag-tuneup">${w.tuneupTag || "Wedstrijd"}</span>`;
  if (w.recovery) return `<span class="week-tag tag-rest">Herstel</span>`;
  if (w.taper) return `<span class="week-tag tag-taper">Taper</span>`;
  return "";
}

function renderWeeks() {
  const cw = currentWeek();
  const todayIso = isoDate(new Date());
  let html = "", lastPhase = "";
  PLAN.forEach((w, i) => {
    if (w.phase !== lastPhase) { html += `<h4 class="sub-phase reveal">${w.phase}</h4>`; lastPhase = w.phase; }
    const sess = w.sessions.map((s) => {
      const e = log[sid(w.week, s.day)] || {};
      const z = zoneByKey[s.zone];
      const pace = fmtPace(paceSeconds(e.distance, e.time));
      const bits = [];
      if (e.distance) bits.push(`${e.distance} km`);
      if (pace) bits.push(pace);
      if (e.hr) bits.push(`${e.hr} bpm`);
      const logged = bits.length ? `<span class="session-logged">📊 ${bits.join(" · ")}</span>` : "";
      const lastDay = w.sessions[w.sessions.length - 1].day;
      const isRaceSession = (w.race || w.tuneup || w.finish) && s.day === lastDay;
      const isToday = isoDate(sessionDate(w.week, s.day)) === todayIso;
      const raceKicker = isRaceSession
        ? `<span class="session-race-kicker">${w.raceLabel || (w.race ? "🏅 Doelrace" : w.tuneup ? "🏁 Wedstrijd" : "🏁 Finale")}</span>`
        : "";
      const isFlexibleSlot = /^d\d+$/.test(s.day);
      const badgeLabel = isFlexibleSlot ? s.day.slice(1) : s.dayLabel.slice(0, 2);
      return `
        <button class="session zone-${s.zone} ${isRaceSession ? "is-race-session" : ""} ${e.done ? "is-done" : ""} ${isToday ? "is-today" : ""}" data-week="${w.week}" data-day="${s.day}">
          <span class="session-day ${isFlexibleSlot ? "is-slot" : ""}" title="${s.dayLabel}">${isRaceSession ? "<small>🏁</small>" : ""}${badgeLabel}</span>
          <span class="session-body">
            ${raceKicker}
            <span class="session-title">${s.title}${isToday ? ' <span class="today-badge">Vandaag</span>' : ""}</span>
            <span class="session-meta">${nlNum(s[UNIT])} ${UNIT_LABEL} · ${s.kind}</span>
            ${logged}
          </span>
          <span class="session-check">${e.done ? "✓" : ""}</span>
        </button>`;
    }).join("");
    const weekPlans = planningForWeek(w.week);
    const planStrip = weekPlans.length ? `<div class="week-planning">${weekPlans.map((entry) => {
      const meta = PLANNING_META[entry.type] || PLANNING_META.rest;
      return `<span>${meta.icon} ${escapeHtml(entry.title)}</span>`;
    }).join("")}</div>` : "";
    html += `
      <article class="week-card reveal ${w.tuneup ? "is-tuneup-week" : ""} ${w.race ? "is-goal-race-week" : ""} ${w.week === cw ? "is-current" : ""} ${w.week < cw ? (w.sessions.every((x) => log[sid(w.week, x.day)]?.done) ? "is-complete" : "is-missed") : ""}" style="--i:${i % 4}">
        <header class="week-head">
          <div><span class="week-no">Week ${w.week}</span><span class="week-dates">${weekDateLabel(w)}</span></div>
          ${w.week === cw ? `<span class="week-tag tag-now">Nu</span>` : w.week < cw ? (w.sessions.every((x) => log[sid(w.week, x.day)]?.done) ? `<span class="week-tag tag-done">✓ af</span>` : `<span class="week-tag tag-missed">gemist</span>`) : tagOf(w)}
        </header>
        ${planStrip}
        ${w.note ? `<p class="week-note">${w.note}</p>` : ""}
        <div class="session-list">${sess}</div>
      </article>`;
  });
  $("weeksList").innerHTML = html;
  /* Koppen altijd kloppend met het schema */
  const schemaKop = [...document.querySelectorAll(".phase-head")].find((e) => /Het schema/.test(e.textContent));
  if (schemaKop) schemaKop.textContent = `Het schema · ${PLAN.length} weken`;
  $("weeksList").querySelectorAll(".session").forEach((b) =>
    b.addEventListener("click", () => openDetail(+b.dataset.week, b.dataset.day)));
  observeReveals();
}

function renderBadges(stats) {
  $("badgeGrid").innerHTML = BADGES.map((b) => {
    const got = b.test(stats);
    return `
      <div class="badge ${got ? "got" : "locked"}" title="${b.desc}">
        <span class="badge-icon">${got ? b.icon : "🔒"}</span>
        <strong>${b.name}</strong>
        <span class="badge-desc">${b.desc}</span>
      </div>`;
  }).join("");
}

function renderInfo() {
  $("infoList").innerHTML = INFO.map((c, i) => `
    <article class="info-card reveal" style="--i:${i}">
      <span class="info-icon">${c.icon}</span>
      <h4>${c.title}</h4>
      <ul>${c.items.map((t) => `<li>${t}</li>`).join("")}</ul>
    </article>`).join("");
}

/* ----- Snelknop: gelijk naar je trainingen ------------------------------ */
function renderNaarTrainingen() {
  const hero = document.querySelector("#listView .hero");
  if (!hero) return;
  let btn = document.getElementById("naarTrainingen");
  if (!btn) {
    btn = document.createElement("button");
    btn.id = "naarTrainingen";
    btn.type = "button";
    btn.className = "naar-trainingen";
    btn.addEventListener("click", naarTrainingen);
    hero.insertAdjacentElement("afterend", btn);
  }
  const cw = currentWeek();
  const laatste = PLAN[PLAN.length - 1].week;
  const volgende = flatSessions.find((s) => s.week >= cw && !log[sid(s.week, s.day)]?.done);
  const sub = volgende
    ? `Week ${cw} van ${laatste} · volgende: ${volgende.title.replace(/^[^\p{L}\d]+/u, "").trim()}`
    : `Week ${cw} van ${laatste} · bekijk je schema`;
  const emoji = (typeof CONFIG !== "undefined" && CONFIG.footEmoji) || "🏃";
  btn.setAttribute("aria-label", `Gelijk naar je trainingen. ${sub}`);
  btn.innerHTML = `<span class="nt-icoon" aria-hidden="true">${emoji}</span>` +
    `<span class="nt-tekst"><strong>Gelijk naar je trainingen</strong><small>${escapeHtml(sub)}</small></span>` +
    `<span class="nt-pijl" aria-hidden="true">↓</span>`;
}
function naarTrainingen() {
  const doel = document.querySelector(".week-card.is-current") || document.querySelector(".weeks");
  if (!doel) return;
  doel.classList.add("in");
  const bar = document.querySelector(".topbar");
  const y = doel.getBoundingClientRect().top + window.scrollY - (bar ? bar.offsetHeight : 0) - 8;
  window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
}

function addJumpButton() {
  const head = document.querySelector(".weeks .phase-head");
  if (!head || document.getElementById("jumpNow")) return;
  const btn = document.createElement("button");
  btn.id = "jumpNow";
  btn.type = "button";
  btn.className = "jump-now";
  btn.textContent = "Naar deze week ↓";
  btn.addEventListener("click", () =>
    document.querySelector(".week-card.is-current")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  head.insertAdjacentElement("afterend", btn);
}

/* ----- Extra's: begroeting, records, consistentie ------------------- */
function greetingWord() {
  const h = new Date().getHours();
  return h < 6 ? "Goedenacht" : h < 12 ? "Goedemorgen" : h < 18 ? "Goedemiddag" : "Goedenavond";
}
function renderGreeting() {
  const copy = document.querySelector(".hero-copy");
  if (!copy) return;
  let el = document.getElementById("heroGreeting");
  if (!el) {
    el = document.createElement("p");
    el.id = "heroGreeting";
    el.className = "hero-greeting";
    copy.insertBefore(el, copy.firstChild);
  }
  el.textContent = `${greetingWord()}, ${RUNNER.split(" ")[0]} 👋`;
}
function renderRecords(stats) {
  const anchor = document.querySelector(".weeks");
  if (!anchor) return;
  let sec = document.getElementById("recordsPanel");
  if (!sec) {
    sec = document.createElement("section");
    sec.id = "recordsPanel";
    sec.className = "panel reveal";
    anchor.parentNode.insertBefore(sec, anchor);
  }
  const pace = fmtPace(stats.bestPace);
  const longest = UNIT === "min"
    ? (stats.maxTime ? `${Math.round(stats.maxTime / 60)} min` : "–")
    : (stats.maxDist ? `${nlNum(stats.maxDist)} km` : "–");
  const totaalMin = stats.secs ? `${Math.round(stats.secs / 60)} min` : "–";
  const rows = UNIT === "min"
    ? [
        stats.bestPace ? ["⚡ Snelste tempo", pace] : ["✅ Trainingen gedaan", String(stats.done)],
        ["⏱️ Langste loop", longest],
        ["📊 Totaal gelopen", totaalMin],
        ["🔥 Langste reeks", String(stats.streak)],
      ]
    : [
        ["⚡ Snelste tempo", pace || "–"],
        ["🏔️ Verste loop", longest],
        ["📊 Totaal gelopen", `${nlNum(Math.round(stats.km * 10) / 10)} km`],
        ["🔥 Langste reeks", String(stats.streak)],
      ];
  sec.innerHTML = `<h3 class="panel-head">Jouw records</h3>
    <div class="records">${rows.map(([l, v]) =>
      `<div class="record"><span class="record-val">${v}</span><span class="record-label">${l}</span></div>`).join("")}</div>`;
}
function renderConsistency() {
  const grid = document.querySelector(".stats-grid");
  if (!grid) return;
  let sec = document.getElementById("consistencyStrip");
  if (!sec) {
    sec = document.createElement("section");
    sec.id = "consistencyStrip";
    sec.className = "panel consistency-panel reveal";
    grid.parentNode.insertBefore(sec, grid.nextSibling);
  }
  const todayIso = isoDate(new Date());
  const cw = currentWeek();
  let done = 0, total = 0;
  const cols = PLAN.map((w) => {
    const cells = w.sessions.map((s) => {
      const e = log[sid(w.week, s.day)] || {};
      const dIso = isoDate(sessionDate(w.week, s.day));
      total++;
      if (e.done) done++;
      const cls = e.done ? "is-done" : dIso < todayIso ? "is-missed" : "is-todo";
      return `<span class="ccell ${cls}${dIso === todayIso ? " is-today" : ""}" title="Week ${w.week} \u00b7 ${s.dayLabel}"></span>`;
    }).join("");
    return `<div class="cweek${w.week === cw ? " is-current" : ""}"><div class="ccells">${cells}</div><span class="cweek-no">${w.week}</span></div>`;
  }).join("");
  const pct = total ? Math.round((done / total) * 100) : 0;
  sec.innerHTML = `
    <h3 class="panel-head">Consistentie <span class="panel-sub">elk blokje is een training</span></h3>
    <div class="cweeks">${cols}</div>
    <div class="cons-foot">
      <div class="cons-legend"><span><i class="ck ck-done"></i>afgerond</span><span><i class="ck ck-missed"></i>gemist</span><span><i class="ck ck-todo"></i>komt nog</span></div>
      <span class="cons-score"><strong>${done}/${total}</strong> gedaan \u00b7 ${pct}%</span>
    </div>`;
}

/* ----- Schema opschuiven (drukke week) ------------------------------ */
const NL_MND = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
function weekOffset() { return (log && log.__weekOffset) || 0; }
function schedStartMs() { return START_DATE.getTime() + weekOffset() * 7 * 864e5; }
function weekDateLabel(w) {
  if (!weekOffset()) return w.dates;
  const mon = dateAtDay((w.week - 1) * 7), sun = dateAtDay((w.week - 1) * 7 + 6);
  return `${mon.getDate()} ${NL_MND[mon.getMonth()]}–${sun.getDate()} ${NL_MND[sun.getMonth()]}`;
}
function renderShiftControl() {
  const head = document.querySelector(".weeks .phase-head");
  if (!head) return;
  let el = document.getElementById("shiftControl");
  if (!el) {
    el = document.createElement("div");
    el.id = "shiftControl";
    el.className = "shift-control reveal";
    head.insertAdjacentElement("afterend", el);
  }
  const off = weekOffset();
  const wk = (n) => `${n} week${n > 1 ? "en" : ""}`;
  el.innerHTML = off > 0
    ? `<div class="shift-copy"><strong>Schema ${wk(off)} opgeschoven</strong><span>Je hele schema loopt nu ${wk(off)} langer. Niks staat op gemist.</span></div><div class="shift-btns"><button id="shiftMore" type="button">Nog een week</button><button id="shiftReset" type="button" class="ghost">Ongedaan maken</button></div>`
    : `<div class="shift-copy"><strong>Drukke week gehad?</strong><span>Schuif je hele schema een week op, dan raak je niks kwijt.</span></div><div class="shift-btns"><button id="shiftMore" type="button">Schuif 1 week op ↦</button></div>`;
  el.querySelector("#shiftMore").addEventListener("click", () => {
    if (!confirm("Je hele schema een week opschuiven?\n\nAlle trainingen schuiven mee. Je kunt dit altijd terugzetten.")) return;
    log.__weekOffset = weekOffset() + 1; saveLog(); renderAll();
    toast("Schema een week opgeschoven 📅");
  });
  const rs = el.querySelector("#shiftReset");
  if (rs) rs.addEventListener("click", () => {
    log.__weekOffset = 0; saveLog(); renderAll();
    toast("Opschuiven ongedaan gemaakt");
  });

  /* Duidelijke melding bovenaan: een per ongeluk verschoven schema moet je
     meteen zien, niet pas als je ver naar beneden scrollt. */
  const hero = document.querySelector(".hero");
  let notice = document.getElementById("shiftNotice");
  if (off > 0 && hero) {
    if (!notice) {
      notice = document.createElement("div");
      notice.id = "shiftNotice";
      notice.className = "shift-notice";
      hero.insertAdjacentElement("afterend", notice);
    }
    notice.innerHTML = `<div class="shift-copy"><strong>\u{1F4C5} Je schema staat ${wk(off)} opgeschoven</strong><span>Daardoor sta je ${wk(off)} eerder in je schema dan de kalender. Klopt dat niet? Zet het gewoon terug.</span></div><div class="shift-btns"><button id="noticeReset" type="button">Zet terug</button></div>`;
    notice.querySelector("#noticeReset").addEventListener("click", () => {
      log.__weekOffset = 0; saveLog(); renderAll();
      toast("Schema teruggezet \u{1F4C5}");
    });
  } else if (notice) {
    notice.remove();
  }
}

function renderAll() {
  const stats = computeStats();
  renderHero(stats);
  renderNaarTrainingen();
  renderStats(stats);
  renderGreeting();
  renderConsistency();
  renderNextUp();
  renderPlanning();
  renderChart();
  renderZones();
  renderWeeks();
  addJumpButton();
  renderShiftControl();
  renderBadges(stats);
  renderRecords(stats);
  renderInfo();
  observeReveals();
}

/* ----- Detailweergave ------------------------------------------------ */
function openDetail(week, day) {
  const w = PLAN.find((x) => x.week === week);
  const s = w.sessions.find((x) => x.day === day);
  /* Alleen de wedstrijd zelf is een wedstrijd, niet de andere trainingen in die week. */
  const isRaceDetail = (w.race || w.tuneup || w.finish) && s.day === w.sessions[w.sessions.length - 1].day;
  const id = sid(week, day);
  const e = log[id] || {};
  const z = zoneByKey[s.zone];
  const enteredTime = durationParts(e.time);

  $("detailTitle").textContent = `Week ${week} · ${s.dayLabel}`;
  $("detailBody").innerHTML = `
    <div class="detail-hero zone-${s.zone}">
      <span class="detail-kind">${s.kind} · ${nlNum(s[UNIT])} ${UNIT_LABEL}</span>
      <h2>${s.title}</h2>
      <p class="detail-goal">${s.goal}</p>
      <span class="detail-zone">${z.name} · ${z.info}</span>
    </div>

    <div class="coach-bubble">
      <div class="coach-ava">
        <img src="${CONFIG.coachPhoto}" alt="${CONFIG.coachName}" onerror="this.style.display='none'">
        <span>${COACH_INITIAL}</span>
      </div>
      <div class="coach-text">
        <strong>${CONFIG.coachName} <span class="coach-handle">${CONFIG.coachHandle}</span></strong>
        <p>${coachLine(s.zone)}</p>
      </div>
    </div>

    <section class="detail-block why">
      <h4>${isRaceDetail ? (w.finish ? "Waarom deze mijlpaal" : "Waarom deze wedstrijd") : "Waarom deze training"}</h4>
      <p>${s.why || WHY[s.zone] || ""}</p>
    </section>

    <section class="detail-block">
      <h4>Opbouw</h4>
      <ol class="block-list">${s.blocks.map((b) => `<li>${b}</li>`).join("")}</ol>
    </section>

    <section class="detail-block">
      <h4>${isRaceDetail ? (w.finish ? "Invullen na je mijlpaal" : "Invullen na de wedstrijd") : "Invullen na de training"}</h4>
      <div class="form-grid">
        <label>Afstand (km)
          <input id="fDistance" type="text" inputmode="decimal" placeholder="bv. 6,2" value="${escapeHtml(e.distance ?? "")}">
        </label>
        <label>Tijd
          <span class="duration-input">
            <input id="fTimeMinutes" type="number" inputmode="numeric" min="0" max="999" placeholder="36" value="${enteredTime.minutes || ""}" aria-label="Minuten">
            <span>min</span>
            <input id="fTimeSeconds" type="number" inputmode="numeric" min="0" max="59" placeholder="30" value="${enteredTime.seconds || ""}" aria-label="Seconden">
            <span>sec</span>
          </span>
        </label>
        <label class="full">Gemiddeld tempo
          <output id="fPace" class="pace-out">${fmtPace(paceSeconds(e.distance, e.time)) || "–"}</output>
        </label>
        <label>Hartslag (bpm)
          <input id="fHr" type="number" inputmode="numeric" placeholder="bv. 152" value="${escapeHtml(e.hr ?? "")}">
        </label>
        <label>Gevoel / zwaarte
          <select id="fFeel">
            ${["", "1 · heel licht", "2 · licht", "3 · prima", "4 · pittig", "5 · zwaar"]
              .map((o) => `<option value="${o}" ${String(e.feel ?? "") === o ? "selected" : ""}>${o || "Kies…"}</option>`).join("")}
          </select>
        </label>
        <label class="full">Notitie
          <textarea id="fNote" rows="2" placeholder="Hoe ging het?">${escapeHtml(e.note ?? "")}</textarea>
        </label>
      </div>
    </section>

    <div class="detail-actions">
      <button id="toggleDone" class="btn-primary ${e.done ? "is-done" : ""}">${e.done ? "✓ Gedaan" : "Markeer als gedaan"}</button>
      <button id="saveSession" class="btn-ghost">Opslaan</button>
    </div>`;

  const readTime = () => {
    if (!$("fTimeMinutes").value && !$("fTimeSeconds").value) return "";
    return durationValue($("fTimeMinutes").value, $("fTimeSeconds").value);
  };
  const recalc = () => ($("fPace").textContent = fmtPace(paceSeconds($("fDistance").value, readTime())) || "–");
  $("fDistance").addEventListener("input", recalc);
  $("fTimeMinutes").addEventListener("input", recalc);
  $("fTimeSeconds").addEventListener("input", () => {
    if (+$("fTimeSeconds").value > 59) $("fTimeSeconds").value = "59";
    recalc();
  });

  const collect = () => ({
    ...log[id],
    distance: $("fDistance").value.trim(),
    time: readTime(),
    hr: $("fHr").value.trim(),
    feel: $("fFeel").value,
    note: $("fNote").value.trim(),
  });

  $("saveSession").addEventListener("click", () => {
    log[id] = collect(); saveLog();
    toast("Opgeslagen 💾");
    closeDetail();
  });
  $("toggleDone").addEventListener("click", () => {
    const cur = collect();
    cur.done = !cur.done;
    log[id] = cur; saveLog();
    if (cur.done) {
      celebrate();
      toast(!isRaceDetail
        ? DONE[Math.floor(Math.random() * DONE.length)]
        : "🎉 25 km gelopen! Wat een strijder, Cindy!");
    }
    closeDetail();
  });

  showView("detail");
}

function closeDetail() { renderAll(); showView("list"); }

function showView(name) {
  const list = $("listView"), detail = $("detailView"), back = $("backButton");
  if (name === "detail") {
    list.classList.add("hidden");
    detail.classList.remove("hidden");
    requestAnimationFrame(() => detail.classList.add("is-in"));
    back.classList.remove("hidden");
    window.scrollTo(0, 0);
  } else {
    detail.classList.remove("is-in");
    back.classList.add("hidden");
    setTimeout(() => {
      detail.classList.add("hidden");
      list.classList.remove("hidden");
      window.scrollTo(0, 0);
    }, 280);
  }
}

/* ----- Invliegende beelden -------------------------------------------- */
let io, initialRevealDone = false;
function observeReveals() {
  // Na de eerste keer: nieuw getekende blokken meteen tonen (geen her-animatie bij navigeren)
  if (initialRevealDone) {
    document.querySelectorAll(".reveal:not(.in)").forEach((el) => el.classList.add("in"));
    return;
  }
  io = io || new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el));
}

/* ----- Toast ----------------------------------------------------------- */
let toastT;
function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ----- Confetti --------------------------------------------------------- */
function celebrate() {
  const cv = $("confetti");
  const ctx = cv.getContext("2d");
  cv.width = innerWidth; cv.height = innerHeight;
  const cs = getComputedStyle(document.documentElement);
  const colors = ["--volt", "--flame", "--pastel-blue", "--violet"]
    .map((v) => cs.getPropertyValue(v).trim()).filter(Boolean).concat("#ffffff");
  const parts = Array.from({ length: 140 }, () => ({
    x: innerWidth / 2, y: innerHeight / 3,
    vx: (Math.random() - 0.5) * 14, vy: Math.random() * -16 - 4,
    s: Math.random() * 7 + 4, c: colors[(Math.random() * colors.length) | 0],
    r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.4,
  }));
  let frame = 0;
  (function loop() {
    frame++;
    ctx.clearRect(0, 0, cv.width, cv.height);
    parts.forEach((p) => {
      p.vy += 0.45; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
      ctx.restore();
    });
    if (frame < 120) requestAnimationFrame(loop);
    else ctx.clearRect(0, 0, cv.width, cv.height);
  })();
}

/* ================================================================== *
 *  Init
 * ================================================================== */
/* Branding uit CONFIG zetten (zodat templaten makkelijk is) */
document.title = `${CONFIG.appName}, ${CONFIG.coachHandle}`;
if ($("appName")) $("appName").textContent = CONFIG.appName;
if ($("brandHandle")) $("brandHandle").textContent = CONFIG.coachHandle;
if ($("footCredit")) {
  $("footCredit").innerHTML =
    `<span class="catch">${CONFIG.catchphrase}</span>` +
    `Coaching door ${CONFIG.coachName} · TikTok <strong>${CONFIG.coachHandle}</strong> ${CONFIG.footEmoji || "🏃\u200d♀️"}`;
}

function setPlanningForm(open) {
  const form = $("planningForm");
  const toggle = $("togglePlanningForm");
  form.classList.toggle("hidden", !open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.textContent = open ? "× Sluiten" : "＋ Toevoegen";
  if (open && !$("planStart").value) $("planStart").value = isoDate(new Date());
}

$("togglePlanningForm").addEventListener("click", () => {
  setPlanningForm($("planningForm").classList.contains("hidden"));
});
$("cancelPlanning").addEventListener("click", () => setPlanningForm(false));
$("planningForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const start = $("planStart").value;
  const end = $("planEnd").value || start;
  if (end < start) {
    toast("De einddatum ligt vóór de startdatum");
    return;
  }
  const entry = {
    id: `plan-${Date.now()}`,
    type: $("planType").value,
    title: $("planTitle").value.trim(),
    start,
    end,
    note: $("planNote").value.trim(),
  };
  log.__planning = [...planningEntries(), entry];
  saveLog();
  $("planningForm").reset();
  setPlanningForm(false);
  renderAll();
  toast("Toegevoegd aan je schema 🗓️");
});

$("backButton").addEventListener("click", closeDetail);
$("resetButton").addEventListener("click", () => {
  if (confirm("Alle ingevulde voortgang wissen?")) { log = {}; saveLog(); renderAll(); toast("Voortgang gewist"); }
});

/* ----- Back-up: exporteren / importeren ------------------------------- */
function downloadJSON(filename, obj) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" }));
  a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function downloadText(filename, text, type) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function icsEscape(value) {
  return String(value || "")
    .replaceAll("\\", "\\\\")
    .replaceAll(/\r?\n/g, "\\n")
    .replaceAll(",", "\\,")
    .replaceAll(";", "\\;");
}

function icsDay(value) {
  const date = typeof value === "string" ? new Date(`${value}T12:00:00`) : value;
  return isoDate(date).replaceAll("-", "");
}

function addDays(value, amount) {
  const date = typeof value === "string" ? new Date(`${value}T12:00:00`) : new Date(value);
  date.setDate(date.getDate() + amount);
  return date;
}

function calendarFile() {
  const stamp = new Date().toISOString().replaceAll(/[-:]/g, "").replace(/\.\d{3}/, "");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "PRODID:-//bartlopen//Run Coach//NL",
    `X-WR-CALNAME:${icsEscape(CONFIG.appName)} · ${icsEscape(RUNNER)}`,
  ];
  flatSessions.forEach((session) => {
    const date = sessionDate(session.week, session.day);
    const z = zoneByKey[session.zone];
    lines.push(
      "BEGIN:VEVENT",
      `UID:${sid(session.week, session.day)}-${icsDay(date)}@bartlopen.nl`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${icsDay(date)}`,
      `DTEND;VALUE=DATE:${icsDay(addDays(date, 1))}`,
      `SUMMARY:${icsEscape(`${CONFIG.footEmoji || "🏃\u200d♀️"} ${session.title}`)}`,
      `DESCRIPTION:${icsEscape(`${nlNum(session[UNIT])} ${UNIT_LABEL} · ${z.name}\n${session.goal}\n\n${session.blocks.join("\n")}`)}`,
      "TRANSP:TRANSPARENT",
      "END:VEVENT",
    );
  });
  planningEntries().forEach((entry) => {
    const meta = PLANNING_META[entry.type] || PLANNING_META.rest;
    lines.push(
      "BEGIN:VEVENT",
      `UID:${icsEscape(entry.id)}@bartlopen.nl`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${icsDay(entry.start)}`,
      `DTEND;VALUE=DATE:${icsDay(addDays(entry.end || entry.start, 1))}`,
      `SUMMARY:${icsEscape(`${meta.icon} ${entry.title}`)}`,
      `DESCRIPTION:${icsEscape(`${entry.note ? `${entry.note}\n\n` : ""}Coachadvies: ${meta.advice}`)}`,
      "TRANSP:TRANSPARENT",
      "END:VEVENT",
    );
  });
  lines.push("END:VCALENDAR");
  return `${lines.join("\r\n")}\r\n`;
}
$("exportBtn").addEventListener("click", () => {
  downloadJSON(`${CONFIG.appName.replace(/\s+/g, "-")}-voortgang.json`, {
    app: "bartlopen-runcoach", storeKey: STORE_KEY, runner: RUNNER,
    exportedAt: new Date().toISOString(), log,
  });
  toast("Back-up opgeslagen ⬇︎");
});
$("importBtn").addEventListener("click", () => $("importFile").click());
$("importFile").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      const incoming = data && data.log ? data.log : data;
      if (!incoming || typeof incoming !== "object") throw new Error("ongeldig");
      log = { ...log, ...incoming };
      saveLog(); renderAll();
      toast("Back-up geladen ⬆︎, welkom terug!");
    } catch {
      toast("Kon dit bestand niet lezen");
    }
    e.target.value = "";
  };
  reader.readAsText(file);
});

$("calendarBtn").addEventListener("click", () => {
  downloadText(`${CONFIG.appName.replace(/\s+/g, "-")}-schema.ics`, calendarFile(), "text/calendar;charset=utf-8");
  toast("Agenda-bestand staat klaar 🗓️");
});

$("pdfBtn").addEventListener("click", () => {
  document.body.classList.add("print-schema");
  const cleanup = () => document.body.classList.remove("print-schema");
  window.addEventListener("afterprint", cleanup, { once: true });
  window.print();
  setTimeout(cleanup, 1500);
});

/* Alles tekenen */
renderAll();
renderLaatstOpgeslagen();
herstelUitBackup();
/* Na de intro-animatie geen her-fade meer; failsafe die alles zeker toont */
setTimeout(() => { initialRevealDone = true; }, 900);
setTimeout(() => document.querySelectorAll(".reveal:not(.in)").forEach((el) => el.classList.add("in")), 1600);

/* Intro-splash netjes weg laten faden (tikken slaat 'm over) */
(function () {
  const splash = $("splash");
  if (!splash) return;
  const hide = () => splash.classList.add("gone");
  setTimeout(hide, 1100);
  splash.addEventListener("click", hide);
  setTimeout(() => splash.remove(), 1700);
})();

/* Service worker voor offline gebruik (alleen op http/https, niet via file://) */
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  /* Auto-verversen: nieuwe versie neemt over -> pagina herlaadt zichzelf een keer */
  const hadController = !!navigator.serviceWorker.controller;
  let autoReloaded = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!hadController || autoReloaded) return;
    autoReloaded = true;
    window.location.reload();
  });
  navigator.serviceWorker.register("sw.js").catch(() => {});
}

/* Vraag de browser om je voortgang echt te bewaren. Zonder dit mag een
   browser opgeslagen gegevens opruimen als er ruimte nodig is, en dan ben
   je je afgevinkte trainingen kwijt. */
if (navigator.storage && navigator.storage.persist) {
  navigator.storage.persisted()
    .then((al) => (al ? true : navigator.storage.persist()))
    .catch(() => {});
}
