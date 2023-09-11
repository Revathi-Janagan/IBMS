create database IBMS;
use IBMS;


CREATE TABLE `ibms`.`super_admin` (
  `super_admin_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  `phone_number` INT NOT NULL,
  `profile_pic` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`super_admin_id`),
  UNIQUE INDEX `super_admin_id_UNIQUE` (`super_admin_id` ASC) VISIBLE);
CREATE TABLE employees (
  employee_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  profile_pic VARCHAR(255),
  experience VARCHAR(255),
  education VARCHAR(255),
  isAdmin BOOLEAN
);

CREATE TABLE personal_information (
  personal_info_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  dob DATE,
  marital_status VARCHAR(20),
  gender CHAR(10),
  place VARCHAR(255),
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);
CREATE TABLE contact_details (
  contact_details_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  mobile_number VARCHAR(20),
  email VARCHAR(255),
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);
CREATE TABLE extra_information (
  extra_info_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  alternative_phone_number VARCHAR(20),
  physically_challenged BOOLEAN,
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

CREATE TABLE skills (
  skill_id INT AUTO_INCREMENT PRIMARY KEY,
  skill_name VARCHAR(255) UNIQUE
);

CREATE TABLE employee_skills (
  employee_skill_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  skill_id INT,
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
  FOREIGN KEY (skill_id) REFERENCES skills(skill_id)
);
CREATE TABLE experience (
  experience_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  experience_description TEXT,
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);
CREATE TABLE projects (
  project_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  portfolio_url VARCHAR(255),
  github_url VARCHAR(255),
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

SET GLOBAL sql_mode = '';
SET SESSION sql_mode = '';


