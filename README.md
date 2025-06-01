# Car Dealership API

The Car Dealership API is a backend service designed to manage cars, customers, managers, orders, and categories for a car dealership. It provides endpoints for CRUD operations and includes authentication and authorization mechanisms.

## Features

- **Authentication**: Register and login users.
- **Authorization**: Role-based access control (`customer`, `manager`, `admin`).
- **CRUD Operations**: Manage cars, customers, managers, orders, and categories.
- **Pagination**: Efficient data retrieval with pagination support.
- **Swagger Documentation**: Interactive API documentation available at `/api-docs`.

---

## Prerequisites

Ensure you have the following installed:

- Node.js (v16 or higher)
- npm (v8 or higher)
- MongoDB (running locally or accessible via a URI)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/chizobaebuka/car-dealership-api
cd car-dealership-api
```

### 2. Install Dependencies

Run the following command to install all required dependencies:

```bash
npm run build && npm install
```

---

### 3. Environment Variables

Create a `.env` file in the root directory by copying the provided `.env.sample` file:

```bash
cp .env.sample .env
```

Update the `.env` file with your MongoDB URI and other necessary configurations:

```plaintext
MONGO_URI=your_mongo_dburi connection string
JWT_SECRET=your_jwt_secret
PORT=your_designated_server_port
```

---

### 4. Build the Project

Before starting the server, build the project using TypeScript:

```bash
npm run build
```

---

### 5. Start the Server

Start the server in development mode:

```bash
npm run dev
```

Alternatively, start the server in production mode:

```bash
npm start
```

---

### 6. Test the API

Once the server is running, navigate to the Swagger documentation at:

```
http://localhost:4404/api-docs
```

Use the interactive Swagger UI to test the API endpoints.

---

## API Endpoints

### Authentication

- **POST** `/api/v1/auth/register`: Register a new user.
- **POST** `/api/v1/auth/login`: Login a user.

### Cars

- **GET** `/api/v1/cars`: Get all cars.
- **POST** `/api/v1/cars`: Create a new car (manager or admin only).
- **GET** `/api/v1/cars/{id}`: Get a car by ID.
- **PUT** `/api/v1/cars/{id}`: Update a car by ID (manager or admin only).
- **DELETE** `/api/v1/cars/{id}`: Delete a car by ID (admin only).

### Customers

- **GET** `/api/v1/customers`: Get all customers.
- **POST** `/api/v1/customers`: Create a new customer profile.
- **GET** `/api/v1/customers/{id}`: Get a customer by ID.
- **PUT** `/api/v1/customers/{id}`: Update a customer by ID.
- **DELETE** `/api/v1/customers/{id}`: Delete a customer by ID.

### Managers

- **GET** `/api/v1/managers`: Get all managers.
- **POST** `/api/v1/managers`: Create a new manager profile (admin only).
- **GET** `/api/v1/managers/{id}`: Get a manager by ID.
- **PUT** `/api/v1/managers/{id}`: Update a manager by ID (admin only).
- **DELETE** `/api/v1/managers/{id}`: Delete a manager by ID (admin only).

### Orders

- **GET** `/api/v1/orders`: Get all orders.
- **POST** `/api/v1/orders`: Create a new order (customer only).
- **GET** `/api/v1/orders/{id}`: Get an order by ID.
- **PUT** `/api/v1/orders/{id}`: Update an order by ID.
- **DELETE** `/api/v1/orders/{id}`: Delete an order by ID.

---

## Scripts

- `npm run build`: Compile TypeScript files into JavaScript.
- `npm run dev`: Start the server in development mode.
- `npm start`: Start the server in production mode.
- `npm run lint`: Run ESLint to check for code quality issues.

---

## License

This project is licensed under the MIT License.

---

## Support

For issues or feature requests, please open an issue on the [GitHub repository](https://github.com/chizobaebuka/car-dealership-api/issues).
