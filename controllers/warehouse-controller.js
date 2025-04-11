import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

import Warehouse from "../model/warehouse.js"; // Warehouse class for validation

//declare functions for validation
function hasKey(keyName, object) {
    const objPair = Object.entries(object); //creates an array of arrays with key, value pairs
    //check if object contains 'keyName' as a key and return it
    return objPair.find( element => element[0] === keyName);
}
    
function validPhoneNumber(contactPhoneNo) {
    
    //parse to string if user entered int
    if(typeof contactPhoneNo === 'number') {
        contactPhoneNo = contactPhoneNo.toString();
    }
    //use regex to ensure phone number is flexible on formatting
    if(!contactPhoneNo.match(/^\+?\d*\s?\(?\d{3}\)?\s?\d{3}[\s-]?\w?\d{4}$/)){
        return {
            validPhoneNo: false
        }
    }
    return {
        validPhoneNo: true
    }
}

function validEmailAddress(contactEmail) {
    //use regex to ensure proper email formatting is used by user
    if(!contactEmail.match(/^[\w.-]+@[\w.-]+\.\w+$/)) {
        return {
            validEmail: false
        }
    }
    return {
        validEmail: true
    }
}

function validWarehouse(obj) {
    //delcare an array containing all required object keys to create a warehouse with
    const objKeys = ['warehouse_name', 'address', 'city', 'country', 'contact_name', 'contact_position', 'contact_phone', 'contact_email'];
    
    //gather keys requested by user
    const requestedObjKeys = Object.keys(obj);

    //declare array to capture all keys that are missing to later display to user
    // let missingKeysArr = []; 
    let missingKeysArr = objKeys.filter(key => !requestedObjKeys.includes(key));
    console.log(missingKeysArr);
    //iterate through required keys array and ensure requested object includes each one. 
    // for(let i = 0; i < objKeys.length; i++) {
    //     if(!requestedObjKeys.includes(objKeys[i])){
    //         //add missing key to array
    //         missingKeysArr.push(objKeys[i]);
    //     }
    // }
    console.log("missingkeysArr: " + missingKeysArr);
    //if any keys are missing, return object displaying input not valid, with all missing values
    if(missingKeysArr.length) {
        return {
            validKeys: false,
            missingKeys: missingKeysArr
        };
    }

    //gather key/value pairs requested by user
    const requestedObj = Object.entries(obj);

    //loop through object and ensure all values are 'non-empty'
    const emptyValues = [];
    requestedObj.forEach((value) => {
        // Specify 'falsy' values to allow user to include 0 as a valid value
        if (value[1] === null || value[1] === undefined || (typeof value[1] === 'string' && value[1].trim() === "")) {
            emptyValues.push(value);
        }
    })
    console.log("emptyValuesArr: " + emptyValues);
    //if there are values within 'emptyValues', return 'validValues: false' and pass array with all values that need correction
    if(emptyValues.length) {
        return {
            validKeys: true,
            validValues: false,
            missingValues: emptyValues
        };
    }
    
    //ADD PHONE & EMAIL VALIDATION FUNCTIONS
    //since req.body has been validated for correct keys & values, pass corresponding value to be validated for formatting
    //validate 'contact_phone' key
    let properFormat = validPhoneNumber(obj.contact_phone);
    console.log(properFormat);
    if(!properFormat.validPhoneNo) {
        return {
            validKeys: true,
            validValues: true,
            phoneFormat: false
        }
    }

    //validate 'contact_email' key
    properFormat = validEmailAddress(obj.contact_email);
    console.log(properFormat);
    if(properFormat.validPhoneNo) {
        return {
            validKeys: true,
            validValues: true,
            phoneFormat: true,
            emailFormat: false
        }
    }

    //passed all validation, return all true
    return { 
        validKeys: true,
        validValues: true,
        phoneFormat: true,
        emailFormat: true
    };
}


const allWarehouses = async(req, res) => {
    try {
        const data = await knex('warehouses');
        res.status(200).json(data);
    } catch(error) {
        res.status(400).send(`Error retrieving Warehouses: ${error}`);
    }
}

const createWarehouse = async(req, res) => {
    // const result = validWarehouse(req.body);
    // console.log(result)
    // // console.log(req.body.contact_phone)
    // if(!result.validKeys){
    //     res.send(`Keys missing from requested warehouse: ${result.missingKeys.map(e => ` '${e}'`)}`);
    // }
    // else if(!result.validValues){
    //     res.send(`Values missing from requested warehouse key: '${result.missingValues.map(e => `{ ${e[0]}: '${e[1]}' }`)}'`);
    // }
    const requestedWarehouse = new Warehouse(req.body);
    const valid = requestedWarehouse.validWarehouse();
    if(valid.errorMessage) {
        return res.send(valid.errorMessage);
    }
    res.send("You did it!")
}

const oneWarehouse = async(req, res) => {
    try {
        const warehouseFound = await knex('warehouses')
            .where({id: req.params.warehouseId });

        if (!warehouseFound.length) {
            return res.status(404).send(`Requested warehouse not found. '${req.params.warehouseId}'`);
        }
        res.status(200).json(warehouseFound[0]);
    } catch(error) {
        res.status(400).send(`Error retrieving warehouses: ${error}`);
    }
}

const inventoryInWarehouse = async(req, res) => {
    try {
        const warehouseFound = await knex('warehouses')
            .join('inventories', 'inventories.warehouse_id', 'warehouses.id')
            .where('warehouses.id', req.params.warehouseId)
            .select("inventories.id", "item_name", "category", "status", "quantity");
        if (!warehouseFound.length) {
            return res.status(404).send(`Requested warehouse not found. '${req.params.warehouseId}'`);
        }
        res.status(200).json(warehouseFound);
    } catch(error) {
        res.status(400).send(`Error retrieving warehouses: ${error}`);
    }
}

const updateWarehouse = async(req, res) => {
    try {
        //VALIDATION START
        //declare variables used to validate input
        let isValid = true;
        let index = 0; 
        
        const objPair = Object.entries(req.body); //creates an array of arrays with key, value pairs

        //check if requested update includes 'contact_phone' and 'contact_email'
        const hasPhoneNumber = objPair.find( element => element[0] === "contact_phone");
        const hasEmail = objPair.find( element => element[0] === "contact_email");
        
        //if 'contact_phone' key found, check if it is a valid phone number --> 10 digits, non negative
        if(hasPhoneNumber) {
            //parse to string if user entered int
            if(typeof hasPhoneNumber[1] === 'number') {
                hasPhoneNumber[1] = hasPhoneNumber[1].toString();
            }
            //use regex to ensure phone number is flexible on formatting
            hasPhoneNumber[1].match(/^\+?\d*\s?\(?\d{3}\)?\s?\d{3}[\s-]?\w?\d{4}$/) ? isValid : isValid = false;
            if (!isValid) {
                return res.status(400).send("Not a valid phone number.") 
            }
        }
        //if 'contact_email' key found, check if it is a valid email '@ & .'
        if(hasEmail) {
            //use regex to ensure proper email formatting is used by user
            hasEmail[1].match(/^[\w.-]+@[\w.-]+\.\w+$/) ? isValid : isValid = false;
            if (!isValid) {
                return res.status(400).send("Not valid email. Please ensure email includes '.' and '@'.");  
            }
        }
        //loop through object and ensure all values are 'non-empty'
        const missingValue = objPair.some((value, i) => {
            // Specify 'falsy' values to allow user to include 0 as a valid value
            if (value[1] === null || value[1] === undefined || (typeof value[1] === 'string' && value[1].trim() === "")) {
                index = i; // capture index to display more detailed error message 
                return true; //missingValue = true
            }
        })
        //if missingValue is true, req.body contains a 'falsy' value, therefore abort and send '409 - Conflict' error
        if (missingValue) {
            return res.status(409).send(`Requested data FAILED to update due to empty value --> { ${objPair[index][0]}: '${objPair[index][1]}' }`); 
        }
        //VALIDATION END

        // select desired table and update with validated data
        const selectedWarehouse = await knex('warehouses')
            .where({id: req.params.warehouseId })
            .update(req.body);

        if (!selectedWarehouse) {
            return res.status(404).send(`Requested warehouse not found. '${req.params.warehouseId}'`);
        } else {
            console.info("Successfully patched data!");
        } 

        //fetch updated warehouse and send back to user
        const updatedWarehouse = await knex('warehouses')
            .select('id', 'warehouse_name', 'address', 'city', 'country', 'contact_name', 'contact_position', 'contact_phone', 'contact_email')
            .where({id: req.params.warehouseId });

        res.status(200).json(updatedWarehouse[0])
    } catch (error) {
        res.status(400).send(`Error updating warehouse: ${error}`);
    }
}

const deleteWarehouse = async(req, res) => {
    try {
        const warehouse = await knex('warehouses')
            .where('warehouses.id', req.params.warehouseId)
            .delete();

        if(!warehouse) {
            return res.status(404).send(`Requested warehouse '${req.params.warehouseId}' was either already deleted or does not exist.`)
        }

        res.sendStatus(204);
    } catch(error) {
        res.status(400).send(`Error deleting warehouse: ${error}`);
    }
}
  
export {
    allWarehouses,
    createWarehouse,
    oneWarehouse,
    inventoryInWarehouse,
    updateWarehouse,
    deleteWarehouse
};