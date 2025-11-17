import { connectDB } from "../mongo.js";

export async function insertAnswers(userId, deviceId, answers) {
    if (!answers?.length) return;

    const db = await connectDB();

    for (const a of answers) {
        await db.collection("good_lang_scores").updateOne(
            {
                userId,
                rule: a.rule,
                score: a.score,
                date: a.date,
                deviceId: a.deviceId,
            },
            {
                $setOnInsert: {
                    userId,
                    rule: a.rule,
                    level: a.level,
                    score: a.score,
                    date: new Date(a.date),
                    deviceId: a.deviceId,
                    updatedAt: new Date(),
                }
            },
            { upsert: true }
        );
    }
}

export async function getAnswersSince(userId, since) {
    const db = await connectDB();

    const docs = await db.collection("good_lang_scores")
        .find({
            userId,
            updatedAt: { $gt: new Date(since) }
        })
        .toArray();

    return docs.map(d => ({
        rule: d.rule,
        level: d.level,
        score: d.score,
        date: d.date.toISOString(),
        deviceId: d.deviceId
    }));
}

export async function saveSeedState(userId, seedState) {
    const db = await connectDB();

    await db.collection("good_lang_state").updateOne(
        { userId },
        {
            $set: {
                seed: seedState.seed,
                skip: seedState.skip,
                updatedAt: new Date(seedState.updatedAt)
            }
        },
        { upsert: true }
    );
}

export async function getSeedState(userId) {
    const db = await connectDB();

    const doc = await db.collection("good_lang_state").findOne({ userId });
    if (!doc) return null;
    return {
        seed: doc.seed,
        skip: doc.skip,
        updatedAt: doc.updatedAt.toISOString()
    };
}
