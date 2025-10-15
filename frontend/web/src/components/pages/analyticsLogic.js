// ----- Colors/thresholds match your original -----
import {getAllAnswersCount, getLearnedRulesCount, getOverallAccuracy} from "../../services/dataService.js";

export const MASTERED_ACC = 0.85;
export const WEAK_ACC = 0.6;

export const SAMPLE_RULES = [
    { id:51, name:'Present Perfect', level:'B1', attempts:28, correct:22, lastSeen:'2025-10-09T18:30:00Z' },
    { id:1,  name:'To be (am/is/are)', level:'A1', attempts:40, correct:38, lastSeen:'2025-10-10T16:11:00Z' },
    { id:26, name:'Past Simple (regular/irregular)', level:'A2', attempts:31, correct:21, lastSeen:'2025-10-08T09:02:00Z' },
    { id:63, name:'Passive Voice (all tenses)', level:'B1', attempts:14, correct:7, lastSeen:'2025-10-07T21:02:00Z' },
    { id:58, name:'2nd Conditional', level:'B1', attempts:12, correct:5, lastSeen:'2025-10-05T08:12:00Z' },
    { id:59, name:'3rd Conditional', level:'B1', attempts:9,  correct:3, lastSeen:'2025-10-03T10:11:00Z' },
    { id:18, name:'Be from (nationality)', level:'A1', attempts:7,  correct:7, lastSeen:'2025-10-09T07:45:00Z' },
    { id:37, name:'Comparatives', level:'A2', attempts:15, correct:11,lastSeen:'2025-10-06T12:00:00Z' },
    { id:81, name:'Inversion after negative adverbials', level:'B2', attempts:6, correct:1,lastSeen:'2025-10-04T22:10:00Z' },
    { id:67, name:'Too / enough / so / such', level:'B1', attempts:10, correct:6,lastSeen:'2025-10-09T12:00:00Z' },
    { id:32, name:'Be going to vs will', level:'A2', attempts:16, correct:9,lastSeen:'2025-10-10T15:10:00Z' }
];

const TRANSLATE_UA = new Map(Object.entries({
    enough: 'досить',
    although: 'хоча',
    through: 'через / крізь',
    comparative: 'ступінь порівняння',
    possessive: 'присвійний',
    whether: 'чи',
    scarcely: 'ледве',
    apple: 'яблуко'
}));

export function seedWordsMap() {
    const words = new Map();
    [
        {word:'enough',      history:[0,1,1,1],     lastSeen:'2025-10-10T10:00:00Z'},
        {word:'although',    history:[0,0,1,1,1],   lastSeen:'2025-10-09T12:30:00Z'},
        {word:'through',     history:[0,0,0,1],     lastSeen:'2025-10-08T08:00:00Z'},
        {word:'comparative', history:[0,1,0,1,1],   lastSeen:'2025-10-07T19:20:00Z'},
        {word:'possessive',  history:[0,1,1],       lastSeen:'2025-10-06T09:05:00Z'},
        {word:'whether',     history:[0,0,1],       lastSeen:'2025-10-05T18:40:00Z'},
        {word:'scarcely',    history:[0,0,0],       lastSeen:'2025-10-04T21:00:00Z'},
        {word:'apple',       history:[1,1],         lastSeen:'2025-10-10T09:00:00Z'}
    ].forEach(x=>{
        words.set(x.word, {
            word: x.word,
            attempts: x.history.length,
            correct: x.history.reduce((s,b)=>s+(b?1:0),0),
            hadError: x.history.some(v=>v===0),
            lastSeen: x.lastSeen,
            last3: x.history.slice(-3),
            ua: TRANSLATE_UA.get(x.word) || "—"
        });
    });
    return words;
}

// ---------- utils ----------
export const pct = (num, den) => (den ? Math.round((num/den)*100) : 0);
export const acc = (nCorrect, nAll) => (nAll ? (nCorrect/nAll) : 0);

export const fmtDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'}) : "—";

export const fmtDateEnShort = (iso) =>
    iso ? new Date(iso).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'}) : "—";

export const daysSince = (iso) => {
    if (!iso) return 999;
    const d = new Date(iso).getTime();
    return Math.max(0, Math.round((Date.now() - d) / (1000*60*60*24)));
};

// ---------- rules ----------
export const statusOf = (r) => {
    if (r.status === 'learned') return { label: "Засвоєно", cls: "ok" };
    if (r.status === 'needs practice')       return { label: "Потребує практики", cls: "bad" };
    return { label: "У процесі", cls: "warn" };
};

export function computeKPIs(rows) {
    const totalAttempts = getAllAnswersCount();
    const accuracy = getOverallAccuracy();
    const mastered = getLearnedRulesCount();
    return { accuracy, totalAttempts, mastered };
}

// ---------- vocab ----------
function isWordLearned(w){
    if(!w.hadError) return false;
    const last3ok = (w.last3 && w.last3.length===3 && w.last3.every(v=>v===1));
    const goodAcc = (w.attempts >= 2 && acc(w.correct, w.attempts) >= 0.85);
    return last3ok || goodAcc;
}

export function computeVocab(wordsMap){
    const items = Array.from(wordsMap.values()).map(w=>({
        ...w,
        accuracy: acc(w.correct, w.attempts),
        learned: isWordLearned(w),
        lastWrong: (w.last3 && w.last3.length>0) ? w.last3[w.last3.length-1]===0 : false
    }));
    const kpiLearned = items.filter(w=>w.learned).length;
    return { items, kpiLearned };
}

// ---------- smart queue ----------
function bucketOf(w){
    const accuracy = w.accuracy ?? acc(w.correct, w.attempts);
    if (accuracy < 0.6 && w.attempts>=2) return 'risk';
    if ((w.last3 && w.last3.length>0 && w.last3[w.last3.length-1]===0)) return 'risk';
    if (w.attempts<=1) return 'new';
    if (!w.learned && w.attempts>=2 && accuracy<0.85) return 'learn';
    return 'other';
}
function priorityOf(w){
    const accuracy = w.accuracy ?? acc(w.correct, w.attempts);
    const days = Math.max(0, daysSince(w.lastSeen));
    const lastWrongBonus = (w.last3 && w.last3[w.last3.length-1]===0) ? 0.5 : 0;
    const base = bucketOf(w)==='risk' ? 3 : bucketOf(w)==='learn' ? 2 : bucketOf(w)==='new' ? 1.5 : 1;
    return base * ((1 - accuracy) + 0.15) * (1 + days/7) + lastWrongBonus;
}
export function getSmartQueue(wordsMap, n=10){
    const all = Array.from(wordsMap.values()).map(w => ({ ...w }));
    all.forEach(w => w.accuracy = acc(w.correct, w.attempts));
    const candidates = all.filter(w=> !(acc(w.correct,w.attempts)>=0.9 && w.attempts>=3));
    candidates.forEach(w => w._prio = priorityOf(w));

    const pick = (arr, tag, lim) =>
        arr.filter(w => bucketOf(w) === tag)
            .sort((a,b)=> b._prio - a._prio)
            .slice(0, lim)
            .map(w => ({ ...w, reason: tag }));

    const picked = [
        ...pick(candidates, "risk", 4),
        ...pick(candidates, "learn", 3),
        ...pick(candidates, "new", 3),
    ];

    const rest = candidates
        .filter(w => !picked.find(x => x.word === w.word))
        .sort((a,b) => b._prio - a._prio)
        .map(w => ({ ...w, reason: bucketOf(w) }));

    const final = [...picked, ...rest].slice(0, n);
    final.forEach(w => { w.ua = TRANSLATE_UA.get(w.word) || "—"; });
    return final;
}
