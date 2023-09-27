use ibms;
-- Table for Customer Personal Info
CREATE TABLE Customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(255),
    business_name VARCHAR(255),
    business_type VARCHAR(255),
    business_category VARCHAR(255),
    profile_pic BLOB, -- Binary data for the profile picture
    UNIQUE (customer_id)
);

-- Table for Business Information
CREATE TABLE BusinessInfo (
    customer_id INT PRIMARY KEY,
    business_place_district VARCHAR(255),
    language VARCHAR(255),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

-- Table for Contact Details
CREATE TABLE ContactDetails (
    customer_id INT PRIMARY KEY,
    business_number VARCHAR(20),
    email VARCHAR(255),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

-- Table for Owner Details
CREATE TABLE OwnerDetails (
    customer_id INT PRIMARY KEY,
    phone_number VARCHAR(20),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

-- Table for Social Media Links
CREATE TABLE SocialMediaLinks (
    link_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    social_media_link VARCHAR(255),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);


-- Table for Website
CREATE TABLE Website (
    website_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    website_address VARCHAR(255),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

-- Table for Uploaded Files
CREATE TABLE UploadedFiles (
    file_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    file_name VARCHAR(255),
    file_content BLOB, -- Binary data for uploaded files
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

