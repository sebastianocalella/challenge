CREATE DATABASE IF NOT EXISTS content_manager;

USE DATABASE content_manager;

CREATE TABLE IF NOT EXISTS content_items (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(1000),
    category VARCHAR(100) NOT NULL,
    language VARCHAR(10) NOT NULL,
    provider VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    file_name VARCHAR(255),
    file_data BYTEA,
    file_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);