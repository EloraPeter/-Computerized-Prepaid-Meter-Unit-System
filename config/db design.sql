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