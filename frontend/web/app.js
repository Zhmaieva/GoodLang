// ——— API ———
const API_BASE = 'http://localhost:3000/translations/';

const LEVEL_TO_DIFFICULTY = {
    beginner: ['A1','A2'],
    intermediate: ['B1','B2'],
    advanced: ['C1','C2'],
};

// ——— Стан ———
let state = {
    level: 'beginner',
    difficulty: randomDifficulty('beginner'),
    textToTranslate: '',
    rule: null,
    mode: 'check', // 'check' | 'next'
    loading: false
};

// ——— DOM ———
const btn = document.getElementById('checkBtn');
const taskBox = document.getElementById('uaTask');
const feedbackBox = document.getElementById('feedbackBox');
const answerBox = document.getElementById('answer');
const levelButtons = document.querySelectorAll('.level-btn');
const correctBox = document.getElementById('correctBox');
const correctText = document.getElementById('correctText');

// ——— Helpers ———
function randomDifficulty(level) {
    const pool = LEVEL_TO_DIFFICULTY[level] || ['A1','A2'];
    return pool[Math.floor(Math.random() * pool.length)];
}
function setHint(html) { feedbackBox.innerHTML = html; }

function setControlsDisabled(disabled) {
    state.loading = disabled;
    btn.disabled = disabled;
    answerBox.disabled = disabled || state.mode === 'next'; // після перевірки інпут залишається заблокованим до "Наступне речення"
    levelButtons.forEach(b => b.disabled = disabled);
}

function showCorrect(answer) {
    if (answer && String(answer).trim()) {
        correctText.textContent = answer;
        correctBox.hidden = false;
    } else {
        correctText.textContent = '';
        correctBox.hidden = true;
    }
}

function resetToLoadingPlaceholders() {
    taskBox.textContent = 'Завантаження завдання…';
    setHint('Завантаження нового завдання…');
    showCorrect('');
}

async function callAPI(params) {
    const qs = new URLSearchParams(params);
    const url = API_BASE + '?' + qs.toString();
    const res = await fetch(url);
    if (!res.ok) throw new Error('Server error: ' + res.status);
    return res.json();
}

// ——— Нове завдання ———
async function loadNewTask() {
    try {
        setControlsDisabled(true);
        resetToLoadingPlaceholders();
        answerBox.value = '';

        const data = await callAPI({
            level: state.difficulty
        });

        state.textToTranslate = data.textToTranslate || '';
        state.rule = data.rule || null;

        taskBox.textContent = state.textToTranslate || '—';
        setHint('Порада: перекладіть і натисніть «Перевірити»');
        showCorrect('');
        state.mode = 'check';
        setControlsDisabled(false);
        btn.textContent = 'Перевірити';
        answerBox.focus();
    } catch (e) {
        console.error(e);
        setHint('<span style="color: var(--accent-dark); font-weight: 700;">❌ Сталася помилка при отриманні завдання.</span> Спробуйте ще раз.');
        setControlsDisabled(false);
    }
}

// ——— Перевірка ———
async function evaluateAnswer() {
    const userAns = answerBox.value.trim();
    if (!userAns) {
        setHint('Введіть переклад перед перевіркою.');
        return;
    }

    try {
        setControlsDisabled(true); // блокуємо все на час перевірки

        const data = await callAPI({
            level: state.difficulty,
            textToTranslate: state.textToTranslate,
            translation: userAns,
            rule: state.rule
        });

        if (data.isAnswerCorrect) {
            setHint('<span style="color: var(--green); font-weight: 700;">✔ Правильно!</span> ');
            showCorrect('');
        } else {
            const tip = data.tipIfWrong ? ' ' + data.tipIfWrong : '';
            setHint('<span style="color: var(--accent-dark); font-weight: 700;">❌ Не зовсім.</span>' + tip);
            showCorrect(data.correctAnswer || '');
        }

        state.mode = 'next';
        btn.textContent = 'Наступне речення';
        // після відповіді розблокуємо кнопки та рівні, але інпут залишаємо disabled до "Наступне речення"
        setControlsDisabled(false);
    } catch (e) {
        console.error(e);
        setHint('<span style="color: var(--accent-dark); font-weight: 700;">❌ Помилка перевірки.</span> Перевірте підключення до сервера.');
        setControlsDisabled(false);
    }
}

// ——— Головна кнопка ———
async function onMainButtonClick() {
    if (state.mode === 'check') {
        await evaluateAnswer();
    } else {
        // NEXT → оновлюємо складність у межах рівня, блоки у стан завантаження
        state.difficulty = randomDifficulty(state.level);
        resetToLoadingPlaceholders();
        await loadNewTask();
    }
}

// ——— Перемикач рівня ———
function setLevel(level) {
    if (state.loading) return; // не дозволяємо змінювати рівень під час запросу

    levelButtons.forEach(b => {
        const isSelected = (b.dataset.level === level);
        b.classList.toggle('selected', isSelected);
        b.setAttribute('aria-pressed', String(isSelected));
    });

    state.level = level;
    state.difficulty = randomDifficulty(level);
    state.textToTranslate = '';
    state.rule = null;
    state.mode = 'check';
    resetToLoadingPlaceholders();
    loadNewTask();
}

// ——— Події ———
btn.addEventListener('click', onMainButtonClick);

answerBox.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') onMainButtonClick();
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onMainButtonClick();
    }
});

levelButtons.forEach(b => {
    b.addEventListener('click', () => setLevel(b.dataset.level));
});

// ——— Ініціалізація ———
(async function init(){
    resetToLoadingPlaceholders();
    await loadNewTask();
})();