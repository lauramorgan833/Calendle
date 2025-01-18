const { MongoClient } = require("mongodb");

const handler = async (event) => {
    console.log("get_movies function called");
    try {
        console.log("Database: ", process.env.MONGODB_DATABASE);
        console.log("Collection: ", process.env.MONGODB_COLLECTION);
        console.log("URI: ", process.env.MONGODB_URI);
        const mongoClient = new MongoClient(process.env.MONGODB_URI);
        console.log("Connecting to MongoDB");
        
        const clientPromise = mongoClient.connect();
        const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
        const collection = database.collection(process.env.MONGODB_COLLECTION);
        const results = await collection.find({}).limit(10).toArray();
        return {
            statusCode: 200,
            body: JSON.stringify(results),
        }
    } catch (error) {
        console.log("Error: ", error.toString());
        return { statusCode: 500, body: error.toString() }
    }
}

module.exports = { handler }