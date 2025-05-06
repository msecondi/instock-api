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
    .delete(inventoryController.deleteInventory)
    .patch(inventoryController.updateInventory);

inventoryRouter
    .route('/sort/:sortBy/order/:orderBy')
    .get(inventoryController.sortInventory);


export default inventoryRouter;