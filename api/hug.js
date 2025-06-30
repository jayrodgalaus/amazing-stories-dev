export default async function handler(req, res) {
    const prompt = req.body.prompt;
    try{  
        fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "mistralai/mistral-7b-instruct:free",
                messages: [
                {
                    role: "user",
                    content: `${prompt}`
                }
                ]
            })
            })
            .then(res => res.json())
            .then(data => console.log(data.choices[0].message.content))
            .catch(console.error);

    }catch(error){
        res.status(500).json({ error: "Mistral AI request failed", details: error.message });
    }
    
}
