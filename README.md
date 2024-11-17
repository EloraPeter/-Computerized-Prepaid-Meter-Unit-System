# -Computerized-Prepaid-Meter-Unit-System
ERD
USECASE DIAGRAM

This project is a prepaid energy meter system that allows users to:

- Sign up and log in to their account.
- View their current energy balance.
- Recharge their energy balance.
- View transaction history.
- Update their profile.

## Features
- Secure user authentication using JWT.
- PostgreSQL database for user data and transactions.
- Responsive frontend using plain HTML, CSS, and JavaScript.

## Tech Stack
- **Backend**: Node.js, Express.js, PostgreSQL
- **Frontend**: HTML, CSS, JavaScript
- **Authentication**: bcrypt.js, jsonwebtoken

## Folder Structure
project/
├── backend/
│   ├── config/                # Database connection configuration
│   │   └── db.js
│   ├── middleware/            # Middleware for authentication
│   │   └── authMiddleware.js
│   ├── routes/                # API route handlers
│   │   ├── auth.js            # Signup and login routes
│   │   ├── dashboard.js       # User dashboard data routes
│   │   ├── profile.js         # Profile management routes
│   │   ├── transaction.js     # Transaction history routes
│   │   └── recharge.js        # Recharge functionality routes
│   ├── app.js                 # Main server file
│   ├── server.js
│   └── package.json           # Node.js dependencies
├── frontend/
│   ├── assets/                # Static assets like CSS and JavaScript
│   │   ├── css/
│   │   │   └── style.css      # Styles for the frontend
│   │   └── js/
│   │       └── main.js        # Client-side JavaScript for interactions
│   ├── pages/                 # HTML templates for the frontend
│   │   ├── index.html         # Landing page
│   │   ├── signup.html        # Signup page
│   │   ├── login.html         # Login page
│   │   ├── dashboard.html     # User dashboard
│   │   ├── transactions.html  # Transaction history
│   │   ├── recharge.html      # Recharge page
 
│   │   └── profile.html       # Profile management
└── README.md                  # Project documentation


## Setup
1. Clone the repository.
2. Install dependencies: `npm install express jsonwebtoken bcryptjs body-parser cors pg` `npm install -g nodemon`
3. Start the server: `nodemon server.js`
4. Open `frontend/pages/index.html` in your browser.

## Database
Run the following commands to set up the PostgreSQL database:

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE balances (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    kwh_balance FLOAT DEFAULT 20.0,
    PRIMARY KEY (user_id)
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    amount FLOAT NOT NULL,
    kwh FLOAT NOT NULL,
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);
