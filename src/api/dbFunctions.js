export const db_post = async (uri, body) => {
    try {
        const response = await fetch(uri, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        let results = await response.json();
        if (!results) {
            throw new Error("Response was undefined");
        }
        return results;
    } catch (error) {
        console.error("Fetch error: ", error);
    }
}

export const upsert_solution = async (date, board) => {
    
    const uri = "/.netlify/functions/upsert_solution";
    const body = { date: date, board: board }

    return db_post(uri, body)
        .then((results) => {
            console.log("Results: ", results);
            return results;
        })
        .catch((error) => {
            console.error("Error: ", error);
        });
}