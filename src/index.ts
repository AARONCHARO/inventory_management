// Import necessary libraries
import { v4 as uuidv4 } from "uuid";
import { Server, StableBTreeMap, ic } from "azle";
import express from "express";

// Define the Item class to represent inventory items
class Item {
    id: string;
    name: string;
    description: string;
    quantity: number;
    createdAt: Date;
}

// Define the Supplier class to represent suppliers
class Supplier {
    id: string;
    name: string;
    contactInfo: string;
    itemsSuppliedIds: string[];
    createdAt: Date;
}

// Define the Order class to represent inventory orders
class Order {
    id: string;
    itemId: string;
    quantity: number;
    orderDate: Date;
    supplierId: string;
}

// Initialize stable maps for storing inventory items, suppliers, and orders
const itemStorage = StableBTreeMap<string, Item>(0);
const supplierStorage = StableBTreeMap<string, Supplier>(1);
const orderStorage = StableBTreeMap<string, Order>(2);

// Define the express server
export default Server(() => {
    const app = express();
    app.use(express.json());

    // Endpoint to create an inventory item
    app.post("/items", (req, res) => {
        if (!req.body.name || !req.body.description || req.body.quantity === undefined) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const item: Item = {
            id: uuidv4(),
            createdAt: getCurrentDate(),
            ...req.body,
        };
        itemStorage.insert(item.id, item);
        res.json(item);
    });

    // Endpoint to create a supplier
    app.post("/suppliers", (req, res) => {
        if (!req.body.name || !req.body.contactInfo) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const supplier: Supplier = {
            id: uuidv4(),
            createdAt: getCurrentDate(),
            itemsSuppliedIds: [],
            ...req.body,
        };
        supplierStorage.insert(supplier.id, supplier);
        res.json(supplier);
    });

    // Endpoint to create an order
    app.post("/orders", (req, res) => {
        if (!req.body.itemId || req.body.quantity === undefined || !req.body.supplierId) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const order: Order = {
            id: uuidv4(),
            orderDate: getCurrentDate(),
            ...req.body,
        };
        orderStorage.insert(order.id, order);
        res.json(order);
    });

    // Start the server
    return app.listen();
});

// Function to get the current date
function getCurrentDate() {
    const timestamp = new Number(ic.time());
    return new Date(timestamp.valueOf() / 1000_000);
}
