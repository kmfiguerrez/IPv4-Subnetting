import Subnet from "./ipv4.js";

const ipv4Input = document.querySelector("#ipv4");
const smInput = document.querySelector("#subnet-mask");
const subnetBitsInput = document.getElementById("subnet-bits");
const submitButton = document.querySelector("#submit");
const outputSection = document.getElementById("output-section");
// const outputArea = document.querySelector("#output");
// nac means Network Address Container.
const nac = document.getElementById("network-address");
// fuac means First Usable Address Container.
const fuac = document.getElementById("first-usable-address");
// luac means Last Usable Address Container.
const luac = document.getElementById("last-usable-address");
// bac means Broadcast Address Container.
const bac = document.getElementById("broadcast-address");
const outputHeader = document.getElementById("caption");
const subnetNumberInput = document.getElementById("subnet-number");
const hostPerSubnet = document.getElementById("host");
const modalElement = document.getElementById('offcanvasModal')
const modalInputLabel = modalElement.querySelector('#modal-input-label');
const modalOutputLabel = modalElement.querySelector('#modal-output-label');  
const modalInput = modalElement.querySelector('#modal-input');
const modalOutput = modalElement.querySelector('#modal-output');
const modalElemTitle = document.querySelector("#modalLabel");
const modalSubtitle = document.querySelector("#modalSubtitle");
const modalBody = document.querySelector(".modal-body");
const modalSubmitButton = document.getElementById('modal-button');
const modalSwitchButton = document.getElementById('switch-button');
const modalRefAnchor = document.getElementById('modalSourceLink');

// Create Popover.
const popover = new bootstrap.Popover(subnetNumberInput, {        
    placement: "top",
    title: "Did you know?",
    content: "You can change this value to find other subnets if available.",
    trigger: "manual",    
})

// Popover should only be shown once.
let popMessage = false;

// Create tooltips
const tooltipList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
Array.from(tooltipList).map(elem => {
    return new bootstrap.Tooltip(elem);
})


// Model

const formatNumber = (num) => {
    /**
     * This method adds comma when the num becomes 4 digits or more.
     * This takes an argument of type number.
     * Returns Number | String.
     */

    if (num < 1000) {
        return num;
    }

    // Add comma.
    const text = num.toString();
    let textArray = text.split("");
    const textArrayReversed = textArray.reverse();
    // Add a comma after every three elements.
    let count = 0;
    for (let index = 0; index < textArrayReversed.length; index++) {
        if (count === 3) {
            textArrayReversed.splice(index, 0, ",")
            count = 0;
            continue;
        }
        count++;        
    }

    // Turn it to its original order.
    textArray = textArrayReversed.reverse();
    
    // Return it as string.    
    return textArray.join("");    
}


const checkUserInputs = () => {
    /**
     * This method will check user inputs (All the input elements.)
     * Will return an error object or boolean value.
     * Returns Object | Boolean
     */

    const ipv4 = ipv4Input.value;
    const subnetMask = smInput.value;
    const CIDR = Subnet.CIDR(subnetMask);
    const subnetBits = parseInt(subnetBitsInput.value);
    const numberOfNetworks = 2 ** subnetBits;
    const subnetNumber = parseInt(subnetNumberInput.value);
    let errorMessage = "";
    let numOfError = 0;
    

    // Fist check the ip address.
    if( !Subnet.checkFormat(ipv4) ) {
        // Remove first the .is-valid if it's exists.
        ipv4Input.classList.remove("is-valid");
        // Then add .is-invalid.
        ipv4Input.classList.add("is-invalid");
        // Set error message.
        errorMessage = "Incorrect IPv4 Address!";
        numOfError++;
        // Reset Output Content.
        resetOuputContent();
    }

    // Second check the subnet mask.
    if( !Subnet.checkSM(subnetMask) || CIDR === 0 || CIDR === 32 ) {
        // Remove first the .is-valid if it's exists.
        smInput.classList.remove("is-valid");
        // Then add .is-invalid.
        smInput.classList.add("is-invalid");
        // Set error message.
        errorMessage = "Incorrect Subnet Mask!";
        numOfError++;
        // Reset Output Content.
        resetOuputContent();
    }
    
    // Third check the subnet bits entry.
    if( isNaN(subnetBits) || (CIDR + subnetBits) > 30 ) {
        // Remove first the .is-valid if it's exists.
        subnetBitsInput.classList.remove("is-valid");
        // Then add .is-invalid.
        subnetBitsInput.classList.add("is-invalid");
        // Set error message.
        errorMessage = "Incorrect Subnet Bits!";
        numOfError++;
        // Reset Output Content.
        resetOuputContent();
    } 

    // Fourth check the subnet number input.    
    if( subnetNumber < 0 || subnetNumber > (numberOfNetworks - 1) ) {
        errorMessage = `Subnet ${subnetNumber} does not exists!`;
        numOfError++;
    } 

    if (numOfError > 1) {
        return new Error("Incorrect IP Informations!");
    } else if (numOfError === 1) {
        return new Error(errorMessage);
    } else {
        return true;
    }
}


// View.
function resetOuputContent () {
    /**
     * This method will reset the content of the output section
     * in the main screen.
     * Returns void.
     */

    // Reset text.
    outputHeader.innerText = "OUTPUT";
    subnetNumberInput.value = "";
    hostPerSubnet.innerText = "";
    nac.innerText = "X.X.X.X";
    fuac.innerText = "X.X.X.X";
    luac.innerText = "X.X.X.X";
    bac.innerText = "X.X.X.X";
    nac.nextElementSibling.innerText = "/X";
    fuac.nextElementSibling.innerText = "/X";
    luac.nextElementSibling.innerText = "/X";
    bac.nextElementSibling.innerText = "/X";
    
}

const renderAlertMessage = (error, attachTo, preText="Error", alertType="danger") => {
    /**
     * This method displays error to the user using bootstrap alert component.
     * This method takes an error object and two optional arguments.
     * Returns html object.
     */
    
    // Create alert element
    const alert = document.createElement("div");
    // Add attributes to alert.
    alert.setAttribute("class", `alert alert-${alertType} alert-dismissible fade show`);
    alert.setAttribute("role", "alert");
    alert.style.fontSize = "1rem"

    // Create a message for alert element.
    alert.innerHTML = `<strong>${preText}</strong>: ${error.message}`;

    // Create a close button element for alert element.
    const button = document.createElement("button");
    // Add attributes to button.
    button.setAttribute("type", "button");
    button.setAttribute("class", "btn-close");
    button.setAttribute("data-bs-dismiss", "alert");
    button.setAttribute("aria-label", "Close");

    alert.appendChild(button);
    
    attachTo.insertAdjacentElement("afterbegin", alert);
}


const render = function(subnet) {
    /**
     * This method will render the Network Address, First Usable Address.
     * Last Usable Address, Broadcast Address and the number of hosts per subnet.
     * Returns null.
     */
    
    const networkAddress = subnet.networkAddress;
    const firstUsableAddress = subnet.firstUsableAddress;
    const lastUsableAddress = subnet.lastUsableAddress;
    const broadcastAddress = subnet.broadcastAddress;
    const numOfSubnets = 2 ** subnet.subnetPortion.length;
    const hostPerSubnetValue = (2 ** subnet.hostPortion.length) - 2;
    const naCIDR = nac.nextElementSibling;
    const fuacCIDR = fuac.nextElementSibling;
    const luacCIDR = luac.nextElementSibling;
    const baCIDR = bac.nextElementSibling;

    // Set the max attribute of the subnet number input for users convience.
    subnetNumberInput.setAttribute("max", `${numOfSubnets - 1}`);
    
    // Display.
    if (numOfSubnets === 1) {
        outputHeader.innerHTML = `There is ${numOfSubnets} subnet`;    
    } else {
        outputHeader.innerHTML = `There are ${formatNumber(numOfSubnets)} subnets`;
    }
    
    nac.innerHTML = networkAddress;
    fuac.innerHTML = firstUsableAddress;
    luac.innerHTML = lastUsableAddress;
    bac.innerHTML = broadcastAddress;
    // hostPerSubnet.innerHTML = hostPerSubnetValue;
    hostPerSubnet.innerHTML = formatNumber(hostPerSubnetValue);
    naCIDR.innerHTML = `/${subnet.CIDR}`;
    fuacCIDR.innerHTML = `/${subnet.CIDR}`;
    luacCIDR.innerHTML = `/${subnet.CIDR}`;
    baCIDR.innerHTML = `/${subnet.CIDR}`;

    // Popover will pop up once.
    if ( !popMessage ) {
        // Popover will pop up in 3s.
        setTimeout(() => {
            popover.show();
            popMessage = true;
        }, 3000)
        
    }        
}

const resetModalContent = () => {
    /**
     * This function will reset modal's content.
     * Returns void.
     */

    // Reset I/O text.
    modalInput.value = "";
    modalOutput.innerText = "Output";

    // Reset validation text.
    modalInput.classList.remove("is-valid", "is-invalid");
    modalOutput.classList.remove("is-valid", "border-success");

    // Remove any alert message.
    const firstChild = modalBody.firstChild;
    if (firstChild instanceof HTMLDivElement) {
        modalBody.removeChild(firstChild);
    }
}


// Controller.
const getSubnet = function(subnetNumber) {
    /**
     * This function will get a particular subnet and pass it to render function.
     */
        
    const ipv4 = ipv4Input.value;
    const subnetMask = smInput.value;
    const subnetBits = parseInt(subnetBitsInput.value);
    const subnet = Subnet.getSubnets(ipv4, subnetMask, subnetBits, subnetNumber);    
    
    // Check user inputs.
    const result = checkUserInputs() 
    if (result !== true) {
        // Display error to the user.
        renderAlertMessage(result, outputSection);
        return;
    } 
    
    // Display the subnet.
    render(subnet);
}


const updateModalContent = (modalTitle, subtitle, modalInputLabelText, modalOutputLabelText, modalOperation, showAnchorLink) => {
    /**
     * This function will update modal's content
     * Returns void.
     */    

    // Reset the content first.
    resetModalContent();

    // Update the text.
    modalElemTitle.innerText = modalTitle;    
    modalSubtitle.innerText = subtitle.replace(/<.*>/i, "-"); // Regular Expression.
    modalInputLabel.innerText = modalInputLabelText;
    modalOutputLabel.innerText = modalOutputLabelText;

    // Set the form's input type for users convenience.
    if (modalOperation === "cidr-sm" || modalOperation === "dec-bin") {
        modalInput.setAttribute("type", "number");
    } else {
        modalInput.setAttribute("type", "text");
    }

    // Update the switch button.
    switch (modalTitle) {
        case "Conversion":
            // Show the switch button.
            modalSwitchButton.classList.remove("visually-hidden");
            break;
    
        default:
            // Otherwise hide the switch button.
            modalSwitchButton.classList.add("visually-hidden")
            break;
    }

    // Update the anchor link.
    if (showAnchorLink === true) {
        modalRefAnchor.classList.remove("invisible");
        modalRefAnchor.classList.add("visible");
    } else {
        modalRefAnchor.classList.remove("visible");
        modalRefAnchor.classList.add("invisible");
    }
}

const modalOperation = (modalOperation) => {
    /**
     * This function will perform modal's operation.
     * Returns void.
     */
    
    switch (modalOperation) {
        case "ipv4-bin": {
            const ipv4Address = modalInput.value.trim();
            const result = Subnet.bin(ipv4Address)

            if (result instanceof Error) {
                // Display validation text.
                modalInput.classList.remove("is-valid");
                modalInput.classList.add("is-invalid");                

                // Display alert message.
                renderAlertMessage(result, modalBody);

                // Update the output text.
                modalOutput.innerText = "Output";
                modalOutput.classList.remove("border-success", "is-valid");
                break;
            }

            // Otherwise valid.
            // Update the output text and validation text.
            modalOutput.innerText = result;            
            modalOutput.classList.add("border", "border-success", "is-valid");
            break;
        }
        case "bin-ipv4": {
            const ipv4Binaries = modalInput.value.trim();
            const result = Subnet.dec(ipv4Binaries);

            if (result instanceof Error) {
                // Display validation text.
                modalInput.classList.remove("is-valid");
                modalInput.classList.add("is-invalid");                

                // Display alert message.
                renderAlertMessage(result, modalBody);

                // Update the output text.
                modalOutput.innerText = "Output";
                modalOutput.classList.remove("border-success", "is-valid");
                break;
            }

            // Otherwise valid.
            // Update the output text and validation text.
            modalOutput.innerText = result;            
            modalOutput.classList.add("border", "border-success", "is-valid");            
            break;
        }
        case "cidr-sm": {
            const cidr = parseInt(modalInput.value.trim());
            const result = Subnet.subnetMask(cidr);

            if (result instanceof Error) {
                // Display validation text.
                modalInput.classList.remove("is-valid");
                modalInput.classList.add("is-invalid");                

                // Display alert message.
                renderAlertMessage(result, modalBody);

                // Update the output text.
                modalOutput.innerText = "Output";
                modalOutput.classList.remove("border-success", "is-valid");

                break;
            }

            // Otherwise valid.
            // Update the output text and validation text.
            modalOutput.innerText = result;            
            modalOutput.classList.add("border", "border-success", "is-valid");
            break;
        }
        case "sm-cidr": {
            const subnetMask = modalInput.value.trim();
            const result = Subnet.CIDR(subnetMask);

            if (result instanceof Error) {
                // Display validation text.
                modalInput.classList.remove("is-valid");
                modalInput.classList.add("is-invalid");                

                // Display alert message.
                renderAlertMessage(result, modalBody);

                // Update the output text.
                modalOutput.innerText = "Output";
                modalOutput.classList.remove("border-success", "is-valid");
                break;
            }

            // Otherwise valid.
            // Update the output text and validation text.
            modalOutput.innerText = result;            
            modalOutput.classList.add("border", "border-success", "is-valid");            
            break;
        }
        case "dec-bin": {
            const dec = parseInt(modalInput.value.trim());
            const result = Subnet.decToBin(dec);

            if (result instanceof Error) {
                // Display validation text.
                modalInput.classList.remove("is-valid");
                modalInput.classList.add("is-invalid");

                // Display alert message.
                renderAlertMessage(result, modalBody);

                // Update the output text.
                modalOutput.innerText = "Output";
                modalOutput.classList.remove("border-success", "is-valid");
                break;
            }

            // Otherwise valid.
            // Update the output text and validation text.
            modalOutput.innerText = result;            
            modalOutput.classList.add("border", "border-success", "is-valid");         
            break;
        }
        case "bin-dec": {
            const bin = modalInput.value.trim();
            const result = Subnet.binToDec(bin);
            
            if (result instanceof Error) {
                // Display validation text.
                modalInput.classList.remove("is-valid");
                modalInput.classList.add("is-invalid");

                // Display alert message.
                renderAlertMessage(result, modalBody);

                // Update the output text.
                modalOutput.innerText = "Output";
                modalOutput.classList.remove("border-success", "is-valid");
                break;
            }

            // Otherwise valid.
            // Update the output text and validation text.
            modalOutput.innerText = result;            
            modalOutput.classList.add("border", "border-success", "is-valid");
            break;
        }
        // Validations.
        case "ipv4-format": {
            const ipv4Address = modalInput.value.trim();
            const result = Subnet.checkFormat(ipv4Address);

            if (result === false) {
                // Display validation text.
                modalInput.classList.remove("is-valid");
                modalInput.classList.add("is-invalid");

                // Display alert message.                
                renderAlertMessage(new Error("Invalid IPv4 Address!"), modalBody);

                // Update the output text.
                modalOutput.innerText = "Output";
                modalOutput.classList.remove("border-success", "is-valid");
                break;
            }

            // Otherwise valid.
            // Update the output text and validation text.
            modalOutput.innerText = "Valid IPv4 Address";
            modalOutput.classList.add("border", "border-success", "is-valid");                       
            break;
        }
        // Validations.
        case "sm-format": {
            const subnetMask = modalInput.value.trim();
            const result = Subnet.checkSM(subnetMask);

            if (result === false) {
                // Display validation text.
                modalInput.classList.remove("is-valid");
                modalInput.classList.add("is-invalid");

                // Display alert message.
                renderAlertMessage(new Error("Invalid Subnet Mask!"), modalBody);

                // Update the output text.
                modalOutput.innerText = "Output";
                modalOutput.classList.remove("border-success", "is-valid");
                break;
            }

            // Otherwise valid.
            // Update the output text and validation text.
            modalOutput.innerText = "Valid Subnet Mask";
            modalOutput.classList.add("border", "border-success", "is-valid");            
            break;
        }
        case "ipv4-type": {
            const ipv4Address = modalInput.value.trim();
            const result = Subnet.ipv4Type(ipv4Address);
            console.log(result)
            if (result instanceof Error) {
                // Display validation text.
                modalInput.classList.remove("is-valid");
                modalInput.classList.add("is-invalid");

                // Display alert message.
                renderAlertMessage(result, modalBody);

                // Update the output text.
                modalOutput.innerText = "Output";
                modalOutput.classList.remove("border-success", "is-valid");
                break;
            }

            // Otherwise valid.
            // Update the output text and validation text.
            modalOutput.innerText = result;            
            modalOutput.classList.add("border", "border-success", "is-valid");
            break;
        }
    }
}


// Event listeners.
const forms = document.querySelectorAll('form');
Array.from(forms).forEach(form => {
    // Add event handlers to form elements.
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();

                
    })
})


const formInputs = document.querySelectorAll(".form-control");
Array.from(formInputs).forEach(input => {    

    // Add event handlers to each form input.
    input.addEventListener("change", function () {
        // Remove first the .is-invalid if it's exists.
        input.classList.remove("is-invalid");

        // Check if the input value is empty or not.
        if (this.value === "") {
            input.classList.remove("is-valid");
            input.classList.add("is-invalid");
        } else {
            input.classList.add("is-valid");
        }
    })
})


submitButton.addEventListener("click", () => {
    
    // Make sure first that the subnet number always starts with 0.
    subnetNumberInput.value = 0;

    // reset host value.
    hostPerSubnet.innerHTML = 0;
    
    // Render subnet 0.
    getSubnet(0)
});


subnetNumberInput.addEventListener("focus", () => {
    console.log("Popover hide")
    popover.hide()
});


subnetNumberInput.addEventListener("change", () => {
    // Find the subnet.
    const subnetToFind = parseInt(subnetNumberInput.value);

    getSubnet(subnetToFind);

});


modalElement.addEventListener('show.bs.modal', event => {
    // Link that triggered the modal
    const link = event.relatedTarget

    // Extract info from data-* attributes.
    const modal = link.getAttribute('data-modal');
    const subtitle = link.innerHTML.trim()
    const input = link.getAttribute('data-input') || "Input";
    const output = link.getAttribute('data-output') || "Output";
    const modalOperation = link.getAttribute('data-modal-operation');
    
    // Determine whether to show the anchor link.
    const showAnchorLink = modalOperation === "ipv4-type" ? true : false;
    
    // Update modal's content.
    updateModalContent(modal, subtitle, input, output, modalOperation, showAnchorLink);

    // Tell the modal submit button what operation to perform.
    modalSubmitButton.setAttribute("data-modal-operation", `${modalOperation}`);
    
    // Set data attributes for the modal switch button.
    const conversionTypeArray = modalOperation.split("-");
    modalSwitchButton.setAttribute("data-modal-subtitle", subtitle);
    modalSwitchButton.setAttribute("data-modal-operation", `${conversionTypeArray[1]}-${conversionTypeArray[0]}`);
    modalSwitchButton.setAttribute("data-input", `${output}`);
    modalSwitchButton.setAttribute("data-output", `${input}`);
})


modalSwitchButton.addEventListener("click", () => {
    // Extract info from data-* attributes.    
    const conversionType = modalSwitchButton.getAttribute("data-modal-operation");
    const subtitle = modalSwitchButton.getAttribute("data-modal-subtitle");
    const input = modalSwitchButton.getAttribute('data-input');
    const output = modalSwitchButton.getAttribute('data-output');

    updateModalContent("Conversion", subtitle, input, output, conversionType, false);

    // Tell the modal submit button what operation to perform.
    modalSubmitButton.setAttribute("data-modal-operation", `${conversionType}`);

    // Reverse the data attributes to perform the opposite converison.
    const conversionTypeArray = conversionType.split("-")
    modalSwitchButton.setAttribute("data-modal-operation", `${conversionTypeArray[1]}-${conversionTypeArray[0]}`);
    modalSwitchButton.setAttribute("data-input", `${output}`);
    modalSwitchButton.setAttribute("data-output", `${input}`);
})


// Add event handler to Modal's submit button.
modalSubmitButton.addEventListener("click", () => {

    // Check what operation to perform.
    const operation = modalSubmitButton.getAttribute("data-modal-operation");

    // Perform the modal operation.
    modalOperation(operation)  ;
})