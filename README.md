# E-Commerce-Backend
E-Commerce backend with JWT-based authentication. Users can register, log in, view products, and place orders. Admins can manage products (CRUD) and update order statuses. APIs for products and orders are secured, with bcrypt for password hashing. Includes unit tests using Mocha and Postman for API testing.

# Features
User authentication (register, login, JWT token-based access) <br>
Product management (create, update, delete products) <br>
Browse products (for all users)  <br>
Place and manage orders <br>
MongoDB database integration <br>

# Technologies Used
Node.js with Express.js for the backend <br>
MongoDB for the database <br>
JWT for user authentication <br>

# Prerequisites
Node.js (v14 or higher) <br>
MongoDB (or access to a MongoDB Atlas instance) <br>
Postman for API testing <br>

# Setup Instructions

Clone the repository:
git clone 

Navigate to the project directory:
cd e-commerce-backend

Install the dependencies:
npm install

Create a .env file in the root directory and add the following environment variables: <br>
PORT=5000 <br>
MONGO_URI=your_mongo_database_uri <br>
JWT_SECRET=your_secret_key <br>

Start the server:
npm start

The server should now be running on http://localhost:5000


# API Endpoints

Postman Collection
To make API testing easier, a Postman collection is available for import.

Download the Postman collection JSON file from the repository
Postman Collection JSON: E commerce backend.postman_collection.json

You can also import the collection using the following link:
Postman Collection Link: https://api.postman.com/collections/38295206-80dcb74c-1044-4188-b8d1-503a6388c9c0?access_key=PMAT-01J7KN4YX3SKS35K257RGJGT5T
Import the JSON file or use the link to directly import the collection into Postman.

After importing, ensure to set the JWT token in the Postman collection's environment for endpoints that require authentication (such as product management or order placement).
