import express from "express";
import * as warehouseController from "../controllers/warehouse-controller.js";

const warehouseRouter = express.Router();

warehouseRouter
    .route("/")
    .get(warehouseController.allWarehouses);

warehouseRouter
    .route('/:warehouseId')
    .get(warehouseController.oneWarehouse)

warehouseRouter
    .route('/:warehouseId/inventories')
    .get(warehouseController.inventoryInWarehouse)

export default warehouseRouter;