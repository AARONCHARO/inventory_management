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

    constructor(name: string, description: string, quantity: number) {
        this.id = uuidv4();
        this.name = name;
        this.description = description;
        this.quantity = quantity;
        this.createdAt = getCurrentDate();
    }
}

// Define the Supplier class to represent suppliers
class Supplier {
    id: string;
    name: string;
    contactInfo: string;
    itemsSuppliedIds: string[];
    createdAt: Date;

    constructor(name: string, contactInfo: string) {
        this.id = uuidv4();
        this.name = name;
        this.contactInfo = contactInfo;
        this.itemsSuppliedIds = [];
        this.createdAt = getCurrentDate();
    }
}

// Define the Order class to represent inventory orders
class Order {
    id: string;
    itemId: string;
    quantity: number;
    orderDate: Date;
    supplierId: string;

    constructor(itemId: string, quantity: number, supplierId: string) {
        this.id = uuidv4();
        this.itemId = itemId;
        this.quantity = quantity;
        this.orderDate = getCurrentDate();
        this.supplierId = supplierId;
    }
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
        const { name, description, quantity } = req.body;
        if (!name || !description || quantity === undefined) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const item = new Item(name, description, quantity);
        itemStorage.insert(item.id, item);
        res.json(item);
    });

    // Endpoint to create a supplier
    app.post("/suppliers", (req, res) => {
        const { name, contactInfo } = req.body;
        if (!name || !contactInfo) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const supplier = new Supplier(name, contactInfo);
        supplierStorage.insert(supplier.id, supplier);
        res.json(supplier);
    });

    // Endpoint to create an order
    app.post("/orders", (req, res) => {
        const { itemId, quantity, supplierId } = req.body;
        if (!itemId || quantity === undefined || !supplierId) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const order = new Order(itemId, quantity, supplierId);
        orderStorage.insert(order.id, order);
        res.json(order);
    });

    // Start the server
    return app.listen();
});

// Function to get the current date
function getCurrentDate() {
    const timestamp = ic.time();
    return new Date(timestamp / 1000000);
}
