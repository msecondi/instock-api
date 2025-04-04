import express from "express";
import * as inventoryController from "../controllers/inventory-controller.js"

const inventoryRouter = express.Router();

inventoryRouter
    .route("/")
    .get(inventoryController.inventories);

inventoryRouter
    .route('/:inventoryId')
    .get(inventoryController.singleInventory);

export default inventoryRouter;