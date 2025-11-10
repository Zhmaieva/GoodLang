import express from "express";
import {randomRule, evaluateAndCoach, shuffleBySeed} from "./сore.js";
import {ALL_RULES_SAMPLES} from "./allRulesSamples.js";
import {LEVEL_RULES} from "./rules.js";

const args = process.argv;
const portIndex = args.indexOf('-p');
const port = (portIndex !== -1 && args[portIndex + 1]) ? parseInt(args[portIndex + 1], 10) : 3000;

const app = express();

const locale = 'ua';

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
       const { level, rules, translation, textToTranslate, skip, seed } = req.query;

       if (!textToTranslate) {
           const selectedRule = Array.isArray(rules) && rules.length > 0 ? rules[0] : randomRule(level ?? 'A1');

           const samples = shuffleBySeed(ALL_RULES_SAMPLES[selectedRule], seed ?? 1);
           const skipNumber = Math.floor((skip ?? '0') % samples.length);
           const sample = samples[skipNumber];

           return res.json({
               rules: sample.rules,
               textToTranslate: sample[locale],
               isAnswerCorrect: false,
               correctAnswer: "",
               tipIfWrong: "",
               score: 0,
               skip: skipNumber + 1
           });
       }

       const result = await evaluateAndCoach({
           rules: Array.isArray(rules) ? rules : [rules],
           targetLanguage: "Ukrainian",
           userEnglish: translation ?? "",
           textToTranslate: textToTranslate ?? ""
       });

       let newTextToTranslate = "";
       let newRules = rules;
       let newSkip = Number.parseInt(skip) + 1;

       const scores = result.scores;
       for (let i = 0; i < scores.length; i++) {
           if (scores[i] < 1) {
               const failedRule = rules[i];
               //newTextToTranslate = ALL_RULES_SAMPLES[failedRule][0];//todo: find selectedRule, shuffle by seed and skip;
               const newSample = shuffleBySeed(ALL_RULES_SAMPLES['THERE_IS_ARE'], seed ?? 1)[newSkip];
               newRules = newSample.rules;
               newTextToTranslate = newSample[locale];//todo: find selectedRule, shuffle by seed and skip;
               break;
           }
       }

       return res.json({
           rules: newRules,
           textToTranslate: newTextToTranslate,
           isAnswerCorrect: result.answer_is_correct,
           correctAnswer: result.correct_answer,
           tipIfWrong: result.tip_if_wrong,
           scores: scores,
           skip: newSkip
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