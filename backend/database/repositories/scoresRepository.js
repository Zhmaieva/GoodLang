import { connectDB } from "../mongo.js";

export async function upsertAnswers(userId, deviceId, answers, updatedOn) {
    if (!answers?.length) return;
    const db = await connectDB();
    const bulk = db.collection("good_lang_scores").initializeUnorderedBulkOp();

    for (const a of answers) {
        // expect client to send `id`. If not, ignore this record (or generate server id)
        if (!a.id) continue;

        // ensure date field gets stored as proper Date
        const createdDate = a.date ? new Date(a.date) : updatedOn;

        bulk.find({ userId, id: a.id })
            .upsert()
            .updateOne({
                $set: {
                    userId,
                    id: a.id,
                    rule: a.rule,
                    level: a.level ?? null,
                    score: a.score,
                    date: createdDate,
                    deviceId: a.deviceId ?? deviceId,
                    updatedAt: updatedOn, // server authoritative
                },
                $setOnInsert: {
                    createdAt: updatedOn
                }
            });
    }

    if (bulk.length) {
        await bulk.execute();
    }
}

export async function getAnswersSince(userId, since) {
    const db = await connectDB();
    const sinceDate = new Date(since || 0);

    const docs = await db.collection("good_lang_scores")
        .find({
            userId,
            updatedAt: { $gt: sinceDate }
        })
        .toArray();

    return docs.map(d => ({
        id: d.id,
        rule: d.rule,
        level: d.level,
        score: d.score,
        date: d.date instanceof Date ? d.date.toISOString() : d.date,
        deviceId: d.deviceId,
        updatedAt: d.updatedAt instanceof Date ? d.updatedAt.toISOString() : d.updatedAt,
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
