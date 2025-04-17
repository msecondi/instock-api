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
    .patch(warehouseController.updateWarehouse);

warehouseRouter
    .route('/:warehouseId/inventories')
    .get(warehouseController.inventoryInWarehouse);

export default warehouseRouter;