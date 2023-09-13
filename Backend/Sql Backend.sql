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


CREATE TABLE admin (
  admin_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT UNIQUE NOT NULL, -- Foreign key to employees table
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add a foreign key constraint to link admin records to employees
ALTER TABLE admin
ADD FOREIGN KEY (employee_id)
REFERENCES employees (employee_id)
ON DELETE CASCADE; -- Optionally, cascade delete if an employee is deleted



ALTER TABLE personal_information
ADD CONSTRAINT fk_employee_personal
FOREIGN KEY (employee_id)
REFERENCES employees(employee_id)
ON DELETE CASCADE;


ALTER TABLE contact_details
DROP FOREIGN KEY contact_details_ibfk_1; -- Remove the existing foreign key constraint

ALTER TABLE contact_details
ADD CONSTRAINT fk_employee_contact
FOREIGN KEY (employee_id)
REFERENCES employees(employee_id)
ON DELETE CASCADE;
ALTER TABLE extra_information
DROP FOREIGN KEY extra_information_ibfk_1; -- Remove the existing foreign key constraint

ALTER TABLE extra_information
ADD CONSTRAINT fk_employee_extra
FOREIGN KEY (employee_id)
REFERENCES employees(employee_id)
ON DELETE CASCADE;

ALTER TABLE employee_skills
DROP FOREIGN KEY employee_skills_ibfk_1; -- Remove the existing foreign key constraint

ALTER TABLE employee_skills
ADD CONSTRAINT fk_employee_skills
FOREIGN KEY (employee_id)
REFERENCES employees(employee_id)
ON DELETE CASCADE;

ALTER TABLE experience
DROP FOREIGN KEY experience_ibfk_1; -- Remove the existing foreign key constraint

ALTER TABLE experience
ADD CONSTRAINT fk_employee_experience
FOREIGN KEY (employee_id)
REFERENCES employees(employee_id)
ON DELETE CASCADE;


ALTER TABLE projects
DROP FOREIGN KEY projects_ibfk_1; -- Remove the existing foreign key constraint

ALTER TABLE projects
ADD CONSTRAINT fk_employee_projects
FOREIGN KEY (employee_id)
REFERENCES employees(employee_id)
ON DELETE CASCADE;

ALTER TABLE contact_details
  ADD FOREIGN KEY (employee_id)
  REFERENCES employees (employee_id)
  ON DELETE CASCADE;

ALTER TABLE personal_information
  ADD FOREIGN KEY (employee_id)
  REFERENCES employees (employee_id)
  ON DELETE CASCADE;



