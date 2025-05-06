import express from "express";
import * as warehouseController from "../controllers/warehouse-controller.js";

const warehouseRouter = express.Router();

warehouseRouter
    .route("/")
    .get(warehouseController.allWarehouses)
    .post(warehouseController.createWarehouse);

warehouseRouter
    .route('/:warehouseId')
    .get(warehouseController.oneWarehouse)
    .patch(warehouseController.updateWarehouse)
    .delete(warehouseController.deleteWarehouse);

warehouseRouter
    .route('/sort/:sortBy/order/:orderBy')
    .get(warehouseController.sortWarehouses);

warehouseRouter
    .route('/:warehouseId/inventories')
    .get(warehouseController.inventoryInWarehouse);

export default warehouseRouter;