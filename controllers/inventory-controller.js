import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const singleInventory = async(req, res) => {
    try {
        const data = await knex('inventories')
            .join('warehouses', 'warehouses.id','inventories.warehouse_id')
            .where('inventories.id', req.params.inventoryId)
            .select('inventories.id', 'warehouses.warehouse_name', 'item_name', 'description', 'category', 'status', 'quantity');
        res.status(200).json(data[0]);
    } catch(error) {
        res.status(400).send(`Error retrieving inventory information: ${error}`);
    }
}

export {
    singleInventory
}