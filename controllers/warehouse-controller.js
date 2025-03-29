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
            return res.status(404).send(`Requested warehouse not found. '${req.params.warehouse}'`);
        }
        res.status(200).json(warehouseFound[0]);
    } catch(error) {
        res.status(400).send(`Error retrieving Warehouses: ${error}`);
    }
}
  
export {
    allWarehouses,
    oneWarehouse
  };