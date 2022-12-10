import { Subnet } from "./ip.js";

const ipv4Input = document.querySelector("#ipv4");
const smInput = document.querySelector("#subnet-mask");
const subnetBitsInput = document.getElementById("subnet-bits");
const submitButton = document.querySelector("#submit");
// const outputArea = document.querySelector("#output");
// nac means Network Address Container.
const nac = document.getElementById("network-address");
// fuac means First Usable Address Container.
const fuac = document.getElementById("first-usable-address");
// luac means Last Usable Address Container.
const luac = document.getElementById("last-usable-address");
// bac means Broadcast Address Container.
const bac = document.getElementById("broadcast-address");
const caption = document.getElementById("caption");
const subnetNumberInput = document.getElementById("subnet-number");

// Create Popover.
const popover = new bootstrap.Popover(subnetNumberInput, {        
    placement: "top",
    title: "Did you know?",
    content: "You can change the value to find subnets.",
    trigger: "manual",    
})

// Popover should only be shown once.
let popMessage = false;

// Model
// Current subnet to be displayed.
let currentSubnet = {};

// Set the current subnet variable.
const setCurrentSubnet = function(inputCurrentSubnet) {
    /**
     * This method takes a parameter of type object.
     * This method will set the values of the subnets variable
     * in the model section.
     */
     
    try {
        if(inputCurrentSubnet === undefined || inputCurrentSubnet === "") throw new Error("Argument cannot be undefined nor empty!");        
        
        currentSubnet = inputCurrentSubnet;        

    } catch (error) {
        console.log(error);
    }
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

    // Fist check the ip address.
    if( !Subnet.checkFormat(ipv4) ) return new Error("Invalid IPv4!");

    // Second check the subnet mask.
    if( !Subnet.checkSM(subnetMask) || CIDR === 0 || CIDR === 32 ) return new Error("Invalid Subnet Mask!");

    // Third check the subnet bits entry.
    if( (CIDR + subnetBits) > 30 ) return new Error("Invalid subnet bits entry!");

    // Fourth check the subnet number input.
    // Make sure that there's alreay subnets added to subnets variable.
    if( subnetNumber < 0 || subnetNumber > (numberOfNetworks - 1) ) return new Error(`Subnet ${subnetNumber} does not exists!`);

    // Otherwise valid.
    return true;
}

// View.
const renderError = (error, preText="Error", alertType="danger") => {
    /**
     * This method displays error to the user using bootstrap alert component.
     * This method takes an error object and two optional arguments.
     * Returns null.
     */

    const outputSection = document.getElementById("output-section");
    
    // Create alert element
    const alert = document.createElement("div");
    // Add attributes to alert.
    alert.setAttribute("class", `alert alert-${alertType} alert-dismissible fade show`);
    alert.setAttribute("role", "alert");
    alert.style.fontSize = "1rem"

    // Create a message for alert element.
    alert.innerHTML = `<strong>${preText}</strong>! ${error.message}`;

    // Create a close button element for alert element.
    const button = document.createElement("button");
    // Add attributes to button.
    button.setAttribute("type", "button");
    button.setAttribute("class", "btn-close");
    button.setAttribute("data-bs-dismiss", "alert");
    button.setAttribute("aria-label", "Close");

    alert.appendChild(button);
    
    outputSection.insertAdjacentElement("afterbegin", alert);
}


const render = function() {
    /**
     * This method will render whatever is in the current subnet variable
     * in the model section.
     * Returns null.
     */

    const subnet = currentSubnet; 
    const networkAddress = subnet.networkAddress;
    const firstUsableAddress = subnet.firstUsableAddress;
    const lastUsableAddress = subnet.lastUsableAddress;
    const broadcastAddress = subnet.broadcastAddress;
    const numOfSubnets = 2 ** subnet.subnetPortion.length;

    caption.innerHTML = `There are ${numOfSubnets} subnet(s)`;
    nac.innerHTML = networkAddress;
    fuac.innerHTML = firstUsableAddress;
    luac.innerHTML = lastUsableAddress;
    bac.innerHTML = broadcastAddress;

    // Popover will pop up once.
    if ( !popMessage ) {
        popover.show();
        popMessage = true;    
    }        
}

// Controller.
const getSubnet = function(subnetNumber) {
        
    const ipv4 = ipv4Input.value;
    const subnetMask = smInput.value;
    const subnetBits = parseInt(subnetBitsInput.value);
    const subnet = Subnet.getSubnets(ipv4, subnetMask, subnetBits, subnetNumber);    
    
    // Check user inputs.
    const result = checkUserInputs()     
    if (result !== true) {
        // Display error to the user.
        renderError(result);
        return;
    } 
    
    // Set the current subnet which to be display by the render function.        
    setCurrentSubnet(subnet);
    
    // Display the subnet.
    render();
}


// Event listeners.
submitButton.addEventListener("click", () => {
    
    const form = document.querySelector('.needs-validation');
   
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (!form.checkValidity()) {            
            event.stopPropagation();
        }

        form.classList.add('was-validated')
    })


});

submitButton.addEventListener("click", () => {
    
    // Make sure first that the subnet number always starts with 0.
    subnetNumberInput.value = 0;
    
    // Render subnet 0.
    getSubnet(0)
});

subnetNumberInput.addEventListener("focus", () => {
    console.log("Popover hide")
    popover.hide()
});

subnetNumberInput.addEventListener("change", () => {

    const subnetToFind = parseInt(subnetNumberInput.value);
    console.log(subnetToFind)
    getSubnet(subnetToFind);

});
