# MERN Lab Task 1: CRUD Operations with Express and Vanilla JS

A lightweight, modern full-stack web application that performs Create, Read, Update, and Delete (CRUD) operations on an array of items.

## 🚀 Features
* **Backend:** Node.js & Express REST API with in-memory array data storage.
* **Frontend:** Clean Vanilla JavaScript, HTML5, and modern responsive CSS.
* **Operations Supported:**
  * **Create:** Add new items with Name and Price.
  * **Read:** Display items in real-time in a structured data table.
  * **Update:** Click Edit to populate the form and update existing item values.
  * **Delete:** Remove items with confirmation.

---

## 🛠️ Project Structure
```text
├── server.js              # Express backend server & REST API
├── package.json           # Node project manifest & dependencies
├── .gitignore             # Ignored directories (node_modules, etc.)
└── public/
    ├── index.html         # Frontend layout
    ├── style.css          # Modern dashboard UI styling
    └── script.js          # Client-side fetch logic
```

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
node server.js
```

### 3. Open in Browser
Visit **http://localhost:3000** in your browser.

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/items` | Fetch all items |
| `POST` | `/items` | Add a new item (`{ name, price }`) |
| `PUT` | `/items/:id` | Update an existing item by ID |
| `DELETE` | `/items/:id` | Remove an item by ID |
