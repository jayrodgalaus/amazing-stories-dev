function showModal(title, message){
    $('#modal-title').text(title);
    $('#modal-message').html(message);
    $('#generalModal').modal('show');
}
function showConfirmModal(message,func){
    $('#confirmMessage').html(message);
    // Remove any previous click event bindings from the button
    $('#confirmModalBtn').off('click');

    // Bind the provided function to the button's click event
    $('#confirmModalBtn').on('click', func);

    // Show the modal
    $('#confirmModal').modal('show');
}
function addFormValidation(){
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
}
function resetFormValidation(form){
    form.removeClass('was-validated');
}
function spinButton(button){
    button.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...');
    button.prop('disabled', true);
}
function stopSpinButton(button, text){
    button.html(text);
    button.prop('disabled', false);
} 
function loadingHTML(){
    return `<div class="w-100 h-100 d-flex align-items-center justify-content-center">
        <div class="spinner-grow spinner-grow-sm text-primary mx-1" role="status"></div>
        <div class="spinner-grow spinner-grow-sm text-primary mx-1" role="status"></div>
        <div class="spinner-grow spinner-grow-sm text-primary mx-1" role="status"></div>
    </div>`;
}
function noContentHTML(){
    return `<div class="w-100 h-100 d-flex align-items-center justify-content-center">
        There is nothing here.
    </div>`;
}

function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result); // Get Base64 string
        reader.onerror = reject;
        reader.readAsDataURL(file); // Convert file to Base64
    });
}
function getRandomString(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function dummydata() {
    $('#teamInput').val("Dummy Team");
    $('#entryInput').val("Dummy Entry");
    let pill = `<div class="recipientPill bg-secondary-subtle px-2" value="mohamed.awaad@dxc.com" name="Awaad, Mohamed (DXC Luxoft)">Awaad, Mohamed (DXC Luxoft)<button class="removeRecipient" type="button"><i class="fa-solid fa-xmark"></i></button></div>`;
    $('#recipientContainer').html(pill);
    $('#recognitionInput1').attr('checked', true).prop('checked', true);
    $('#businessChallengeInput').val("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare pharetra orci ac molestie. Vivamus at consectetur tortor. Nunc mattis orci non arcu fermentum, ac cursus mauris consequat. Etiam ligula nisi, vestibulum et viverra at, sagittis vel urna. Pellentesque a congue mauris. Aenean sed rutrum felis. Aliquam sit amet diam ac orci accumsan elementum. Vivamus imperdiet facilisis bibendum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.")
    $('#howDXCHelpedInput').val("In hac habitasse platea dictumst. Integer congue egestas nibh, non porta ex finibus eu. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin non varius risus. Aenean consequat nisl neque, vel convallis nisl tempor ac. Donec finibus tortor quis augue euismod interdum. Maecenas in lorem sit amet massa semper pulvinar. In quis rutrum enim. Morbi quis rutrum magna. Sed sodales ultrices pellentesque. Integer orci tortor, tempus vitae dapibus vitae, ultricies vitae leo.")
    $('#businessImpactInput').val("Nunc hendrerit ornare sem, sit amet commodo nibh. Donec non arcu rhoncus, porttitor mi eu, feugiat est. Fusce vestibulum ante vitae interdum semper. Sed ipsum purus, posuere et urna et, ornare semper felis. Sed est dolor, facilisis at nunc nec, molestie viverra arcu. Aliquam velit libero, aliquam in magna quis, vulputate faucibus mi. Nunc vel ipsum vitae urna placerat rhoncus ac at justo. Sed tristique posuere erat eu malesuada.");
}

//POWER AUTOMATE FUNCTIONSv
async function sendEmail(beforeData, afterData) {
    // Create table structure
    let htmlTable = `
        <table border="1" style="border-collapse: collapse; width: 100%;">
            <thead>
                <tr>
                    <th style="padding: 8px; text-align: left;">Field</th>
                    <th style="padding: 8px; text-align: left;">Before</th>
                    <th style="padding: 8px; text-align: left;">After</th>
                    <th style="padding: 8px; text-align: left;">Modified By</th>
                    <th style="padding: 8px; text-align: left;">Modified On</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Loop through modified fields
    afterData.forEach(({ name, value }) => {
        let formattedName = name;
        if(name == "Recipient_x0020_Emails"){
            formattedName = "Recipient Emails";
        }else if(name == "Recipient_x0020_Names"){
            formattedName = "Recipient Names";
        }
        htmlTable += `
            <tr>
                <td style="padding: 8px;">${formattedName}</td>
                <td style="padding: 8px;">${beforeData[name] || "N/A"}</td>
                <td style="padding: 8px;">${value}</td>
                <td style="padding: 8px;">${accountName}</td>
                <td style="padding: 8px;">${new Date().toLocaleString()}</td>
            </tr>
        `;
    });

    // Close table
    htmlTable += `
            </tbody>
        </table>
    `;
    const requestData = {email: htmlTable};
    // const token = await getToken();
    flowUrl = "https://prod-59.westus.logic.azure.com:443/workflows/cd16bc1b918a4169b7b97fbe081aeb51/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=lsQ_obP9XwOg6WZ_-2FqJK3jw6sAX0ZbRLQHa7aQRhA"
    fetch(flowUrl, {
    method: "POST",
    headers: { 
        // "AUthorization": `Bearer ${token}`,
        "Content-Type": "application/json" 
    },
    body: JSON.stringify(requestData)

    })
    .then(async response => {
        console.log("Status Code:", response.status);

        if (!response.ok) {
            console.error("Error response from Power Automate:", response.statusText);
            return;
        }

        // Check if there's a response body
        const contentType = response.headers.get("Content-Type");
        
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            console.log("JSON Response:", data);
        } else {
            console.log("No JSON body, raw response:", await response.text());
        }
    })
    .catch(error => console.error("Error:", error));
}

function cleanPPTText(text){
    const cleanedText = text
    .replace(/[\x00-\x1F\x7F]/g, '') // removes most control characters
    .trim();
    return cleanedText;
}