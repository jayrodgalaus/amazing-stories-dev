export default async function handler(req, res) {
  const prompt = req.body.prompt;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();
    console.log(data.choices?.[0]?.message?.content || "No message returned");

    // Optional: send a dummy response to avoid timeout
    res.status(200).end();
  } catch (error) {
    console.error("Fetch failed:", error);
    res.status(500).json({ error: "Mistral AI request failed", details: error.message });
  }
}
