class ItemsList {
  #itemsListName;
  #items;

  constructor(itemsListName, items) {
    this.#itemsListName = itemsListName;
    this.#items = items;
  }

  displayItems() {
    console.log(`Items List Name: ${this.#itemsListName}`);
    this.#items.forEach(item => {
      console.log(`Name: ${item.name}, Cost: $${item.cost}`);
    });
  }

  generateItemsTable() {
    let table = "<table border=\"2\">";
    table += "<tr><th>Item</th><th>Cost</th></tr>";
    this.#items.forEach(item => {
      table += `<tr><th>${item.name}</th><th>${item.cost.toFixed(2)}</th></tr>`;
    });
    table += "</table>"
    return table;
  }

  generateSelectOptions() {
    let options = "";
    this.#items.forEach(item => {
      options += `<option value=\"${item.name}\">${item.name}</option>`;
    })
    return options;
  }

  generateOrderTable(itemsSelected) {
    let total = 0;
    let table = "<table border=\"2\">";
    table += "<tr><th>Item</th><th>Cost</th></tr>";
    itemsSelected.forEach(selectedItem => {
      this.#items.forEach(item => {
        if(selectedItem === item.name) {
          table += `<tr><th>${item.name}</th><th>${item.cost.toFixed(2)}</th></tr>`;
          total += item.cost;
        }
      });
    });
    table += `<tr><th>Total Cost:</th><th>${total.toFixed(2)}</th></tr>`;
    table += "</table>";
    return table;
  }
}

process.stdin.setEncoding("utf8");

const express = require("express");
const http = require("http");
const path = require("path");
const fs = require("fs");

const portNumber = 5000;


if (process.argv.length !== 3) {
  console.error("Usage supermarketServer.js jsonFile");
  process.exit(1);
}

let itemsList = process.argv[2];
let itemsListNameJSON = "";
let itemsListJSON = "";

// Read the JSON file
fs.readFile(itemsList, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the JSON file:\n', err);
    return;
  }

  // Parse the JSON data
  const parsedData = JSON.parse(data);

  itemsListNameJSON = parsedData.itemsListName;
  itemsListJSON = parsedData.itemsList;

  itemsList = new ItemsList(itemsListNameJSON, itemsListJSON);
  //itemsList.displayItems();
});

const app = express();
const server = http.createServer(app);

app.set("view engine", "ejs");

app.set("views", path.resolve(__dirname, "templates"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index");
});

// Route for displaying items
app.get("/catalog", (req, res) => {
  const itemsTable = {itemsTable: itemsList.generateItemsTable()};
  res.render("displayItems", itemsTable);
});

// Route for placing an order
app.get("/order", (req, res) => {
  const items = {items: itemsList.generateSelectOptions()}
  res.render("placeOrder", items);
});

// Route for order confirmation
app.post("/order", (req, res) => {
  const variables = { name: req.body.name, 
                      email: req.body.email,
                      delivery: req.body.delivery, 
                      orderTable: itemsList.generateOrderTable(req.body.itemsSelected) };
  res.render("orderConfirmation", variables);
});

server.listen(portNumber, (err) => {
  if (err) {
    process.stdout.write("Starting server failed.");
  } else {
    process.stdout.write(
      `Web server started and running at http://localhost:${
        server.address().port
      }\n`
    );

    const prompt = "Type itemsList or stop to shutdown the server: ";
    process.stdout.write(prompt);

    process.stdin.on("readable", function () {
      let dataInput = process.stdin.read();
      if (dataInput !== null) {
        let command = dataInput.trim();
        if (command === "itemsList") {
          console.log(itemsListJSON);
          process.stdout.write(prompt);
          process.stdin.resume();
        } else if (command === "stop") {
          process.stdout.write("Shutting down the server\n");
          process.exit(0);
        } else {
          process.stdout.write("Invalid command: " + command + "\n");
          process.stdout.write(prompt);
          process.stdin.resume();
        }
      }
    });
  }
});
