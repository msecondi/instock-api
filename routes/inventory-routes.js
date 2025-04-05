<<<<<<< HEAD
import express from "express";
import * as inventoryController from "../controllers/inventory-controller.js"

const inventoryRouter = express.Router();

inventoryRouter
    .route("/")
    .get(inventoryController.inventories);

inventoryRouter
    .route('/:inventoryId')
    .get(inventoryController.singleInventory);

=======
import express from "express";
import * as inventoryController from "../controllers/inventory-controller.js"

const inventoryRouter = express.Router();

inventoryRouter
    .route("/")
    .get(inventoryController.inventories);

inventoryRouter
    .route('/:inventoryId')
    .get(inventoryController.singleInventory);

>>>>>>> 5ebe94af48cc5f81e40f8a18e50a378b08281520
export default inventoryRouter;