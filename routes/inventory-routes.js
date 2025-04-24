import express from "express";
import * as inventoryController from "../controllers/inventory-controller.js"

const inventoryRouter = express.Router();

inventoryRouter
    .route("/")
    .post(inventoryController.addInventory)
    .get(inventoryController.inventories);

inventoryRouter
    .route('/:inventoryId')
    .get(inventoryController.singleInventory)
    .delete(inventoryController.deleteInventory)
    .patch(inventoryController.updateInventory);

export default inventoryRouter;