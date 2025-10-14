const express = require("express");
const {randomRule, evaluateAndCoach} = require("./сore");

const args = process.argv;
const portIndex = args.indexOf('-p');
const port = (portIndex !== -1 && args[portIndex + 1]) ? parseInt(args[portIndex + 1], 10) : 3000;

const app = express();

// Manual CORS header
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // allow any origin
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204); // No Content
    }
    //setTimeout(next, 6000);
    next();
});

app.use(express.json());

app.get('/health', async (req, res, next) => {
    try {
        return res.json({
            "message": "healthy"
        });
    } catch (e) {
        next(e);
    }
});

app.get('/translations/', async (req, res, next) => {
   try {
       const { level, rule, translation, textToTranslate, } = req.query;

       const selectedRule = rule ?? randomRule(level);
       const result = await evaluateAndCoach({
           rule: selectedRule,
           targetLanguage: "Ukrainian",
           userEnglish: translation ?? "",
           textToTranslate: textToTranslate ?? "",
           difficulty: level ?? "A2"
       });
       const newTextToTranslate = result.sample_in_target_language || result.next_target_sentence || "";

       return res.json({
           rule: selectedRule,
           textToTranslate: newTextToTranslate,
           evaluationSkipped: !translation,
           isAnswerCorrect: result.answer_is_correct,
           correctAnswer: result.correct_answer,
           tipIfWrong: result.tip_if_wrong,
           violatedRules: result.violated_rules
       });
   }  catch (e) {
       next(e);
   }
});

// Catch-all handler for undefined routes
app.use(async (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global error handler (Catches all unhandled exceptions)
app.use(async (err, req, res, next) => {
    console.error(err.stack);  // Log the error stack for debugging (optional)
    res.status(500).json({ message: 'Something went wrong, please try again later.' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});