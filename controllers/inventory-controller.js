<<<<<<< HEAD
<<<<<<< HEAD
import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const inventories = async(req, res) => {
    try {
        const inventories = await knex('inventories').select('*');
        if (!inventories.length) {
            return res.status(404).send('Requested inventories not found.');
        }
        res.status(200).json(inventories);
    } catch(error) {
        res.status(400).send(`Error retrieving inventory information: ${error}`);
    }
}

const singleInventory = async(req, res) => {
    try {
        const inventoryItem = await knex('inventories')
            .join('warehouses', 'warehouses.id','inventories.warehouse_id')
            .where('inventories.id', req.params.inventoryId)
            .select('inventories.id', 'warehouses.warehouse_name', 'item_name', 'description', 'category', 'status', 'quantity');
        if (!inventoryItem.length) {
            return res.status(404).send(`Requested inventory item not found. '${req.params.inventoryId}'`);
        }
        res.status(200).json(inventoryItem[0]);
    } catch(error) {
        res.status(400).send(`Error retrieving inventory information: ${error}`);
    }
}

export {
    inventories,
    singleInventory
=======
=======
>>>>>>> 5ebe94af48cc5f81e40f8a18e50a378b08281520
import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const inventories = async(req, res) => {
    try {
        const inventories = await knex('inventories').select('*');
        if (!inventories.length) {
            return res.status(404).send('Requested inventories not found.');
        }
        res.status(200).json(inventories);
    } catch(error) {
        res.status(400).send(`Error retrieving inventory information: ${error}`);
    }
}

const singleInventory = async(req, res) => {
    try {
        const inventoryItem = await knex('inventories')
            .join('warehouses', 'warehouses.id','inventories.warehouse_id')
            .where('inventories.id', req.params.inventoryId)
            .select('inventories.id', 'warehouses.warehouse_name', 'item_name', 'description', 'category', 'status', 'quantity');
        if (!inventoryItem.length) {
            return res.status(404).send(`Requested inventory item not found. '${req.params.inventoryId}'`);
        }
        res.status(200).json(inventoryItem[0]);
    } catch(error) {
        res.status(400).send(`Error retrieving inventory information: ${error}`);
    }
}

export {
    inventories,
    singleInventory
<<<<<<< HEAD
>>>>>>> 5ebe94af48cc5f81e40f8a18e50a378b08281520
=======
>>>>>>> 5ebe94af48cc5f81e40f8a18e50a378b08281520
}