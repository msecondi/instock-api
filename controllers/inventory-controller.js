import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

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
    singleInventory
}