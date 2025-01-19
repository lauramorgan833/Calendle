import { MongoClient } from "mongodb";

const mongoClient = new MongoClient(process.env.MONGODB_URI);
const clientPromise = mongoClient.connect();

export const handler = async (event, context) => {
    console.log("upsert_solution function called");
    const body = JSON.parse(event.body); // Parse the request body
    const { date, board } = body; // Destructure the body parameters
    console.log("Date: ", date);
    console.log("Board: ", board);

    try {
        console.log("Connecting to MongoDB");
        
        console.log("Database: ", process.env.MONGODB_DATABASE);
        console.log("Collection: ", process.env.MONGODB_COLLECTION_SOLUTIONS);

        const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
        const collection = database.collection(process.env.MONGODB_COLLECTION_SOLUTIONS);

        let currentSolution = '';

        try {
            console.log("Checking for existing solution");
            currentSolution = await collection.findOne({date: date.toString()});
        } catch (error) {
            console.log("Error: ", error.toString());
        }
        console.log("Current Solution: ", currentSolution);
        let result = {};
        if (currentSolution) {
            console.log("Updating existing solution");
            result = await collection.updateOne(
                { date: date.toString() },
                { $push: { solutions: board } }
            );
        } else {
            console.log("Inserting new solution");
            result = await collection.insertOne({date: date.toString(), solutions: [board]});
        }

        return {
            statusCode: 200,
            body: JSON.stringify(result),
        }
    } catch (error) {
        console.log("Error: ", error.toString());
        return { statusCode: 500, body: error.toString() }
    }
}