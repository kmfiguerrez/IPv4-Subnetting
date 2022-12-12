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
const hostPerSubnet = document.getElementById("host");

// Create Popover.
const popover = new bootstrap.Popover(subnetNumberInput, {        
    placement: "top",
    title: "Did you know?",
    content: "You can change this value to find other subnets if available.",
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


const formatNumber = (num) => {
    /**
     * This method adds comma when the num becomes 4 digits or more.
     * This takes an argument of type number.
     * Returns Number | String.
     */

    if (num < 1000) {
        console.log(num)
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
    console.log(textArray.join(""));
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

    // Fist check the ip address.
    if( !Subnet.checkFormat(ipv4) ) return new Error("Invalid IPv4!");

    // Second check the subnet mask.
    if( !Subnet.checkSM(subnetMask) || CIDR === 0 || CIDR === 32 ) return new Error("Invalid Subnet Mask!");

    // Third check the subnet bits entry.
    if( (CIDR + subnetBits) > 30 ) return new Error("Invalid subnet bits entry!");

    // Fourth check the subnet number input.    
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

    // Resets.
    // subnetNumberInput.value = 0;
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
    const hostPerSubnetValue = (2 ** subnet.hostPortion.length) - 2;
    const naCIDR = nac.nextElementSibling;
    const fuacCIDR = fuac.nextElementSibling;
    const luacCIDR = luac.nextElementSibling;
    const baCIDR = bac.nextElementSibling;

    // Set the max attribute of the subnet number input for users convience.
    subnetNumberInput.setAttribute("max", `${numOfSubnets - 1}`);
    
    // Display.
    if (numOfSubnets === 1) {
        caption.innerHTML = `There is ${numOfSubnets} subnet`;    
    } else {
        caption.innerHTML = `There are ${formatNumber(numOfSubnets)} subnets`;
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

    const subnetToFind = parseInt(subnetNumberInput.value);

    getSubnet(subnetToFind);

});
