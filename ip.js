class Subnet {

    givenIPv4;
    subnetMask;
    subnetNumber;    
    subnetPortion;
    hostPortion;
    networkPortion;
    networkAddress;
    broadcastAddress;
    firstUsableAddress;
    lastUsableAddress;
    CIDR;

    constructor() {
        this.givenIPv4 = "";
        this.subnetMask = "";
        this.CIDR = 0;
        this.subnetNumber = 0;
        // Convert subnetNumber to binary.
        // this.subnetPortion = this.subnetNumber.toString(2);
        this.subnetPortion = "";
        this.networkPortion = "";
        this.hostPortion = {};
        this.networkAddress;
        this.broadcastAddress;
        this.firstUsableAddress;
        this.lastUsableAddress;
        
    }


    // Static Members.

    static checkFormat(ipv4) {
        /**
         * This method takes a parameter of type string.
         * Checks for IPv4 format.
         * Returns a boolean: true|false.
         */

        const validIPv4Char = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."]
        const IPv4InArray = ipv4.split(".");
        let dotCount = 0;

        // Check. Argument cannot be undefined or empty.
        if (ipv4 === undefined || ipv4 === "") {
            console.log("Did not pass in an argument or argument is empty!");
            return false;
        }
        // Check. Argument shoud be a string.
        if (typeof ipv4 !== "string") {
            console.log("Argument should be a string!")
            return false;
        }
        // Check each character if it's valid IPv4 character.
        for (const char of ipv4) {
            if (!validIPv4Char.includes(char)) {
                console.log("Invalid IPv4 character is entered and spacing is not allowed!.")
                return false;
            }
        }
        // Check. Argument should be written in a dot notation.
        if (!ipv4.includes(".")) {
            console.log("IPv4 should be written in a dot notation!")
            return false;
        }
        // Check for valid placement of dot.
        if (ipv4[0] === "." || ipv4[-1] === ".") {
            console.log("Invalid placement of dot character");
            return false;
        }
        // Check. Valid IPv4 format has only three dot characters.        
        for (const char of ipv4) {
            if (char === ".") {
                dotCount++;
            }
        }
        if (dotCount !== 3) {
            console.log("Invalid IPv4 format!");
            return false;
        }
        // Check for first octet valid range.        
        if (IPv4InArray[0] <= 0 || IPv4InArray[0] >= 224) {
            console.log("Invalid IPv4 address!");
            return false;
        }
        // Check each octet.
        for (const elem of IPv4InArray) {
            if (elem < 0 || elem > 255) {
                console.log("Invalid IPv4 address!");
                return false;
            }
        }
        
        // Otherwise valid!
        return true;
    }

    static checkSM(subnetMask) {
        /**
         * This method takes a parameter of type string.
         * Checks for a valid Subnet Mask.
         * Returns a boolean: true|false
         */

        const validSMChar = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."]
        const validSMValue = [0, 128, 192, 224, 240, 248, 252, 254, 255];
        const smInArray = subnetMask.split(".")
        let dotCount = 0;
        
        // Check. Argument cannot be undefined or empty.
        if (subnetMask === undefined || subnetMask === "") {
            console.log("Did not pass in an argument or argument is empty!");
            return false;
        }
        // Check. Argument shoud be a string.
        if (typeof subnetMask !== "string") {
            console.log("Argument should be a string!")
            return false;
        }
        // Check each character if it's valid subnet mask character.
        for (const char of subnetMask) {
            if (!validSMChar.includes(char)) {
                console.log("Invalid Subnet Mask character is entered and spacing is not allowed!.")
                return false;
            }
        }
        // Check. Argument should be written in a dot notation.
        if (!subnetMask.includes(".")) {
            console.log("Subnet Mask should be written in a dot notation!")
            return false;
        }
        // Check for valid placement of dot.
        if (subnetMask[0] === "." || subnetMask[-1] === ".") {
            console.log("Invalid placement of dot character");
            return false;
        }
        // Check. Valid Subnet Mask format has only three dot characters.        
        for (const char of subnetMask) {
            if (char === ".") {
                dotCount++;
            }
        }
        if (dotCount !== 3) {
            console.log("Invalid Subnet Mask format!");
            return false;
        }
        // Check each octet if it's a valid subnet mask value.
        for (const elem of smInArray) {
            const octet = parseInt(elem)
            if (octet < 0 || octet > 255 || !validSMValue.includes(octet)) {
                console.log("Invalid Subnet Mask value!");
                return false;
            }
        }
        
        // Otherwise the Subnet Mask is valid.
        return true
    }

    static decToBin(decimal, numOfDigits) {
        /**
         * This method takes two parameters.
         * The numOfDigits param is the number of digits to use
         * to represent the results.
         * This method converts decimal to binary based on ipv4's format.       
         * Returns a string.
         */

        try {
            if(decimal === undefined) throw new Error("Did not pass in an argument!");
            if(decimal === "") throw new Error("Argument cannot be empty!");
            if(typeof numOfDigits !== "number") throw new Error("Second argument must be of type number!");


            // If decimal input is a string then parse it into decimal.
            if (typeof decimal === "string") {
                decimal = parseInt(decimal);
            }
            // Convert decimal to binary.
            let binary = decimal.toString(2);
            
            // If the second argument is omitted
            // then just parse the decimal without appending leading zeros.
            if (numOfDigits === undefined) {
                return binary;
            } else {
                // Prepend leading zeros.
                const zerosToPrepend = numOfDigits - binary.length;            
                binary = "0".repeat(zerosToPrepend) + binary;
                return binary;
            }
                        
        } catch (error) {
            console.log(error);
        }        
    }

    static bin(ipv4) {
        /**
         * This method takes a parameter of type string
         * written in an IPv4 format.
         * This method converts ipv4 written as decimal in a string format
         * to binaries in a string format.
         * Returns a string.
         */

        try {
            if(ipv4 === undefined) throw new Error("Did not pass in an argument!");
            if(ipv4 === "") throw new Error("Argument cannot be empty!");
            if(typeof ipv4 !== "string") throw new Error("Argument must be a string!");
            if(!ipv4.includes(".")) throw new Error("IPv4 must written in a dot notation!");

            const ipv4InArray = ipv4.split(".");
            let ipv4AsBin = [];
            
            // Turn each octet to binaries and put them in an array.
            ipv4AsBin = ipv4InArray.map(elem => {
                return this.decToBin(elem, 8);
            })

            // Return them written in a dot notation in a string.
            // console.log( ipv4AsBin.join("."));
            return ipv4AsBin.join(".");
            
        } catch (error) {
            console.log(error);
        }        
    }

    static dec(ipv4) {
        /**
         * This method takes a parameter of type string.
         * The argument can be written in a dot notation or 
         * as a contiguous binaries.
         * This method converts ipv4 written in binaries to 
         * decimals written in a dot notation.
         * Returns a string.
         */

        try {
            if(ipv4 === undefined) throw new Error("Did not pass in an argument!");
            if(ipv4 === "") throw new Error("Argument cannot be empty!");
            if(typeof ipv4 !== "string") throw new Error("Argument must be a string!");
            

            let ipv4InArray = []
            let ipv4AsDecimals = [];

            // If the input is not written in a dot notation.
            if (!ipv4.includes(".")) {
                // Make sure that the input is a complete 32 bits.
                if(ipv4.length !== 32) throw new Error("Input must written in a complete 32 bits!");

                // Get each set of 8 bits.                
                for (let index = 0; index < 32; index+=8) {
                    ipv4InArray.push(ipv4.slice(index, index + 8))                    
                }
            } else {
                // Otherwise written in dot notation.
                ipv4InArray = ipv4.split(".")
            }
            
            // Return each set of 8 bits as a decimal.
            ipv4AsDecimals = ipv4InArray.map(elem => {            
                return parseInt(elem, 2);
            })

            // Return them as decimals written in a dot notation.
            // console.log(ipv4AsDecimals.join("."))
            return ipv4AsDecimals.join(".");            
            
        } catch (error) {
            console.log(error);
        }
    }

    static CIDR(subnetMask) {
        /**
         * This method takes a parameter of type string 
         * written in an ipv4 format.
         * This method converts Subnet Mask to CIDR.
         * Returns a number.
         */

        try {
            if(subnetMask === undefined) throw new Error("Did not pass in an argument!");
            if(subnetMask === "") throw new Error("Argument cannot be empty!");
            if(typeof subnetMask !== "string") throw new Error("Argument must be a string!");
            if(this.checkSM(subnetMask)  === false) throw new Error("Invalid Subnet Mask!");
            
            let cidr = 0;
            // Convert the Subnet Mask to a string of continuous binaries.
            const smAsBin = this.bin(subnetMask).split(".").join("");

            // Count the number of 1s.
            for (const char of smAsBin) {
                if (char !== "0") {
                    cidr++;
                } else {
                    break;
                }
            }
            return cidr;

        } catch (error) {
            console.log(error);
        }
    }

    static subnetMask(cidr) {
        /**
         * This method takes a parameter of type number.
         * This method converts CIDR to Subnet Mask.
         * Returns a string.
         */

        try {
            if(cidr === undefined) throw new Error("Did not pass in an argument!");
            if(cidr === "") throw new Error("Argument cannot be empty!");
            if(typeof cidr !== "number") throw new Error("Argument must be a number!");
            if(cidr < 0 || cidr > 32) throw new Error("CIDR is out of range!");

            let subnetMask = "";
            
            while (cidr !== 0) {
                subnetMask += "1";
                cidr--;
            }

            // If the subnet mask is not yet a complete 32 bits.
            // Append trailing zeros.
            if (subnetMask.length !== 32) {                
                subnetMask += "0".repeat(32 - subnetMask.length);
            }

            // Turn the subnet mask into decimals written in dot notation.
            subnetMask = this.dec(subnetMask);

            return subnetMask;

        } catch (error) {
            console.log(error);
        }
    }

    static getSubnets(ipv4Input, smInput, subnetBitsInput) {
        /**
         * This method takes a parameters of type string.
         * This method lists the subnet object(s). 
         * Returns an array.        
         */

        try {
            // Check first the ipv4 and subnet mask inputs.
            if(ipv4Input === undefined || smInput === undefined || subnetBitsInput === undefined) throw new Error("Arguments cannot be undefined!");
            if(ipv4Input === "" || smInput === "") throw new Error("Arguments cannot be empty!");
            if(typeof ipv4Input !== "string" || typeof smInput !== "string") throw new Error("Arguments must be a string!");
            if(typeof subnetBitsInput !== "number") throw new Error("Third argument must a number!");
            if(Subnet.checkFormat(ipv4Input) === false) throw new Error("Invalid IPv4 Address!");
            if(Subnet.checkSM(smInput) === false) throw new Error("Invalid Subnet Mask!");
            
            
            const ipv4 = ipv4Input;
            const ipv4Bin = Subnet.bin(ipv4);
            const subnetMask = smInput;
            const CIDR = Subnet.CIDR(subnetMask);
            const numNetworks = 2 ** subnetBitsInput;
            const subnetBits = subnetBitsInput;
            const newSubnetMask = CIDR + subnetBits;
            const hostPortionBits = 32 - (CIDR + subnetBitsInput);
            const networkPortionBits = 32 - (subnetBits + hostPortionBits);
            const networkPortion = ipv4Bin.split(".").join("").slice(0, networkPortionBits);
            const subnetsList = [];

            if (CIDR === 0 || CIDR === 32) throw new Error("Invalid Subnet Mask or CIDR!");
            if (newSubnetMask > 30) throw new Error("Invalid subnet bits entry!");
                

            // Declare and initialize new Subnet object.
            for (let index = 0; index < numNetworks; index++) {

                const newSubnet = new Subnet();

                // Set the given IPv4 Address.
                newSubnet.givenIPv4 = ipv4;

                // Set the given Subnet Mask.
                newSubnet.subnetMask = subnetMask;
                
                // Set the CIDR(Subnet Mask).
                newSubnet.CIDR = CIDR;
                
                // Set the Subnet number.
                newSubnet.subnetNumber = index;

                // Set the subnet portion.
                // Convert subnetNumber to binary.
                const subnetBin = newSubnet.subnetNumber.toString(2);
                // Prepend leading zeros because the toString method doesn't include leading zeros.
                const zerosToPrepend = subnetBits - subnetBin.length;
                // If not subnetted, then the subnet portion is 0.
                if (subnetBits === 0) {
                    newSubnet.subnetPortion = "";
                } else {
                    // Otherwise subnetted.
                    newSubnet.subnetPortion = "0".repeat(zerosToPrepend) + subnetBin;
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
            
            // Returns an array of object(s).
            return subnetsList;

        } catch (error) {
            console.log(error);
        }
    }

}

export { Subnet };