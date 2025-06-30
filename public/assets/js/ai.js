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
    on('mouseenter', '#mistralChallenge',function(){
        callTippy('#mistralChallenge');
    })
});