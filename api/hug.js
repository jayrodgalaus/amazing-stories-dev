export default async function handler(req, res) {
    const prompt = req.body.prompt;
    try{  
        const response = await fetch("https://api-inference.huggingface.co/models/openai-community/gpt2", {
            method: "POST",
            headers: {
            "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputs: prompt })
        });
        console.log(process.env.HUGGINGFACE_API_KEY)
        const data = await response.json();
        res.status(200).json(data);
    }catch(error){
        res.status(500).json({ error: "Hugging Face request failed", details: error.message });
    }
    
}
