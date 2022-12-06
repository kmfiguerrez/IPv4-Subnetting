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

// Poppers
// const exampleEl = document.querySelector("#subnet-number");
// const popover = new bootstrap.Popover(exampleEl, {        
//         placement: "top",
//         title: "Did you know?",
//         content: "You can change the value?"        
// })


// Model
// List of subnets.
let subnets = [];
// Current subnet to be displayed.
let currentSubnet = {};

// Set list of subnet(s).
const setSubnets = function(inputSubnets) {
    /**
     * This method takes a parameter of type array.
     * This method will set the values of the subnets variable
     * in the model section.
     */

    try {
        if(inputSubnets === undefined || inputSubnets === "") throw "Argument cannot be undefined nor empty!";
        if(Array.isArray(inputSubnets) === false) throw "Argument must be an array!.";

        subnets = inputSubnets;

    } catch (error) {
        console.log(error);
    }
}

// Set the current subnet variable.
const setCurrentSubnet = function(inputCurrentSubnet) {
    /**
     * This method takes a parameter of type object.
     * This method will set the values of the subnets variable
     * in the model section.
     */
     console.log(inputCurrentSubnet.networkAddress);
    try {
        if(inputCurrentSubnet === undefined || inputCurrentSubnet === "") throw "Argument cannot be undefined nor empty!";
        // if(typeof inputCurrentSubnet === "object" && inputCurrentSubnet !== null && !Array.isArray(inputCurrentSubnet)) throw "Argument must be an object literal!";
        
        currentSubnet = inputCurrentSubnet;        

    } catch (error) {
        console.log(error);
    }
}

// Creates new HTML element.
const newElement = function(element, text="") {
    /**
     * Takes a two parameters.
     * Creates new HTML element.
     * Returns an HTML element.
     */

    try {
        if(element === undefined) throw "Argument cannot be undefined!";
        if(element === '') throw "Argument cannot be empty!.";

        const elem = document.createElement(element);
        elem.textContent = text;

        return elem;
        
    } catch (error) {
        console.log(error);
    }    
}

// View.
const render = function() {
    /**
     * This method will render whatever is in the current subnet variable
     * in the model section.
     * Returns null.
     */

    const subnet = currentSubnet; 
    console.log(subnet);
    const networkAddress = subnet.networkAddress;
    const firstUsableAddress = subnet.firstUsableAddress;
    const lastUsableAddress = subnet.lastUsableAddress;
    const broadcastAddress = subnet.broadcastAddress;
    const numOfSubnets = 2 ** subnet.subnetPortion.length;

    // outputArea.appendChild(newElement("p", "Number of Subnet(s): " + 2 ** subnet.subnetPortion.length));
    // outputArea.appendChild(newElement("p", "Subnet Number: " + subnet.subnetNumber));
    // outputArea.appendChild(newElement("p", networkAddress));
    // outputArea.appendChild(newElement("p", firstUsableAddress));
    // outputArea.appendChild(newElement("p", lastUsableAddress));
    // outputArea.appendChild(newElement("p", broadcastAddress));
    caption.innerHTML = `There are ${numOfSubnets} subnet(s)`;
    nac.innerHTML = networkAddress;
    fuac.innerHTML = firstUsableAddress;
    luac.innerHTML = lastUsableAddress;
    bac.innerHTML = broadcastAddress;
}

// Controller.
const getSubnet = function() {
    
    const ipv4 = ipv4Input.value;
    const subnetMask = smInput.value;
    const subnetBits = parseInt(subnetBitsInput.value);
    // const subnetBits = subnetBitsInput.value;
    // console.log(subnetBits, typeof subnetBits)

    const SubnetsList = Subnet.getSubnets(ipv4, subnetMask, subnetBits);
    console.log(SubnetsList)
    setSubnets(SubnetsList);
    // Set the default current subnet to be displayed which is subnet zero.        
    setCurrentSubnet(SubnetsList[0]);
    
    // Display the subnet.
    render();
}



const findSubnet = function(numOfSubnet) {
    /**
     * This method takes a parameter of type number.
     * This method set the current subnet to be displayed.
     * Returns null.
     */

    try {
        if(numOfSubnet === undefined || numOfSubnet === "") throw "Argument cannot be undefined nor empty!";
        // if(typeof numOfSubnet !== "number") throw "Argument must be a number!.";

        currentSubnet = parseInt(numOfSubnet);
        
        // Display the currentSubnet.
        render();
        
    } catch (error) {
        console.log(error);
    }
}

submitButton.addEventListener("click", (e) => {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const form = document.querySelector('.needs-validation');

   
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        if (!form.checkValidity()) {            
            event.stopPropagation()
        }

        form.classList.add('was-validated')
    }, false)


});

submitButton.addEventListener("click", getSubnet);
