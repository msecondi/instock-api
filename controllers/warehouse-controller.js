import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const allWarehouses = async(req, res) => {
    try {
        const data = await knex('warehouses');
        res.status(200).json(data);
    } catch(error) {
        res.status(400).send(`Error retrieving Warehouses: ${error}`);
    }
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
        res.status(400).send(`Error retrieving Warehouses: ${error}`);
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
        res.status(400).send(`Error retrieving Warehouses: ${error}`);
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
        
        //if 'contact_phone' key found, check if it is a valid phone number --> 10 digits, non negative, 1234567890
        if(hasPhoneNumber) {
            //parse to string if user entered int
            if(typeof hasPhoneNumber[1] === 'number') {
                hasPhoneNumber[1] = hasPhoneNumber[1].toString();
            }
            console.info(hasPhoneNumber[1]);
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
        console.log(missingValue);
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
        res.status(400).send(`Error updating Warehouse: ${error}`);
    }
}
  
export {
    allWarehouses,
    oneWarehouse,
    inventoryInWarehouse,
    updateWarehouse
  };