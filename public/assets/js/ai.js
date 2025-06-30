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

function mistralCheckDraft(element){
    const type = $(element).attr('contentType');
    let textarea = $(element).attr('textarea');
    let id = $(element).attr('id');
    let draft = $('#'+textarea).val().trim();
    let selector = '#'+id;
    if(draft.length < 200){
        callTippy(selector, mistral_inputTooShort[getRandomIndex(mistral_inputTooShort)],"right")
    }else if(draft.length > 1900){
        callTippy(selector, mistral_inputTooLong[getRandomIndex(mistral_inputTooLong)],"right")
    }else{
        let message = `${mistral_improvements[getRandomIndex(mistral_improvements)]}
            <hr>
            <div class="d-flex">
                <button type="button" class="btn btn-primary mx-1 mistral-improve-draft" textarea="${textarea}" type="${type}">Shorten</button>
                <button type="button" class="btn btn-primary mx-1 mistral-improve-draft" textarea="${textarea}" type="${type}">Lengthen</button>
                <button type="button" class="btn btn-primary mx-1 mistral-improve-draft" textarea="${textarea}" type="${type}">Clean up</button>
                <button type="button" class="btn btn-primary mx-1 mistral-improve-draft" textarea="${textarea}" type="${type}">Paraphrase</button>
            </div>
        `;
        callTippy(selector, message,"right")
    }
}

//global variables
const mistral_greetings = [
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
const mistral_inputTooShort = [
  "Hmm, this seems a bit short.",
  "Want to add a little more detail?",
  "Looks like this could use some expansion.",
  "That’s a good start — care to elaborate?",
  "I think there’s more you could say here.",
  "This feels a bit light — want to flesh it out?",
  "You might want to add a few more thoughts.",
  "Let’s build this out a bit more.",
  "Could you give me a little more context?",
  "This might be clearer with a bit more info.",
  "I’m picking up the vibe, but it’s a bit thin.",
  "Let’s add some substance to this.",
  "Think you could expand on that?",
  "This could benefit from a few more lines.",
  "It’s a bit brief — want to go deeper?",
  "I’m sure there’s more to say here!",
  "Let’s give this some extra weight.",
  "Feels like it’s missing some key details.",
  "Want to round this out a bit more?",
  "You’re on the right track — now let’s build on it!"
];
const mistral_inputTooLong = [
  "Hmm, this seems a bit long-winded.",
  "Think we could trim this down a bit?",
  "That’s quite the novel — want to tighten it up?",
  "This might be clearer with fewer words.",
  "Let’s try to make this more concise.",
  "You’ve got a lot to say — maybe too much?",
  "This could use a little editing for brevity.",
  "Whew, that’s a lot! Want to simplify it?",
  "Let’s aim for clarity over length.",
  "You might lose your reader halfway through this.",
  "This is starting to feel like a monologue.",
  "Could we say the same thing with fewer words?",
  "Let’s trim the fat and keep the flavor.",
  "That’s a bit of a wall of text — want help condensing it?",
  "This might benefit from a more focused version.",
  "You’ve got the ideas — now let’s sharpen the delivery.",
  "Let’s make this punchier.",
  "A little editing could go a long way here.",
  "Want me to help you tighten this up?",
  "Let’s cut to the chase — I can help!"
];
const mistral_improvements = [
  "That's a solid draft. Want to improve it?",
  "Nice start! Want to make it even sharper?",
  "Looking good — ready to polish it up?",
  "This has potential. Want to refine it together?",
  "You're on the right track. Want to elevate it?",
  "Great bones here — shall we tighten it up?",
  "This works! Want to make it pop a bit more?",
  "Strong draft. Want to boost clarity or tone?",
  "You’ve got the idea — want help refining the delivery?",
  "This is promising. Want to enhance it?",
  "Solid effort! Want to make it even more impactful?",
  "You're close — want to fine-tune it?",
  "This could shine with a few tweaks. Want help?",
  "Nice flow! Want to sharpen the message?",
  "This is working — want to level it up?",
  "Great draft. Want to make it more concise?",
  "You’ve got something strong here. Want to polish it?",
  "This is nearly there. Want to refine it a bit?",
  "Good structure! Want to enhance the tone or clarity?",
  "Looks good! Want to explore a stronger version?"
];


$(document).ready(function(){
    $(document)
    .on('mouseenter', '.mistral-button', function () {
        const greeting = mistral_greetings[getRandomIndex(mistral_greetings)];
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
    })
    .on('click','.mistral-button',function(){
        mistralCheckDraft($(this));
    })
    .on('click','.mistral-improve-draft', function(){
        let textarea = $(this).attr('textarea');
        let intent = $(this).text();
        let draft = $('#'+textarea).val().trim();
        let type = $(this).attr(type);
        let length = "Keep the response ";
        switch(intent){
            case "Shorten":
                length += "at least 200 characters long."
            break;
            case "Lengthen":
                length += "no more than 1900 characters long."
            break;
            default:
                length += "within 200 to 1900 characters long."
            break;
        }
        const prompt = `
        You are helping improve a professional entry for: ${type}.
        Here is the current draft:
        """
        ${draft}
        """
        Please ${intent} the draft. ${length}`;
        callMyAI(prompt);
    })

});