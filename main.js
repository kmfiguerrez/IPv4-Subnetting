import { Subnet } from "./ip.js";

const ipv4 = "192.168.0.0"
const ipv4Bin = Subnet.bin(ipv4);
const subnetMask = "255.255.224.0";
const CIDR = Subnet.CIDR(subnetMask);
const numNetworks = 2 ** (CIDR % 8);
const subnetBits = CIDR % 8;
const hostPortionBits = 32 - CIDR;
const networkPortionBits = 32 - (subnetBits + hostPortionBits);
const networkPortion = ipv4Bin.split(".").join("").slice(0, networkPortionBits);
const subnetsList = [];

// console.log(ipv4)
// console.log(`Network Portion length: ${networkPortionBits}`);
// console.log(`Network Portion: ${networkPortion}`);
// console.log(`CIDR: ${CIDR}`)
// console.log(`Number of networks: ${numNetworks}`)
// Subnet.subnetMask(32);
console.log(Subnet.checkFormat(ipv4));

if (CIDR === 0 || CIDR === 255) {
    console.log("Invalid Subnet Mask or CIDR!")
}


for (let index = 0; index < numNetworks; index++) {

    const newSubnet = new Subnet();

    // Set the given IPv4 Address.
    newSubnet.givenIPv4 = ipv4;
    
    // Set the CIDR(Subnet Mask).
    newSubnet.CIDR = CIDR;
    
    // Set the Subnet number.
    newSubnet.subnetNumber = index;

    // Set the subnet portion.
    // Convert subnetNumber to binary.
    const subnetBin = newSubnet.subnetNumber.toString(2);
    // Append leading zeros because the toString method doesn't include leading zeros.
    const zerosToAppend = subnetBits - subnetBin.length;
    // If not subnetted, then the subnet portion is 0.
    if (subnetBits === 0) {
        newSubnet.subnetPortion = "";
    } else {
        newSubnet.subnetPortion = "0".repeat(zerosToAppend) + subnetBin;
    }
    
    // Set the network portion.
    newSubnet.networkPortion = networkPortion;
    
    // Initialize the hostPortion object property.
    // Set the host portion length.
    newSubnet.hostPortion.length = hostPortionBits;
    // Set the host portion network address portion.
    const hostPortionNADec = 0; // Decimal format.    
    newSubnet.hostPortion.nap = Subnet.decToBin(hostPortionNADec, newSubnet.hostPortion.length); // Binary format.
    // Set the host portion broadcast address portion.
    const hostPortionBADec = 2 ** newSubnet.hostPortion.length - 1; // Decimal format.
    newSubnet.hostPortion.bap = Subnet.decToBin(hostPortionBADec, newSubnet.hostPortion.length); // Binary format.
    // Set the host portion first usable address portion.
    const hostPortionFUADec = hostPortionNADec + 1; // Decimal Format.
    newSubnet.hostPortion.fuap = Subnet.decToBin(hostPortionFUADec, newSubnet.hostPortion.length); // Binary format.
    // Set the host portion last usable address portion.
    const hostPortionLUADec = hostPortionBADec - 1; // Decimal format.
    newSubnet.hostPortion.luap = Subnet.decToBin(hostPortionLUADec, newSubnet.hostPortion.length); // Binary format.
    
    // Set the subnet's network address.
    newSubnet.networkAddress = Subnet.dec(newSubnet.networkPortion + newSubnet.subnetPortion + newSubnet.hostPortion.nap);
    // Set the subnet's first usable address.
    newSubnet.firstUsableAddress = Subnet.dec(newSubnet.networkPortion + newSubnet.subnetPortion + newSubnet.hostPortion.fuap);
    // Set the subnet's last address.
    newSubnet.lastUsableAddress = Subnet.dec(newSubnet.networkPortion + newSubnet.subnetPortion + newSubnet.hostPortion.luap);
    // Set the subnet's broadcast address.
    newSubnet.broadcastAddress = Subnet.dec(newSubnet.networkPortion + newSubnet.subnetPortion + newSubnet.hostPortion.bap);

    subnetsList.push(newSubnet);
}   

console.log(subnetsList);

document.querySelector("body > div.container > table > thead > tr > th.text-center");