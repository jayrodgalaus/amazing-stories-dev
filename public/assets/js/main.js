async function init(){
    setCurrentMonth();
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const bgUrl = el.getAttribute('data-bg');
                el.style.backgroundImage = `url('${bgUrl}')`;
                observer.unobserve(el); // Lazy load only once
            }
        });
    });

    document.querySelectorAll('.lazy-bg').forEach(el => {
        observer.observe(el);
    });
    document.querySelectorAll('.lazy-bg.highres').forEach(el => {
        const img = new Image();
        const url = el.getAttribute('data-bg');
        img.onload = () => {
            requestAnimationFrame(() => {
                el.style.backgroundImage = `url(${url})`;
                el.classList.add('loaded');
            });
        };
        img.src = url;
    });
    let status = await checkLoginStatus();
    if(status){
        getSiteAndDriveDetails();
        addFormValidation();
        // embedPowerBIReport();

        //check access level
        authorId = await getUserDetailsFromEmail(email);
        access = await userLevel();
        // dummydata();
        
    }
    $('#home-page').css('opacity', '1');
}
//ADD ENTRY FUNCTIONS
function setCurrentMonth() {
    // Get the current month index (0 for January, 1 for February, etc.)
    const currentMonthIndex = new Date().getMonth();

    // Get the monthDropdown element
    const monthDropdown = document.getElementById("monthDropdown");

    // Set the selected option to the current month
    monthDropdown.selectedIndex = currentMonthIndex;

    //disable future months
    $("#monthDropdown option").each(function () {
        const optionText = $(this).val(); // or use .text()
        const optionIndex = monthNames.indexOf(optionText);

        if (optionIndex > currentMonthIndex) {
            $(this).prop("disabled", true);
        }
    });
    

}
    // Function to update fileInput with the remaining files
function updateFileInput(filesArray, id) {
    const fileInput = document.getElementById(id);
    const dataTransfer = new DataTransfer(); // Create a new DataTransfer object
    
    filesArray.forEach(file => {
        dataTransfer.items.add(file); // Add the remaining files to the DataTransfer object
    });
    
    fileInput.files = dataTransfer.files; // Update fileInput's FileList
}

//ENTRIES FUNCTIONS
async function viewItem(id){
    let entryItem = spItems[id];
    let title = entryItem.Title;
    let year = entryItem.Year;
    let month = entryItem.Month;
    let subsl = entryItem.SUBSL;
    let account = entryItem.Account;
    let team = entryItem.Team;
    let recognition = entryItem.Individual ? "Individual" : "Team";
    let recipients = entryItem.Recipients.split('/ ');
    let recipientHTML = "";
    let worktype = entryItem.Worktype;
    let challenge = entryItem.Challenge.replace(/\n/g, "<br>");
    let help = entryItem.Help.replace(/\n/g, "<br>");
    let impact = entryItem.Impact.replace(/\n/g, "<br>");
    let uniqueness = entryItem.Uniqueness ? entryItem.Uniqueness.replace(/\n/g, "<br>") : "N/A";
    let author = await getUserDetailsById(entryItem.AuthorId);
    let createdBy = author ? author.Title : "Unknown";
    let createdOn = new Date(`${entryItem.Created}`);
    const options = { year: "numeric", month: "long", day: "numeric" };
    createdOn = createdOn.toLocaleDateString("en-US", options);
    let attachmentID = entryItem.Attachments ? entryItem.ID : null;
    let amplified = entryItem.Amplified;
    /* let title = entry.data('title');
    let year = entry.data('year');
    let month = entry.data('month');
    let subsl = entry.data('subsl');
    let account = entry.data('account');
    let team = entry.data('team');
    let recognition = entry.data('recognition') ? "Individual" : "Team";
    let recipients = entry.data('recipients').split('/ ');
    let recipientHTML = "";
    let worktype = entry.data('worktype');
    let challenge = entry.data('challenge');
    let help = entry.data('help');
    let impact = entry.data('impact');
    let uniqueness = entry.data('uniqueness') ? entry.data('uniqueness') : "N/A";
    let author = await getUserDetailsById(entry.data('author'));
    let createdBy = author ? author.Title : "Unknown";
    let createdOn = entry.data('createdOn');
    let attachmentID = entry.data('attachments'); */
    let logo = getAccountLogo(account);
    $('#entryInfoEntry').text(title);
    $('#entryInfoYear').text(year);
    $('#entryInfoMonth').text(month);
    $('#entryInfoSubSL').text(subsl);
    $('#entryInfoTeam').text(team);
    $('#entryInfoCreatedBy').text(createdBy);
    $('#entryInfoCreatedOn').text(createdOn);
    $('#entryInfoLogo').attr('src', logo);
    recipients.forEach(recipient => {
        recipientHTML += `${recipient}<br>`
    });
    $('#entryInfoRecipients').html(recipientHTML);
    $('#entryInfoLogo').attr("src", getAccountLogo(account));
    $('#entryInfoWorkType').text(worktype);
    $('#entryInfoChallenge').html(challenge);
    $('#entryInfoImpact').html(impact);
    $('#entryInfoUniqueness').html(uniqueness);
    $('#entryInfoHelp').html(help);
    if(attachmentID){
        await displayAttachments(attachmentID).then(()=>{
            $('#entryInfoImages').fadeIn();
        }).catch((error) => {
            $('#entryInfoImages').html(`<p>Error retrieving attachments</p>`)
            console.error("Error retrieving attachments:", error);
        });
    }else{
        $('#entryInfoImages').html(`<p>No attachments.</p>`)
    }
    $('#entryInfoAmplifyBtn').attr('data-amplified', amplified);
    $('#entryLoading').removeClass('d-flex').addClass('d-none');
    $('#entryInfoActions button').attr('data-id', id);
    $('#entryInfoCard').fadeIn();
}
async function getEntryById(id){
    let fields = [
        "Title","Year","Month","SUBSL","Account","Team","Individual","Recipients","Recipient_x0020_Emails","Worktype","Challenge","Help","Impact","Uniqueness","Outcome","Amplified",'Id','AuthorId', "Classification"
    ];
    let conditions = [{field:"ID", value: id}];
    let data = await getListWithSP_API("Amazing Stories entries",fields,conditions);
    
    if(data.length > 0)
        return data[0]; // Return the first item
    else
        console.log("No data found");
    
}
async function getAllEntriesByMonth(month){
    let sort = $('#sorter').val();
    $('#entriesContainer').html(loadingHTML());
    let fields = [
        "Title","Year","Month","SUBSL","Account","Team","Individual","Recipients","Recipient_x0020_Emails","Worktype","Challenge","Help","Impact","Uniqueness","Outcome","Amplified",'Id','AuthorId', "Classification"
    ];
    let conditions = [];
    if(month != 'All'){
        conditions = [{field:"Month", value: month}];
    }
    if(access.type == 1){
        let selectedSubSL = $('#subslFilter').val();
        if(selectedSubSL != 'All'){
            conditions.push({field:"SUBSL", value: selectedSubSL});
        }
    }else if(access.type == 2){
        conditions.push({field:"SUBSL", value: access.subsl});
    }
    // conditions.push({field:"Is_x0020_Deleted", value: false});
    getListWithSP_API("Amazing Stories entries",fields,conditions).then(data=>{
        if(data.length > 0)
            processListItems(data,month,sort); // Process the retrieved items
        else
            $('#entriesContainer').html(noContentHTML());
    }).catch((error) => {
        console.error("Error retrieving data:", error);
    });
}
async function getSelfEntriesByMonth(month){
    let sort = $('#sorter').val();
    $('#entriesContainer').html(loadingHTML());
    let fields = [
        "Title","Year","Month","SUBSL","Account","Team","Individual","Recipients","Recipient_x0020_Emails","Worktype","Challenge","Help","Impact","Uniqueness","Outcome","Amplified",'Id','AuthorId', "Classification"
    ];
    let conditions = [];
    if(month != 'All'){
        conditions = [{field:"Month", value: month}];
    }
    if(access.type == 1){
        let selectedSubSL = $('#subslFilter').val();
        if(selectedSubSL != 'All'){
            conditions.push({field:"SUBSL", value: selectedSubSL});
        }
    }else if(access.type == 2){
        conditions.push({field:"SUBSL", value: access.subsl});
    }
    
    // conditions.push({field:"Is_x0020_Deleted", value: false});
    getListWithSP_API("Amazing Stories entries",fields,conditions,email).then(data=>{
        if(data.length > 0)
            processListItems(data,month,sort); // Process the retrieved items
        else
            $('#entriesContainer').html(noContentHTML());
    }).catch((error) => {
        console.error("Error retrieving data:", error);
    });

    
}
async function getOwnRecognition(month) {
    let sort = $('#sorter').val();
    $('#entriesContainer').html(loadingHTML());
    try {
        let fields = ["Id", "Recipient_x0020_Emails"];
        let conditions = [];
        if(month != 'All'){
            conditions = [{field:"Month", value: month}];
        }
        let data = await getListWithSP_API("Amazing Stories entries", fields, conditions);
        if (data && data.length > 0) {
            
            let fields = [
                "Title", "Year", "Month", "SUBSL", "Account", "Team", "Individual", 
                "Recipients", "Recipient_x0020_Emails", "Worktype", "Challenge", "Help", 
                "Impact", "Uniqueness", "Outcome", "Amplified", "Id", "AuthorId", "Classification", "Submitted_x0020_By", "Created", "Attachments"
            ];
            let filteredData = data.filter(item => item.Recipient_x0020_Emails.includes(email));
            if(filteredData.length == 0){
                $('#entriesContainer').html(noContentHTML());
                return false;
            }
            let ids = filteredData.map(datum => datum.Id);
            if(month != 'All'){
                conditions = [{field:"Month", value: month}];
            }
            let filterQuery = ids.map(id => month !== 'All' ? `(ID eq ${id} and Month eq '${month}')` : `(ID eq ${id})`).join(' or ');
            let selectQuery = fields.join(',');

            const url = `https://dxcportal.sharepoint.com/sites/ITOEECoreTeam/_api/web/lists/getByTitle('Amazing Stories entries')/items?$filter=${filterQuery}&$select=${selectQuery}`;
            const token = await getSharePointToken();
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json;odata=verbose"
                }
            });

            const responseData = await response.json();
            console.log(responseData);
            if(responseData.d.results.length > 0)
                processListItems(responseData.d.results,month,sort); // Process the retrieved items
            else
                $('#entriesContainer').html(noContentHTML());
        } else {
            $('#entriesContainer').html(noContentHTML());
        }
    } catch (error) {
        console.log(error);
        showModal("Error", "Error fetching data. Please try again.");
    }
}
function getAccountLogo(account){
    let img = "";
    switch(account){
        case "ADBRI": img = "ADBRI"; break;
        case "AgGateway":  img = "AgGateway"; break;
        case "Airbus": img = "Airbus"; break;
        case "Amcor": img = "Amcor"; break;
        case "AON": img = "AON"; break;
        case "AT&T": img = "AT&T"; break;
        case "Audi": img = "Audi"; break;
        case "Avanos": img = "Avanos Medical"; break;
        case "Aviva": img = "Aviva Canada"; break;
        case "BOQ": img = "BOQ"; break;
        case "Betafence": img = "Betafence"; break;
        case "BlueScope": img = "BlueScope"; break;
        case "Calvo": img = "Calvo"; break;
        case "CIBC": img = "CIBC"; break;
        case "Coca-Cola": img = "Coca Cola"; break;
        case "DirecTV": img = "DIRECTV"; break;
        case "Duracell": img = "Duracell"; break;
        case "Downer": img = "Downer EDI Limited"; break;
        case "DXC Technology": img = "DXCTechnology"; break;
        case "Fischer": img = "Fischer"; break;
        case "Glanbia": img = "Glanbia"; break;
        case "Global Life Sciences Products and Services": img = "Global Life Sciences Products & Services"; break;
        case "Haleon": img = "Haleon"; break;
        case "Hanes Brands Inc.": img = "Hanes Brands Inc."; break;
        case "HF Sinclair": img = "HF Sinclair"; break;
        case "Hitachi": img = "Hitachi"; break;
        case "HSC BSO": img = "HSC BSO"; break;
        case "IAG": img = "IAG"; break;
        case "Japan Tobacco Inc.": img = "Japan Tobacco Inc."; break;
        case "Jollibee Foods Corporation": img = "JFC"; break;
        case "KBR": img = "KBR"; break;
        case "Kraft Heinz": img = "Kraft Heinz"; break;
        case "Leveraged": return null; break;
        case "Latitude Financial Services": img = "Latitude Financial Services"; break;
        case "Macquarie": img = "Macquarie"; break;
        case "Markem-Imaje": img = "Markem Imaje"; break;
        case "Medmix": img = "Medmix"; break;
        case "Microsoft": img = "Microsoft"; break;
        case "Nestle": img = "Nestle"; break;
        case "Nissan": img = "Nissan"; break;
        case "ONE": img = "ONE"; break;
        case "Oceana": img = "Oceana"; break;
        case "Origin": img = "Origin"; break;
        case "Philips": img = "Philips"; break;
        case "P&G": img = "P&G"; break;
        case "Pilmico": img = "Pilmico"; break;
        case "Radisson": img = "Radisson Hotel Group"; break;
        case "Ralph Lauren": img = "Ralph Lauren"; break;
        case "Sabre": img = "Sabre"; break;
        case "Serco": img = "Serco"; break;
        case "Siam Cement Group": img = "Siam Cement Group"; break;
        case "Sonneborn" : img = "Sonneborn"; break;
        case "Sotheby's": img = "Sothebys"; break;
        case "South Australian Health": img = "South Australian Health"; break;
        case "Sulzer": img = "Sulzer"; break;
        case "ThyssenKrupp": img = "ThyssenKrupp"; break;
        case "Toronto Dominion Bank": img = "Toronto Dominion Bank"; break;
        case "Tops Markets LLC": img = "Tops"; break;
        case "Transport for NSW": img = "Transport for NSW"; break;
        case "Uniper": img = "Uniper"; break;
        case "Valeo": img = "Valeo"; break;
        case "Ventia": img = "Ventia"; break;
        case "Western Sydney Airport": img = "Western Sydney Airport"; break;
        case "Western Union": img = "Western Union"; break;
        case "Westpac": img = "Westpac"; break;
        case "Whitehaven Coal": img = "Whitehaven Coal"; break;
        case "W.L. Gore": img = "W.L. Gore"; break;
        case "Worksafe Victoria": img = "WorkSafe Victoria"; break;
        case "ZF WABCO": img = "ZF Wabco"; break;
        default: return null; break;
    }
    return "assets/img/logos/"+img + ".jpg";
}
async function getAttachments(itemID) {
    try{
        const token = await getSharePointToken(); // Get a new token for SharePoint API
        const response = await fetch(`https://dxcportal.sharepoint.com/sites/ITOEECoreTeam/_api/Web/Lists/GetByTitle('Amazing Stories entries')/items(${itemID})/AttachmentFiles`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json;odata=verbose"
            }
        });
        const data = await response.json();
        return data.d.results; // Returns an array of attachments
        
    }catch(error){
        console.log(error);
        return null;
    }
    
}
async function displayAttachments(itemID) {
    const attachments = await getAttachments(itemID);
    let html = "";

    attachments.forEach(file => {
        html += `<img src="https://dxcportal.sharepoint.com${file.ServerRelativeUrl}" data-name="${file.FileName}" alt="It seems there is a problem with this image. Please upload a replacement." style="max-width: 200px; margin: 5px;">`;
    });

    document.getElementById("entryInfoImages").innerHTML = html;
}
async function displayExistingAttachmentsInUpdate(itemID) {
    const attachments = await getAttachments(itemID);
    let previewContainer = document.getElementById("existingPreviewContainer");
    if(attachments.length == 0){
        previewContainer.innerHTML = `<p>No images.</p>`;
        return false;
    }
    attachments.forEach((file, index) => {
        // html += `<img src="https://dxcportal.sharepoint.com${file.ServerRelativeUrl}" data-name="${file.FileName}" alt="Attachment" style="max-width: 200px; margin: 5px;">`;
        
        const div = document.createElement('div'); // Create a wrapper div
        div.classList.add('image-wrapper', 'existing'); // Optional: Add a class for styling
        const img = document.createElement('img');
        img.src = `https://dxcportal.sharepoint.com${file.ServerRelativeUrl}`;
        const button = document.createElement('button'); // Create a button
        button.innerHTML = '<i class="fa-solid fa-xmark"></i>'; // Add the icon
        button.classList.add('remove-image-button');
        button.type = 'button';
        const restorebutton = document.createElement('button'); // Create a button
        restorebutton.innerHTML = '<i class="fa-solid fa-rotate-right"></i>'; // Add the icon
        restorebutton.classList.add('restore-image-button');
        restorebutton.type = 'button';
        // Create the overlay
        const overlay = document.createElement('div');
        overlay.classList.add('image-overlay');
        overlay.innerText = "Marked for deletion"; // Optional label
        // Add click event to remove the preview and update the file list
        button.addEventListener('click', function() {
            // temporarily store the file name in json
            let attachmentsToDelete = JSON.parse($('#attachmentsToDelete').val());
            if (!attachmentsToDelete.includes(file.FileName)) {
                attachmentsToDelete.push(file.FileName);
            }
            $('#attachmentsToDelete').val(JSON.stringify(attachmentsToDelete));
            // Show the overlay instead of removing the image
            overlay.style.display = "flex";
            restorebutton.style.display = "block"; // Show the restore button
            button.style.display = "none"; // Hide the remove button
            $(this).closest('.image-wrapper').addClass('marked-for-deletion');
        });
        restorebutton.addEventListener('click', function() {
            // temporarily store the file name in json
            let attachmentsToDelete = JSON.parse($('#attachmentsToDelete').val());
            //remove file name from list
            attachmentsToDelete = attachmentsToDelete.filter(item => item !== file.FileName);

            $('#attachmentsToDelete').val(JSON.stringify(attachmentsToDelete));
            overlay.style.display = "none"; //Hide the overlay
            restorebutton.style.display = "none"; // Hide the restore button
            button.style.display = "block"; // Show the remove button
            $(this).closest('.image-wrapper').removeClass('marked-for-deletion');
        });


        div.appendChild(img); // Append the image to the wrapper div
        div.appendChild(button); // Append the button to the wrapper div
        div.appendChild(restorebutton); // Append the button to the wrapper div
        div.appendChild(overlay); // Add overlay but keep it hidden initially
        previewContainer.appendChild(div); // Add the image to the preview container
    });

}
function filterEntryList(month,filter){
    switch(filter){
        case '1': //all entries
            getAllEntriesByMonth(month);
            break;
        case '2': //own entries
            getSelfEntriesByMonth(month);
            break;
        case '3': //own recognition
            getOwnRecognition(month);
            break;
    }
}
async function processListItems(items,month, sort = 0) {
    let target = $('#entriesContainer')//$('#'+month+'Entries');
    let html = ``;
    spItems = []; // clear spItems
    // Sort items based on sort
    switch(sort){
        case '1':
            items.sort((a, b) => new Date(a.Created) - new Date(b.Created)); // Sort by Created date ascending
            break;
        case '2':
            items.sort((a, b) => new Date(b.Created) - new Date(a.Created)); // Sort by Created date descending
            break;
        case '3':
            items.sort((a, b) => a.Submitted_x0020_By.localeCompare(b.Submitted_x0020_By)); // Sort by Submitted By ascending
            break;
        case '4':
            items.sort((a, b) => b.Submitted_x0020_By.localeCompare(a.Submitted_x0020_By)); // Sort by Submitted By descending
            break;
        case '5':
            items.sort((a, b) => monthNames.indexOf(a.Month) - monthNames.indexOf(b.Month)); // sort by month ascending
            break;
        case '6':
            items.sort((a, b) => monthNames.indexOf(b.Month) - monthNames.indexOf(a.Month)); // sort by month descending
            break;
        case '7':
            items.sort((a, b) => a.Account.localeCompare(b.Account));; // sort by account ascending
            break;
        case '8':
            items.sort((a, b) => b.Account.localeCompare(a.Account));; // sort by account ascending
            break;
        default:
            items.sort((a, b) => new Date(b.Created) - new Date(a.Created));
    }
    
    if(items.length > 0){
        for( const item of items){
            if(!item || !item.Id){ continue;}
            spItems[item.Id] = item;
            var uniqueness = item.Uniqueness ? item.Uniqueness : "N/A";
            var recognition = item.Individual ? "Individual" : "Team";
            var createdOn = new Date(`${item.Created}`);
            const options = { year: "numeric", month: "long", day: "numeric" };
            createdOn = createdOn.toLocaleDateString("en-US", options);
            var attachments = item.Attachments ? item.ID : null;
            let category = "Entry";
            if(access.type == 1){
                category = item.Amplified;
            }
            html += `<div class="card entry-card my-1 ${category} position-relative entry-preview" data-id="${item.Id}">`
            
            html+=`<div class="card-body">
                    <div style="max-width: 75%;">
                        <span class="lead" entry-id="${item.Id}" style="cursor: pointer">${item.Title}</span><br>
                        <span><b>${item.SUBSL}</b> | ${item.Account}`;
            if(month == 'All'){
                html += ` | ${item.Month}, ${item.Year}`;
            }
            html += ` | Entry by: ${item.Submitted_x0020_By}</span>`;
            html+=`</span>
                    </div>`
            html+= `<div class="entry-actions">`;
            
            html+=`<button type="button" title="View Info" data-id="${item.Id}" data-bs-toggle="offcanvas" data-bs-target="#entryInfoCanvas" aria-controls="entryInfoCanvas" class="entry-view"><i class="fa-solid fa-right-to-bracket"></i></button>`
            
            // if((authorId == item.AuthorId && access.type == 2) || access.type == 1){            
            //     html += `<button type="button" title="Edit" data-id="${item.Id}" data-bs-toggle="offcanvas" data-bs-target="#updateEntryCanvas" aria-controls="updateEntryCanvas" class="entry-update"><i class="fa-solid fa-pen"></i></button>
            //             <button class="entry-delete" title="Delete" data-id="${item.Id}"><i class="fa-solid fa-trash-can"></i></button>`;
            // }
            // html += `<button title="Generate slides" class="entry-generate" data-id="${item.Id}"><i class="fa-solid fa-file-powerpoint"></i></button>`;
            html +=       `</div>`; //close entry-actions
            html+=`</div>
            </div>`;
        };
    }else{
        html = noContentHTML();
    }
    
    target.html(html);
}

//DASHBOARD FUNCTIONS
function embedPowerBIReport() {
    const embedConfig = {
        type: "report",
        id: "<report-id>",
        embedUrl: "<embed-url>",
        accessToken: "<access-token>",
        settings: {
        panes: {
            filters: {
            visible: false, // Hides filters pane
            },
        },
        layoutType: models.LayoutType.Custom, // Required for custom layout
        navContentPaneEnabled: false, // Hides page navigation bar
        },
    };

    // Embed the Power BI report into the container
    const reportContainer = document.getElementById("reportContainer");
    const report = powerbi.embed(reportContainer, embedConfig);
}
