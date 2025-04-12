import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

import Warehouse from "../model/warehouse.js"; // Warehouse class for validation

const allWarehouses = async(req, res) => {
    try {
        const data = await knex('warehouses');
        res.status(200).json(data);
    } catch(error) {
        res.status(400).send(`Error retrieving Warehouses: ${error}`);
    }
}

const createWarehouse = async(req, res) => {
    try{
        //VALIDATION START
        //create an instance of Warehouse to gain access to class
        const requestedWarehouse = new Warehouse(req.body);
        //use the validation function within the Warehouse class to validate requested warehouse object and assign to variable
        const validationResult = requestedWarehouse.validateWarehouse('create'); //specifying which validation required
        //check to see if the response from validation passed an error message. If so, return it and display to user
        if(validationResult.errorMessage) {
            return res.status(422).send(validationResult.errorMessage);
        }
        //VALIDATION END

        //passed validation, now 'create' warehouse
        const data = await knex('warehouses').insert(req.body);
        // assign new id to variable
        const newWarehouseId = data[0];
        //now retrieve new warehouse information and send as a response
        const newWarehouse = await knex('warehouses')
            .select('id', 'warehouse_name', 'address', 'city', 'country', 'contact_name', 'contact_position', 'contact_phone', 'contact_email')
            .where({ id: newWarehouseId }) // use new id to select new warehouse
            .first(); // instead of using newWarehouse[0]
    
        res.status(200).send(newWarehouse);
    } catch (error) {
        res.status(400).send(`Error creating warehouse: ${error}`);
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
        //create an instance of Warehouse to gain access to class
        const requestedWarehouse = new Warehouse(req.body);
        //use the validation function within the Warehouse class to validate requested warehouse object and assign to variable
        const validationResult = requestedWarehouse.validateWarehouse('update'); //specifying which validation required
        //check to see if the response from validation passed an error message. If so, return it and display to user
        if(validationResult.errorMessage) {
            return res.status(422).send(validationResult.errorMessage);
        }
        //VALIDATION END

        //select desired table and update with validated data
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