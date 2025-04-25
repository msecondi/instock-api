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

const deleteInventory = async(req, res) => {
    try {
        const item = await knex('inventories')
            .where('inventories.id', req.params.inventoryId)
            .delete();

        if(!item) {
            return res.status(404).send(`Requested inventory item '${req.params.inventoryId}' was either already deleted or does not exist.`)
        }
        //204 - No Content response
        res.sendStatus(204);
    } catch(error) {
        res.status(400).send(`Error deleting inventory item: ${error}`);
    }
}

const getCategories = async(req, res) => {
    try {
        const categories = await knex('inventories')
            .distinct('category')
            .orderBy('category');

        const categoryList = categories.map(item => item.category);
        res.status(200).json(categoryList);
    } catch(error) {
        res.status(400).send('Error retrieving categories: ' + error);
    }
}

const createInventory = async(req, res) => {
    try {
        const { warehouse_id, item_name, description, category, status, quantity } = req.body;
        
        // Validationto check if all fields are provided
        if (!warehouse_id || !item_name || !description || !category || !status || quantity === undefined) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        // Validation to check if quantity is a number
        if (isNaN(quantity)) {
            return res.status(400).json({ error: 'Quantity must be a number' });
        }
        
        // Check if warehouse exists
        const warehouseExists = await knex('warehouses')
            .where({ id: warehouse_id })
            .first();
            
        if (!warehouseExists) {
            return res.status(400).json({ error: 'Warehouse not found' });
        }
        
        const [newInventoryId] = await knex('inventories') //insert new inventory item
            .insert({
                warehouse_id,
                item_name,
                description,
                category,
                status,
                quantity
            });
            
        // Get newly created inventory
        const newInventory = await knex('inventories')
            .select('id', 'warehouse_id', 'item_name', 'description', 'category', 'status', 'quantity')
            .where({ id: newInventoryId })
            .first();
            
        res.status(201).json(newInventory);
    } catch(error) {
        res.status(400).send(`Error creating inventory: ${error}`);
    }
}

const updateInventory = async(req, res) => { 
    try {
        const { warehouse_id, item_name, description, category, status, quantity } = req.body;

        // Validate required fields
        if (!warehouse_id || !item_name || !description || !category || !status || quantity === undefined) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        if (isNaN(quantity)) {
            return res.status(400).json({ error: 'Quantity must be a number.' });
        }

        // ✅ Check if inventory item exists
        const inventoryExists = await knex('inventories')
            .where({ id: req.params.inventoryId })
            .first();

        if (!inventoryExists) {
            return res.status(404).json({ error: 'Inventory item not found.' });
        }

        // ✅ Check if warehouse exists
        const warehouseExists = await knex('warehouses')
            .where({ id: warehouse_id })
            .first();

        if (!warehouseExists) {
            return res.status(400).json({ error: 'Warehouse not found.' });
        }

        // ✅ Update the inventory item
        await knex('inventories')
            .where({ id: req.params.inventoryId })
            .update({
                warehouse_id,
                item_name,
                description,
                category,
                status,
                quantity
            });

        // ✅ Fetch and return updated inventory
        const updatedInventory = await knex('inventories')
            .where({ id: req.params.inventoryId })
            .first();

        res.status(200).json(updatedInventory);

    } catch (error) {
        res.status(400).send(`Error updating inventory item: ${error}`);
    }
};
  
export {
    inventories,
    singleInventory,
    deleteInventory,
    getCategories,
    createInventory,
    updateInventory
}