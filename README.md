# Machine-round
This project is built using React, PHP, MySQL, Node.js and MongoDB.

The objective of the assignment was to create a system where:

- User can select a database (MySQL / MongoDB)
- Data inserts into the selected database
- Data automatically syncs into the second database
- Duplicate entries are prevented
- Name field remains unique and case-insensitive

---

# Tech Stack

Frontend:
- React JS
- Axios

Backend:
- PHP
- Node.js
- Express.js

Database:
- MySQL
- MongoDB
- Mongoose

---

# Project Structure

```text
project/

├── database/
│   ├── mysql.sql
│   └── mongo.js
│
├── php-api/
│   ├── db.php
│   ├── insert_mysql.php
│   └── sync_mysql.php
│
├── node-api/
│   ├── package.json
│   └── server.js
│
└── frontend/
    └── src/
        └── App.js
```

---

# Database Setup

## MySQL

Run the SQL file:

```text
database/mysql.sql
```

or execute manually:

```sql
CREATE DATABASE machine_round;

USE machine_round;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);
```

---

## MongoDB

Run:

```text
database/mongo
```

or execute manually:

```js
use machine_round

db.users.createIndex(
   { name: 1 },
   { unique: true }
)
```

---

# Running the Project

## 1. Start XAMPP

Start:
- Apache
- MySQL

Place the project folder inside:

```text
htdocs
```

---

## 2. Run Node Server

Go to:

```bash
cd project/node-api
```

Install dependencies:

```bash
npm install
```

Run server:

```bash
node server.js
```

---

## 3. Run React Frontend

Go to:

```bash
cd project/frontend
```

Install dependencies:

```bash
npm install
```

Start frontend:

```bash
npm start
```

Frontend runs on:

```text
http://localhost:3000
```

---

# Application Flow

## When MySQL is selected

```text
Frontend
   ↓
PHP API
   ↓
MySQL Insert
   ↓
MongoDB Sync
```

---

## When MongoDB is selected

```text
Frontend
   ↓
Node API
   ↓
MongoDB Insert
   ↓
MySQL Sync
```

---

# Duplicate Prevention

To avoid duplicate entries:

- Input is converted to lowercase
- trim() is used to remove spaces
- MySQL unique constraint is added
- MongoDB unique index is added
- Validation is handled before insert

Example:

```text
Karan
karan
KARAN
```

All are treated as the same value.

---

# API Endpoints

## PHP API

```text
http://localhost/project/php-api/insert_mysql.php
```

---

## Node API

```text
http://localhost:5000/insert-mongo
```

---

# Notes

- MySQL and MongoDB remain synchronized
- Duplicate entries are prevented from both APIs
- Validation is implemented on both backend services

---

# Author

Karan Singh
