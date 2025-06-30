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
    $(document)
    .on('mouseenter', '.mistral-button', function () {
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
            "Hey, let\’s make something awesome!",
            "Oh hey, didn't see you there!",
            "Back for more? I like your style.",
            "You again? This must be fate.",
            "Just in time — I was getting bored.",
            "Ah, the legend returns!",
            "You always know when to show up.",
            "Let\’s make some magic, shall we?",
            "I was hoping you'd click that.",
            "You\’ve got great timing, as always.",
            "Let\’s do something brilliant together!"
        ];

        const greeting = greetings[getRandomIndex(greetings)];
        const el = this;

        if (el._tippy) {
            el._tippy.setContent(greeting);
            el._tippy.show();
        } else {
            tippy(el, {
            content: greeting,
            placement: 'right',
            arrow: true,
            trigger: 'manual'
            }).show();
        }
    })
    .on('mouseleave', '.mistral-button', function () {
        const el = this;
        if (el._tippy) {
            el._tippy.hide();
        }
    });

});