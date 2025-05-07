// This API route handles search requests to the Pexels API
export default async function search(req, res) {
    try {
        const query = req.query.query;
        const response = await fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=40`, {
            method: "GET",
            headers: {
                Authorization: process.env.PEXELS_API_KEY,
            },
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: `Failed to fetch data from Pexels API: ${response.statusText}` });
        }

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}