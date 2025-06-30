async function callMyAI(prompt) {
    const response = await fetch("/api/hug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        return;
    }

    const data = await response.json();
    console.log("AI response:", data.message);
}

$(document).ready(function(){
    $(document).
    one('mouseenter', '.mistral-button',function(){
        const greetings = [
            "Fancy seeing you here!",
            "Well hello there!",
            "Look who it is!",
            "Hey, glad you dropped by!",
            "Ah, just the person I was hoping for!",
            "Hey hey! Ready to dive in?",
            "Welcome back, superstar!",
            "There you are — I was just thinking about you!",
            "Good to see you again!",
            "Hey, let’s make something awesome!"
        ];
        let id = $(this).attr(id);
        let greeting = greetings[getRandomIndex[greetings]];
        callTippy(id,greeting,"right");
    })
});