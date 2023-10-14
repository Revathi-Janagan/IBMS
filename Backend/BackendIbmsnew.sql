-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: ibms
-- ------------------------------------------------------
-- Server version	8.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `admin_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `employee_id` (`employee_id`),
  CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (3,31,'kayal@gmail.com','$2b$10$pbVf2rHq46StrWOYWlStV.TYCi3s02EMT2mfC0i6GZfkMECrk80bW','2023-09-21 08:11:22','2023-09-21 08:11:22'),(4,32,'kayal123@gmail.com','$2b$10$WxC..dzWil5e0.XitEMvTucePGzqwRyZ2rrxpZA1hak0ggTQSwHhG','2023-09-21 08:12:24','2023-09-21 08:12:24'),(5,35,'velan@gmail.com','$2b$10$7nE8oWKbhicG3iswubN7jerJb1d0QsfLQAhKWD8h2sRDAyO.Lb3T.','2023-09-21 11:36:22','2023-09-21 11:36:22'),(6,36,'pragatheese@gmail.com','$2b$10$SatcKzrU87tVOK5C.ZklKO3Vn2n/ehBESPgsc30y9WM.jcPhj834q','2023-09-21 11:43:00','2023-09-21 11:43:00');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `businessinfo`
--

DROP TABLE IF EXISTS `businessinfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `businessinfo` (
  `customer_id` int NOT NULL,
  `business_place_district` varchar(255) DEFAULT NULL,
  `language` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`customer_id`),
  CONSTRAINT `businessinfo_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `businessinfo`
--

LOCK TABLES `businessinfo` WRITE;
/*!40000 ALTER TABLE `businessinfo` DISABLE KEYS */;
/*!40000 ALTER TABLE `businessinfo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_details`
--

DROP TABLE IF EXISTS `contact_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_details` (
  `contact_details_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int DEFAULT NULL,
  `mobile_number` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`contact_details_id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `contact_details_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_employee_contact` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_details`
--

LOCK TABLES `contact_details` WRITE;
/*!40000 ALTER TABLE `contact_details` DISABLE KEYS */;
INSERT INTO `contact_details` VALUES (30,31,'7894561230','kayal@gmail.com'),(31,32,'7894561230','kayal123@gmail.com'),(32,33,'7894561230','malar123@gmail.com'),(33,34,'7894561230','barane@gmail.com'),(34,35,'7894561230','velan@gmail.com'),(35,36,'7894561230','pragatheese@gmail.com'),(36,37,'7894561230','varan@gmail.com'),(37,38,'7894561230','pandiyan@gmail.com'),(38,39,'7894561230','selvam@gmail.com'),(39,40,'7894561230','selvam@gmail.com'),(40,41,'7894561230','selvam@gmail.com');
/*!40000 ALTER TABLE `contact_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contactdetails`
--

DROP TABLE IF EXISTS `contactdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contactdetails` (
  `customer_id` int NOT NULL,
  `business_number` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`customer_id`),
  CONSTRAINT `contactdetails_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contactdetails`
--

LOCK TABLES `contactdetails` WRITE;
/*!40000 ALTER TABLE `contactdetails` DISABLE KEYS */;
/*!40000 ALTER TABLE `contactdetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `customer_id` int NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(255) DEFAULT NULL,
  `business_name` varchar(255) DEFAULT NULL,
  `business_type` varchar(255) DEFAULT NULL,
  `business_category` varchar(255) DEFAULT NULL,
  `profile_pic` blob,
  PRIMARY KEY (`customer_id`),
  UNIQUE KEY `customer_id` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee_skills`
--

DROP TABLE IF EXISTS `employee_skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee_skills` (
  `employee_skill_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int DEFAULT NULL,
  `skill_id` int DEFAULT NULL,
  PRIMARY KEY (`employee_skill_id`),
  KEY `skill_id` (`skill_id`),
  KEY `fk_employee_skills` (`employee_id`),
  CONSTRAINT `employee_skills_ibfk_2` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`skill_id`),
  CONSTRAINT `fk_employee_skills` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=163 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_skills`
--

LOCK TABLES `employee_skills` WRITE;
/*!40000 ALTER TABLE `employee_skills` DISABLE KEYS */;
INSERT INTO `employee_skills` VALUES (119,31,1),(120,31,2),(121,31,3),(122,31,4),(123,32,1),(124,32,2),(125,32,3),(126,32,4),(127,33,1),(128,33,2),(129,33,3),(130,33,4),(131,34,1),(132,34,2),(133,34,3),(134,34,4),(135,35,1),(136,35,2),(137,35,3),(138,35,4),(139,36,1),(140,36,2),(141,36,3),(142,36,4),(147,38,1),(148,38,2),(149,38,3),(150,38,4),(151,39,1),(152,39,2),(153,39,3),(154,39,4),(155,40,1),(156,40,2),(157,40,3),(158,40,4),(159,41,1),(160,41,2),(161,41,3),(162,41,4);
/*!40000 ALTER TABLE `employee_skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `employee_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `profile_pic` varchar(255) NOT NULL,
  `experience` varchar(255) NOT NULL,
  `designation` varchar(255) NOT NULL,
  `education` varchar(255) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL,
  PRIMARY KEY (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (31,'Kayal ','kayal.jpg','10 years','Software Engineer','Bachelor\'s in Computer Science',1),(32,'KayalVizhi ','kayalvizhi.jpg','10 years','Software Engineer','Bachelor\'s in Computer Science',1),(33,'MalarVizhi ','malar.jpg','10 years','Software Engineer','Bachelor\'s in Computer Science',0),(34,'Barane','barane.jpg','5 years','Software Engineer','Bachelor\'s in Computer Science',0),(35,'Velan','velan.jpg','5 years','Software Engineer','Bachelor\'s in Computer Science',1),(36,'Pragatheese','pragatheese.jpg','5 years','Software Engineer','Bachelor\'s in Computer Science',1),(37,'Varan','varan.jpg','5 years','Software Engineer','Bachelor\'s in Computer Science',0),(38,'Pandiyan','pandiyan.jpg','5 years','Software Engineer','Bachelor\'s in Computer Science',0),(39,'Selvam','selvam.jpg','5 years','Software Engineer','Bachelor\'s in Computer Science',0),(40,'Selvam','selvam.jpg','5 years','Software Engineer','Bachelor\'s in Computer Science',0),(41,'Selvam','selvam.jpg','5 years','Software Engineer','Bachelor\'s in Computer Science',0);
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `experience`
--

DROP TABLE IF EXISTS `experience`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `experience` (
  `experience_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int DEFAULT NULL,
  `experience_description` text,
  PRIMARY KEY (`experience_id`),
  KEY `fk_employee_experience` (`employee_id`),
  CONSTRAINT `fk_employee_experience` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `experience`
--

LOCK TABLES `experience` WRITE;
/*!40000 ALTER TABLE `experience` DISABLE KEYS */;
INSERT INTO `experience` VALUES (25,31,'Worked on various web development projects.'),(26,32,'Worked on various web development projects.'),(27,33,'Worked on various web development projects.'),(28,34,'Worked on various web development projects.'),(29,35,'Worked on various web development projects.'),(30,36,'Worked on various web development projects.'),(31,37,'Worked on various web development projects.'),(32,38,'Worked on various web development projects.'),(33,39,'Worked on various web development projects.'),(34,40,'Worked on various web development projects.'),(35,41,'Worked on various web development projects.');
/*!40000 ALTER TABLE `experience` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `extra_information`
--

DROP TABLE IF EXISTS `extra_information`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `extra_information` (
  `extra_info_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int DEFAULT NULL,
  `alternative_phone_number` varchar(20) DEFAULT NULL,
  `physically_challenged` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`extra_info_id`),
  KEY `fk_employee_extra` (`employee_id`),
  CONSTRAINT `fk_employee_extra` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `extra_information`
--

LOCK TABLES `extra_information` WRITE;
/*!40000 ALTER TABLE `extra_information` DISABLE KEYS */;
INSERT INTO `extra_information` VALUES (30,31,'9874561203',0),(31,32,'9874561203',0),(32,33,'9874561203',0),(33,34,'9874561203',0),(34,35,'9874561203',0),(35,36,'9874561203',0),(36,37,'9874561203',0),(37,38,'9874561203',0),(38,39,'9874561203',0),(39,40,'9874561203',0),(40,41,'9874561203',0);
/*!40000 ALTER TABLE `extra_information` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ownerdetails`
--

DROP TABLE IF EXISTS `ownerdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ownerdetails` (
  `customer_id` int NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`customer_id`),
  CONSTRAINT `ownerdetails_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ownerdetails`
--

LOCK TABLES `ownerdetails` WRITE;
/*!40000 ALTER TABLE `ownerdetails` DISABLE KEYS */;
/*!40000 ALTER TABLE `ownerdetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_information`
--

DROP TABLE IF EXISTS `personal_information`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_information` (
  `personal_info_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `marital_status` varchar(20) DEFAULT NULL,
  `gender` char(10) DEFAULT NULL,
  `place` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`personal_info_id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `fk_employee_personal` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE,
  CONSTRAINT `personal_information_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`),
  CONSTRAINT `personal_information_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_information`
--

LOCK TABLES `personal_information` WRITE;
/*!40000 ALTER TABLE `personal_information` DISABLE KEYS */;
INSERT INTO `personal_information` VALUES (30,31,'1998-01-15','Married','Male','Salem'),(31,32,'1998-01-15','Married','Male','Salem'),(32,33,'1998-01-15','Married','Male','Salem'),(33,34,'1998-01-15','Married','Male','Salem'),(34,35,'1998-01-15','Married','Male','Salem'),(35,36,'1998-01-15','Married','Male','Salem'),(36,37,'1998-01-14','Married','Male','Salem Dt'),(37,38,'1998-01-15','Married','Male','Salem'),(38,39,'1998-01-15','Married','Male','Salem'),(39,40,'1998-01-15','Married','Male','Salem'),(40,41,'1998-01-15','Married','Male','Salem');
/*!40000 ALTER TABLE `personal_information` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `project_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int DEFAULT NULL,
  `portfolio_url` varchar(255) DEFAULT NULL,
  `github_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`project_id`),
  KEY `fk_employee_projects` (`employee_id`),
  CONSTRAINT `fk_employee_projects` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (18,31,'Mani.com','Mani.com'),(19,32,'Mani.com','Mani.com'),(20,33,'Mani.com','Mani.com'),(21,34,'Mani.com','Mani.com'),(22,35,'Mani.com','Mani.com'),(23,36,'Mani.com','Mani.com'),(24,37,'Mani.com','Mani.com'),(25,38,'Mani.com','Mani.com'),(26,39,'Mani.com','Mani.com'),(27,40,'Mani.com','Mani.com'),(28,41,'Mani.com','Mani.com');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skills`
--

DROP TABLE IF EXISTS `skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `skills` (
  `skill_id` int NOT NULL AUTO_INCREMENT,
  `skill_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`skill_id`),
  UNIQUE KEY `skill_name` (`skill_name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skills`
--

LOCK TABLES `skills` WRITE;
/*!40000 ALTER TABLE `skills` DISABLE KEYS */;
INSERT INTO `skills` VALUES (6,'HTML'),(1,'JavaScript'),(7,'JS'),(3,'Node.js'),(2,'React'),(5,'React JS'),(4,'SQL');
/*!40000 ALTER TABLE `skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `socialmedialinks`
--

DROP TABLE IF EXISTS `socialmedialinks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `socialmedialinks` (
  `link_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int DEFAULT NULL,
  `social_media_link` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`link_id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `socialmedialinks_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `socialmedialinks`
--

LOCK TABLES `socialmedialinks` WRITE;
/*!40000 ALTER TABLE `socialmedialinks` DISABLE KEYS */;
/*!40000 ALTER TABLE `socialmedialinks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `super_admin`
--

DROP TABLE IF EXISTS `super_admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `super_admin` (
  `super_admin_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(100) NOT NULL,
  `phone_number` varchar(100) NOT NULL,
  `profile_pic` varchar(255) NOT NULL,
  PRIMARY KEY (`super_admin_id`),
  UNIQUE KEY `super_admin_id_UNIQUE` (`super_admin_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `super_admin`
--

LOCK TABLES `super_admin` WRITE;
/*!40000 ALTER TABLE `super_admin` DISABLE KEYS */;
INSERT INTO `super_admin` VALUES (10,'Peter','srevathisona@gmail.com','$2b$10$d1jV/V7qLqL.spxKg62Al.zPO6eVmKSTA17Q/nt.BBMwLKUw5BeLK','8527419630','1696491667309-3.jpg');
/*!40000 ALTER TABLE `super_admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `uploadedfiles`
--

DROP TABLE IF EXISTS `uploadedfiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `uploadedfiles` (
  `file_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_content` blob,
  PRIMARY KEY (`file_id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `uploadedfiles_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `uploadedfiles`
--

LOCK TABLES `uploadedfiles` WRITE;
/*!40000 ALTER TABLE `uploadedfiles` DISABLE KEYS */;
/*!40000 ALTER TABLE `uploadedfiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `website`
--

DROP TABLE IF EXISTS `website`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `website` (
  `website_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int DEFAULT NULL,
  `website_address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`website_id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `website_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `website`
--

LOCK TABLES `website` WRITE;
/*!40000 ALTER TABLE `website` DISABLE KEYS */;
/*!40000 ALTER TABLE `website` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'ibms'
--

--
-- Dumping routines for database 'ibms'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-10-14 12:00:16
