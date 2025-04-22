import express from "express";
import * as inventoryController from "../controllers/inventory-controller.js"

const inventoryRouter = express.Router();

inventoryRouter
    .route("/")
    .get(inventoryController.inventories)
    .post(inventoryController.createInventory);

inventoryRouter
    .route('/categories')
    .get(inventoryController.getCategories);

inventoryRouter
    .route('/:inventoryId')
    .get(inventoryController.singleInventory)
    .delete(inventoryController.deleteInventory);

export default inventoryRouter;