CREATE DATABASE  IF NOT EXISTS `video_portal` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `video_portal`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: video_portal
-- ------------------------------------------------------
-- Server version	8.0.33

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
-- Table structure for table `__EFMigrationsHistory`
--

DROP TABLE IF EXISTS `__EFMigrationsHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `__EFMigrationsHistory` (
  `MigrationId` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ProductVersion` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`MigrationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `__EFMigrationsHistory`
--

LOCK TABLES `__EFMigrationsHistory` WRITE;
/*!40000 ALTER TABLE `__EFMigrationsHistory` DISABLE KEYS */;
INSERT INTO `__EFMigrationsHistory` VALUES ('20230406215619_begin','7.0.4'),('20230406215858_video-channel-required','7.0.4'),('20230407213345_Add-video-fulltext-indexes','7.0.4'),('20230409200959_Add-ChannelUserSpecificInfo','7.0.4'),('20230416204822_comments_user_roles','7.0.4'),('20230527211350_tagy','7.0.4'),('20230527212408_tag-definition','7.0.4'),('20230603195000_static-roles-ids','7.0.4'),('20230604184739_playlist','7.0.4'),('20230604194908_playlist-aditional-attrs','7.0.4'),('20230604204219_playlist-aditional-attrs-owner','7.0.4'),('20230607200325_playlist-channelId-optional','7.0.4'),('20230608220433_playlist-video-many-many','7.0.4'),('20230612203458_channel-advanced-info-one-to-one','7.0.4'),('20230612204125_channel-advanced-info-one-to-one-second-try','7.0.4');
/*!40000 ALTER TABLE `__EFMigrationsHistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AspNetRoleClaims`
--

DROP TABLE IF EXISTS `AspNetRoleClaims`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AspNetRoleClaims` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `RoleId` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `ClaimType` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `ClaimValue` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`Id`),
  KEY `IX_AspNetRoleClaims_RoleId` (`RoleId`),
  CONSTRAINT `FK_AspNetRoleClaims_AspNetRoles_RoleId` FOREIGN KEY (`RoleId`) REFERENCES `AspNetRoles` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AspNetRoleClaims`
--

LOCK TABLES `AspNetRoleClaims` WRITE;
/*!40000 ALTER TABLE `AspNetRoleClaims` DISABLE KEYS */;
/*!40000 ALTER TABLE `AspNetRoleClaims` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AspNetRoles`
--

DROP TABLE IF EXISTS `AspNetRoles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AspNetRoles` (
  `Id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `Name` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `NormalizedName` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `ConcurrencyStamp` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `RoleNameIndex` (`NormalizedName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AspNetRoles`
--

LOCK TABLES `AspNetRoles` WRITE;
/*!40000 ALTER TABLE `AspNetRoles` DISABLE KEYS */;
INSERT INTO `AspNetRoles` VALUES ('3ac3367c-f9ff-44d9-be8f-8bdc5377fa46','Editor','EDITOR','1bb098ef-f313-4820-9424-d6d0bb0ecb4b'),('df782ef4-097c-4bc5-9ee3-e65f1863fcf8','User','USER','ee8ad545-548a-49f1-875c-54c2305feaa2'),('ef1279c9-4e92-447f-8617-924e536be6f1','Admin','ADMIN','d186309d-bf24-4f68-81da-b1dc8dd3f19e');
/*!40000 ALTER TABLE `AspNetRoles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AspNetUserClaims`
--

DROP TABLE IF EXISTS `AspNetUserClaims`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AspNetUserClaims` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UserId` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `ClaimType` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `ClaimValue` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`Id`),
  KEY `IX_AspNetUserClaims_UserId` (`UserId`),
  CONSTRAINT `FK_AspNetUserClaims_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `AspNetUsers` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AspNetUserClaims`
--

LOCK TABLES `AspNetUserClaims` WRITE;
/*!40000 ALTER TABLE `AspNetUserClaims` DISABLE KEYS */;
/*!40000 ALTER TABLE `AspNetUserClaims` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AspNetUserLogins`
--

DROP TABLE IF EXISTS `AspNetUserLogins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AspNetUserLogins` (
  `LoginProvider` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ProviderKey` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ProviderDisplayName` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `UserId` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  PRIMARY KEY (`LoginProvider`,`ProviderKey`),
  KEY `IX_AspNetUserLogins_UserId` (`UserId`),
  CONSTRAINT `FK_AspNetUserLogins_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `AspNetUsers` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AspNetUserLogins`
--

LOCK TABLES `AspNetUserLogins` WRITE;
/*!40000 ALTER TABLE `AspNetUserLogins` DISABLE KEYS */;
/*!40000 ALTER TABLE `AspNetUserLogins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AspNetUserRoles`
--

DROP TABLE IF EXISTS `AspNetUserRoles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AspNetUserRoles` (
  `UserId` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `RoleId` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  PRIMARY KEY (`UserId`,`RoleId`),
  KEY `IX_AspNetUserRoles_RoleId` (`RoleId`),
  CONSTRAINT `FK_AspNetUserRoles_AspNetRoles_RoleId` FOREIGN KEY (`RoleId`) REFERENCES `AspNetRoles` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_AspNetUserRoles_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `AspNetUsers` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AspNetUserRoles`
--

LOCK TABLES `AspNetUserRoles` WRITE;
/*!40000 ALTER TABLE `AspNetUserRoles` DISABLE KEYS */;
INSERT INTO `AspNetUserRoles` VALUES ('08db3fc3-336e-4978-88cb-5cc4b3382e68','3ac3367c-f9ff-44d9-be8f-8bdc5377fa46'),('08db475e-b482-42f0-8f41-de91bd7500e2','3ac3367c-f9ff-44d9-be8f-8bdc5377fa46'),('08db6e97-965f-41d6-83d4-26d02dfc3258','3ac3367c-f9ff-44d9-be8f-8bdc5377fa46'),('08db6f5a-e199-4e0c-8463-316f7bb08577','3ac3367c-f9ff-44d9-be8f-8bdc5377fa46'),('08db3fc3-336e-4978-88cb-5cc4b3382e68','df782ef4-097c-4bc5-9ee3-e65f1863fcf8'),('08db475e-b482-42f0-8f41-de91bd7500e2','df782ef4-097c-4bc5-9ee3-e65f1863fcf8'),('08db6e97-965f-41d6-83d4-26d02dfc3258','df782ef4-097c-4bc5-9ee3-e65f1863fcf8'),('08db6f58-137f-4966-8c19-07966567b1d9','df782ef4-097c-4bc5-9ee3-e65f1863fcf8'),('08db6f5a-e199-4e0c-8463-316f7bb08577','df782ef4-097c-4bc5-9ee3-e65f1863fcf8'),('08db875d-cadd-4dca-88d5-5193ca5a9b2a','df782ef4-097c-4bc5-9ee3-e65f1863fcf8'),('08db875d-cadd-4dca-88d5-5193ca5a9b2a','ef1279c9-4e92-447f-8617-924e536be6f1');
/*!40000 ALTER TABLE `AspNetUserRoles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AspNetUsers`
--

DROP TABLE IF EXISTS `AspNetUsers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AspNetUsers` (
  `Id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Initials` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Roles_User` tinyint(1) NOT NULL,
  `Roles_VideoEditor` tinyint(1) NOT NULL,
  `Roles_Administrator` tinyint(1) NOT NULL,
  `UserName` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `NormalizedUserName` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Email` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `NormalizedEmail` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `EmailConfirmed` tinyint(1) NOT NULL,
  `PasswordHash` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `SecurityStamp` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `ConcurrencyStamp` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `PhoneNumber` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `PhoneNumberConfirmed` tinyint(1) NOT NULL,
  `TwoFactorEnabled` tinyint(1) NOT NULL,
  `LockoutEnd` datetime(6) DEFAULT NULL,
  `LockoutEnabled` tinyint(1) NOT NULL,
  `AccessFailedCount` int NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `UserNameIndex` (`NormalizedUserName`),
  KEY `EmailIndex` (`NormalizedEmail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AspNetUsers`
--

LOCK TABLES `AspNetUsers` WRITE;
/*!40000 ALTER TABLE `AspNetUsers` DISABLE KEYS */;
INSERT INTO `AspNetUsers` VALUES ('08db3fc3-336e-4978-88cb-5cc4b3382e68','Lukáš Linhart','LL',1,1,0,'aa@tt.cc','AA@TT.CC','aa@tt.cc','AA@TT.CC',0,'AQAAAAEAACcQAAAAEGXg+6w8dUsCvXH6lJI0n/HTdOCml9/spffE8TS6TquEJhDdF/LPi2QhGiX7bjDwVQ==','AMQ3UCKCSJ7XSL2B2P2XG4SLEEXNSSQ3','844cc820-e3cb-4187-878f-770fc02c3667',NULL,0,0,NULL,1,0),('08db475e-b482-42f0-8f41-de91bd7500e2','Adam','Ad',1,1,0,'adam@cc.cc','ADAM@CC.CC','adam@cc.cc','ADAM@CC.CC',0,'AQAAAAEAACcQAAAAEAImNhHktXvp/9gaToST5isPcyAIkgJKQE3N7CqSPZ+V+3NXyVK1QKmC/lOjo61KGg==','PQE5X57MNWEO6FSZBQBYV5GS7VCUPAG7','53f5db3e-e1e8-47bb-a4b9-f5c0eab4fb8d',NULL,0,0,NULL,1,0),('08db6e97-965f-41d6-83d4-26d02dfc3258','Univerzita Palackého v Olomouci','UP',1,1,0,'upol@upol.cz','UPOL@UPOL.CZ','upol@upol.cz','UPOL@UPOL.CZ',0,'AQAAAAEAACcQAAAAEGQHnxumkZQy/wddFcNYPk7NaOrrrrq9P32kewyxUFEd02BQwjBI//ivRmf45GsY/Q==','2P47O7FMSB7TEKQHDUJIBAD6PWD5WB7J','d624c818-4c88-4a1c-a8a6-440c3b0ae3c3',NULL,0,0,NULL,1,0),('08db6f58-137f-4966-8c19-07966567b1d9','Pan Panoušek','PP',1,0,0,'papouch@pap.cz','PAPOUCH@PAP.CZ','papouch@pap.cz','PAPOUCH@PAP.CZ',0,'AQAAAAEAACcQAAAAEBU4C0ZFABJZiPY8eFOxK0nJAUxjEOvB3ayDtqeAVFJzgMO+wADulhoyTnCxjy0CXg==','VU5UQFHMT5TZT5QT3TJKQJVOWSI2UZZW','f075fd4f-5f0a-4209-8806-8d32940c4875',NULL,0,0,NULL,1,0),('08db6f5a-e199-4e0c-8463-316f7bb08577','Nyan','Ny',1,1,0,'Nyan@cat.cz','NYAN@CAT.CZ','Nyan@cat.cz','NYAN@CAT.CZ',0,'AQAAAAEAACcQAAAAEEP/Bk7g0OTLuKxGIqEToce9V68CNAgz1VXyTOC5hxt8EGEJpZatM5FE/BjqhxjdTQ==','K54C6SGH3SGR46RDO2Z2PRID3SJALX3Q','0b126538-7d02-4119-9fb3-b14d49c4f3ac',NULL,0,0,NULL,1,0),('08db875d-cadd-4dca-88d5-5193ca5a9b2a','Administrátor','A',1,0,1,'admin@admin.cz','ADMIN@ADMIN.CZ','admin@admin.cz','ADMIN@ADMIN.CZ',0,'AQAAAAEAACcQAAAAEJlKwZQZH6piChO/V572GXpUJ3fWWuAmG2RKaeAqZdKTfeoeSVWaSY+h3suM/Wxlrw==','256D5ZNTMS5XZ3VNTMW3FSFSHWBPARV7','bdba5f95-6acb-4fc2-a5f9-68e8824dff8c',NULL,0,0,NULL,1,0);
/*!40000 ALTER TABLE `AspNetUsers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AspNetUserTokens`
--

DROP TABLE IF EXISTS `AspNetUserTokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AspNetUserTokens` (
  `UserId` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `LoginProvider` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`UserId`,`LoginProvider`,`Name`),
  CONSTRAINT `FK_AspNetUserTokens_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `AspNetUsers` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AspNetUserTokens`
--

LOCK TABLES `AspNetUserTokens` WRITE;
/*!40000 ALTER TABLE `AspNetUserTokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `AspNetUserTokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ChannelAdvancedInfos`
--

DROP TABLE IF EXISTS `ChannelAdvancedInfos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ChannelAdvancedInfos` (
  `Id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `ChannelId` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `DateOfRegistration` datetime(6) NOT NULL,
  `Email` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `IX_ChannelAdvancedInfos_ChannelId` (`ChannelId`),
  CONSTRAINT `FK_ChannelAdvancedInfos_Channels_ChannelId` FOREIGN KEY (`ChannelId`) REFERENCES `Channels` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ChannelAdvancedInfos`
--

LOCK TABLES `ChannelAdvancedInfos` WRITE;
/*!40000 ALTER TABLE `ChannelAdvancedInfos` DISABLE KEYS */;
INSERT INTO `ChannelAdvancedInfos` VALUES ('08db5260-b2fe-4969-852b-0e7e0364a815','08db49bd-50bc-4ad7-8ac1-07e56308bfca','asd','2023-05-11 20:45:47.641257','aa@tt.cc'),('08db6e99-7794-4c26-8388-0b017f0e4192','08db6e99-7793-4749-8f99-bb6d63ea2f6e','Univerzita Palackého v Olomouci','2023-06-16 18:42:41.827684','upol@upol.cz'),('08db6ea0-3471-4887-8421-f5e76c7e2cea','08db6ea0-3471-4781-873f-8c57686d7081','Kanál který obsahuje záznamy z konferencí konaných/organizovaných univerzitou.','2023-06-16 19:30:55.673514','upol@upol.cz'),('08db6ea2-5770-4786-86b7-2e4be8d8e591','08db6ea2-5770-4741-8bab-217b3692b21b','?☕','2023-06-16 19:46:13.380290','upol@upol.cz'),('08db6f5b-88d0-412f-8871-5e005b242846','08db6f5b-88cf-4356-86e5-80265e7873ad','cat','2023-06-17 17:51:53.107280','Nyan@cat.cz');
/*!40000 ALTER TABLE `ChannelAdvancedInfos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Channels`
--

DROP TABLE IF EXISTS `Channels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Channels` (
  `Id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `IdOwner` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `ChannelAdvancedInfoId` char(36) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `SubscribersCount` bigint NOT NULL,
  `PosterUrl` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `PinnedVideoId` char(36) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `AvatarUrl` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`Id`),
  KEY `IX_Channels_ChannelAdvancedInfoId` (`ChannelAdvancedInfoId`),
  KEY `IX_Channels_IdOwner` (`IdOwner`),
  KEY `IX_Channels_PinnedVideoId` (`PinnedVideoId`),
  CONSTRAINT `FK_Channels_AspNetUsers_IdOwner` FOREIGN KEY (`IdOwner`) REFERENCES `AspNetUsers` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_Channels_ChannelAdvancedInfos_ChannelAdvancedInfoId` FOREIGN KEY (`ChannelAdvancedInfoId`) REFERENCES `ChannelAdvancedInfos` (`Id`),
  CONSTRAINT `FK_Channels_Videos_PinnedVideoId` FOREIGN KEY (`PinnedVideoId`) REFERENCES `Videos` (`Id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Channels`
--

LOCK TABLES `Channels` WRITE;
/*!40000 ALTER TABLE `Channels` DISABLE KEYS */;
INSERT INTO `Channels` VALUES ('08db49bd-50bc-4ad7-8ac1-07e56308bfca','08db3fc3-336e-4978-88cb-5cc4b3382e68','08db5260-b2fe-4969-852b-0e7e0364a815','Nový kanál',1,NULL,NULL,'images\\Nový kanál2fd81429-8497-489c-9a09-cd5873f72bcb.png'),('08db6e99-7793-4749-8f99-bb6d63ea2f6e','08db6e97-965f-41d6-83d4-26d02dfc3258',NULL,'UPOL',0,'images\\UPOL78c64360-4ead-4842-9c43-50a90c033df2.jpg',NULL,'images\\UPOL58a4aaa5-a490-407c-a19d-7ccfe92241d7.png'),('08db6ea0-3471-4781-873f-8c57686d7081','08db6e97-965f-41d6-83d4-26d02dfc3258','08db6e99-7794-4c26-8388-0b017f0e4192','UPOL - Konference',0,NULL,NULL,'images\\UPOL - Konference03b4a29d-9ba4-4757-b491-9af4d5d7e7c7.png'),('08db6ea2-5770-4741-8bab-217b3692b21b','08db6e97-965f-41d6-83d4-26d02dfc3258','08db6e99-7794-4c26-8388-0b017f0e4192','UPOL - Cafeterie',0,'images\\UPOL - Cafeterie9c55d4bd-221c-43a5-a2ab-a40b19cc2305.png',NULL,'images\\UPOL - Cafeterie0fb4e6cb-42ae-4e36-8138-56de3a8112d7.png'),('08db6f5b-88cf-4356-86e5-80265e7873ad','08db6f5a-e199-4e0c-8463-316f7bb08577',NULL,'Nyan',0,NULL,NULL,'images\\Nyanb29b95ca-9e7d-4aae-976c-76eead3f0943.png');
/*!40000 ALTER TABLE `Channels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ChannelUserSpecificInfos`
--

DROP TABLE IF EXISTS `ChannelUserSpecificInfos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ChannelUserSpecificInfos` (
  `Id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `ChannelId` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `UserId` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `Subscribed` tinyint(1) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ChannelUserSpecificInfos`
--

LOCK TABLES `ChannelUserSpecificInfos` WRITE;
/*!40000 ALTER TABLE `ChannelUserSpecificInfos` DISABLE KEYS */;
INSERT INTO `ChannelUserSpecificInfos` VALUES ('08db53ea-e658-4307-87f4-052d24b954c5','08db5260-b2fb-4b93-8683-ed550d3f1ee1','08db400f-05e3-4ba1-8960-e67968dd0983',1),('08db6d17-f0c9-4116-8df1-ef76e3e89972','08db49bd-50bc-4ad7-8ac1-07e56308bfca','08db3fc3-336e-4978-88cb-5cc4b3382e68',1);
/*!40000 ALTER TABLE `ChannelUserSpecificInfos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Comment`
--

DROP TABLE IF EXISTS `Comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Comment` (
  `Id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `UserId` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `VideoId` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `Text` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Created` datetime(6) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_Comment_UserId` (`UserId`),
  CONSTRAINT `FK_Comment_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `AspNetUsers` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Comment`
--

LOCK TABLES `Comment` WRITE;
/*!40000 ALTER TABLE `Comment` DISABLE KEYS */;
INSERT INTO `Comment` VALUES ('08db597a-5a03-4f6a-8e35-5bb8aa1d3d76','08db3fc3-336e-4978-88cb-5cc4b3382e68','08db4e73-7598-44af-829a-8200d7155333','Super :) jen tak dál <3 ','2023-05-20 23:37:03.376385'),('08db59cf-b4fd-4c5f-8e19-fc6095f0e0fa','08db400f-05e3-4ba1-8960-e67968dd0983','08db4e73-7598-44af-829a-8200d7155333','asd','2023-05-21 09:48:03.267863'),('08db5a33-72cf-45aa-8296-b473e461a23a','08db400f-05e3-4ba1-8960-e67968dd0983','08db4e73-7598-44af-829a-8200d7155333','lalala','2023-05-21 21:42:01.875129'),('08db6b7e-896f-47ef-87ce-2f81becf7f33','08db3fc3-336e-4978-88cb-5cc4b3382e68','08db646e-b419-432f-88a1-3e97024c35b7','nový koment','2023-06-12 21:52:21.886378'),('08db6d13-2c12-4b5a-8652-146d139ed9f0','08db3fc3-336e-4978-88cb-5cc4b3382e68','08db646e-b419-432f-88a1-3e97024c35b7','ahoj\n','2023-06-14 22:08:51.409138'),('08db77e6-d0b2-4892-8bc2-ee99ac317b51','08db3fc3-336e-4978-88cb-5cc4b3382e68','08db71cc-058c-402f-8cef-64cc94735804','Super video :)','2023-06-28 16:49:03.046959'),('08db77e7-890d-4064-8443-e2562b353390','08db3fc3-336e-4978-88cb-5cc4b3382e68','08db71cc-058c-402f-8cef-64cc94735804','Komentování videí mě moc baví ;)','2023-06-28 16:54:12.353580'),('08db77e7-90fb-409e-8706-e63d6971aea5','08db3fc3-336e-4978-88cb-5cc4b3382e68','08db71cc-058c-402f-8cef-64cc94735804','První <3','2023-06-28 16:54:25.657434');
/*!40000 ALTER TABLE `Comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Playlists`
--

DROP TABLE IF EXISTS `Playlists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Playlists` (
  `Id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `ThumbnailUrl` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `IdOwner` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `ChannelId` char(36) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `CreatedTimestamp` datetime(6) NOT NULL DEFAULT '0001-01-01 00:00:00.000000',
  PRIMARY KEY (`Id`),
  KEY `IX_Playlists_IdOwner` (`IdOwner`),
  KEY `IX_Playlists_ChannelId` (`ChannelId`),
  CONSTRAINT `FK_Playlists_AspNetUsers_IdOwner` FOREIGN KEY (`IdOwner`) REFERENCES `AspNetUsers` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_Playlists_Channels_ChannelId` FOREIGN KEY (`ChannelId`) REFERENCES `Channels` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Playlists`
--

LOCK TABLES `Playlists` WRITE;
/*!40000 ALTER TABLE `Playlists` DISABLE KEYS */;
INSERT INTO `Playlists` VALUES ('08db6b5c-c089-4365-8f56-acc4d9be6ed1','playlist ke smazání','smazací playlist',NULL,'08db3fc3-336e-4978-88cb-5cc4b3382e68','08db49bd-50bc-4ad7-8ac1-07e56308bfca','2023-06-12 15:50:31.434622'),('08db6d08-c8ac-4989-8ad8-2d71f60bfed8','prázdný','playlist',NULL,'08db3fc3-336e-4978-88cb-5cc4b3382e68','08db49bd-50bc-4ad7-8ac1-07e56308bfca','2023-06-14 18:54:29.610166');
/*!40000 ALTER TABLE `Playlists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PlaylistVideo`
--

DROP TABLE IF EXISTS `PlaylistVideo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PlaylistVideo` (
  `PlaylistsId` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `VideosId` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  PRIMARY KEY (`PlaylistsId`,`VideosId`),
  KEY `IX_PlaylistVideo_VideosId` (`VideosId`),
  CONSTRAINT `FK_PlaylistVideo_Playlists_PlaylistsId` FOREIGN KEY (`PlaylistsId`) REFERENCES `Playlists` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_PlaylistVideo_Videos_VideosId` FOREIGN KEY (`VideosId`) REFERENCES `Videos` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PlaylistVideo`
--

LOCK TABLES `PlaylistVideo` WRITE;
/*!40000 ALTER TABLE `PlaylistVideo` DISABLE KEYS */;
/*!40000 ALTER TABLE `PlaylistVideo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Tags`
--

DROP TABLE IF EXISTS `Tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Tags` (
  `Id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tags`
--

LOCK TABLES `Tags` WRITE;
/*!40000 ALTER TABLE `Tags` DISABLE KEYS */;
INSERT INTO `Tags` VALUES ('08db71ba-a4ab-4579-8849-b2fd8e9558c9','Zábava'),('08db71cb-ba39-47bf-8cdc-2d959e5731d9','Káva'),('08db71cc-e797-40a4-81af-92c3977537b7','Aldebaran');
/*!40000 ALTER TABLE `Tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TagVideo`
--

DROP TABLE IF EXISTS `TagVideo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TagVideo` (
  `TagsId` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `VideosId` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  PRIMARY KEY (`TagsId`,`VideosId`),
  KEY `IX_TagVideo_VideosId` (`VideosId`),
  CONSTRAINT `FK_TagVideo_Tags_TagsId` FOREIGN KEY (`TagsId`) REFERENCES `Tags` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_TagVideo_Videos_VideosId` FOREIGN KEY (`VideosId`) REFERENCES `Videos` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TagVideo`
--

LOCK TABLES `TagVideo` WRITE;
/*!40000 ALTER TABLE `TagVideo` DISABLE KEYS */;
INSERT INTO `TagVideo` VALUES ('08db71ba-a4ab-4579-8849-b2fd8e9558c9','08db6f5b-9fcd-4501-87f1-3404486ff206'),('08db71cb-ba39-47bf-8cdc-2d959e5731d9','08db71cb-e784-4ff1-8e13-c5f276e0bc44'),('08db71cb-ba39-47bf-8cdc-2d959e5731d9','08db71cc-058c-402f-8cef-64cc94735804'),('08db71cb-ba39-47bf-8cdc-2d959e5731d9','08db71cc-407e-4c92-84f9-dfc237cc9e91'),('08db71ba-a4ab-4579-8849-b2fd8e9558c9','08db71cc-8f77-424a-8d8b-f7d103ee0140');
/*!40000 ALTER TABLE `TagVideo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserVideoStats`
--

DROP TABLE IF EXISTS `UserVideoStats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserVideoStats` (
  `UserId` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `VideoId` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `Like` tinyint(1) NOT NULL,
  `Dislike` tinyint(1) NOT NULL,
  `AddedToPlaylist` tinyint(1) NOT NULL,
  `TimeWatchedSec` int NOT NULL,
  PRIMARY KEY (`UserId`,`VideoId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserVideoStats`
--

LOCK TABLES `UserVideoStats` WRITE;
/*!40000 ALTER TABLE `UserVideoStats` DISABLE KEYS */;
INSERT INTO `UserVideoStats` VALUES ('08db3fc3-336e-4978-88cb-5cc4b3382e68','08db4e73-7598-44af-829a-8200d7155333',0,1,0,0),('08db3fc3-336e-4978-88cb-5cc4b3382e68','08db4e74-579e-4970-8dfb-4e487631a530',0,1,0,40),('08db3fc3-336e-4978-88cb-5cc4b3382e68','08db646e-b419-432f-88a1-3e97024c35b7',1,0,0,0),('08db3fc3-336e-4978-88cb-5cc4b3382e68','08db71cc-8f77-424a-8d8b-f7d103ee0140',1,0,0,0),('08db3fc3-336e-4978-88cb-5cc4b3382e68','08db720e-b53d-40ae-8cbc-b387aa7b2c16',0,0,0,190),('08db400f-05e3-4ba1-8960-e67968dd0983','08db4e74-579e-4970-8dfb-4e487631a530',0,0,0,20),('08db6e97-965f-41d6-83d4-26d02dfc3258','08db71cc-8f77-424a-8d8b-f7d103ee0140',0,0,0,30),('08db6e97-965f-41d6-83d4-26d02dfc3258','08db720e-b53d-40ae-8cbc-b387aa7b2c16',0,0,0,1280),('08db6f5a-e199-4e0c-8463-316f7bb08577','08db6f5b-9fcd-4501-87f1-3404486ff206',0,0,0,10);
/*!40000 ALTER TABLE `UserVideoStats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Videos`
--

DROP TABLE IF EXISTS `Videos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Videos` (
  `Id` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ImageUrl` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Duration` time(6) NOT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `DataUrl` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `LikeCount` int NOT NULL,
  `DislikeCount` int NOT NULL,
  `Views` int NOT NULL,
  `UploadTimestamp` datetime(6) NOT NULL,
  `ChannelId` char(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000',
  PRIMARY KEY (`Id`),
  KEY `IX_Videos_ChannelId` (`ChannelId`),
  FULLTEXT KEY `fulltext_name_index` (`Name`),
  FULLTEXT KEY `fulltext_description_index` (`Description`),
  CONSTRAINT `FK_Videos_Channels_ChannelId` FOREIGN KEY (`ChannelId`) REFERENCES `Channels` (`Id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Videos`
--

LOCK TABLES `Videos` WRITE;
/*!40000 ALTER TABLE `Videos` DISABLE KEYS */;
INSERT INTO `Videos` VALUES ('08db6f5b-9fcd-4501-87f1-3404486ff206','Nyan Cat [Original]','thumbnails\\08db6f5b-88cf-4356-86e5-80265e7873ad9ef1b507-2d4b-43d6-a324-4404b4d842ca.png','00:03:36.000000','Nyan Nyan Nyan Nyan','videos\\08db6f5b-88cf-4356-86e5-80265e7873adc84d8d2d-942c-4c22-b216-0d39727b1063.mp4',0,0,0,'2023-06-17 17:52:31.671238','08db6f5b-88cf-4356-86e5-80265e7873ad'),('08db71cb-e784-4ff1-8e13-c5f276e0bc44','Latte art','thumbnails\\08db6ea2-5770-4741-8bab-217b3692b21b842cd6a2-b97b-4d86-87d5-90833463d53e.jpeg','00:09:48.000000','V hrníčku tichounce se skrývá umění,\r\nkouzlo jemného mléka a kávových zrn.\r\nBílá pěna se zrníčky dotýká,\r\nvzniká obrázek, jaký si přál.','videos\\08db6ea2-5770-4741-8bab-217b3692b21bf5e767e8-b001-4e32-b9ed-35f80e1f3d6b.mp4',0,0,0,'2023-06-20 20:21:17.907845','08db6ea2-5770-4741-8bab-217b3692b21b'),('08db71cc-058c-402f-8cef-64cc94735804','Latte art - beginner','thumbnails\\08db6ea2-5770-4741-8bab-217b3692b21b80831f76-b6fa-4fea-8a28-d1c09a7dedca.jpeg','00:07:47.000000','Tak si s láskou vychutnejme tenhle díl,\r\nbílý obraz na kávě nám smysly probudí.\r\nLatte art je umění, co si zaslouží chválu,\r\ndopřejme si ho ať nám denně zpříjemňuje vstávání z postele každé ráno.','videos\\08db6ea2-5770-4741-8bab-217b3692b21b93fa88a9-5011-416d-8afb-b7b791ea8cd0.mp4',0,0,0,'2023-06-20 20:22:08.331201','08db6ea2-5770-4741-8bab-217b3692b21b'),('08db71cc-407e-4c92-84f9-dfc237cc9e91','Latte art - Darth Vader','thumbnails\\08db6ea2-5770-4741-8bab-217b3692b21b6d9ee418-aa4f-4ab9-bacd-e39b5fa8e902.jpeg','00:01:11.000000','Darth Vader vstupuje, temný pán,\r\njeho maska zlo a tajemství skrývá v sobě sám.\r\nKouzelník barista přes mléko a kávu,\r\nvytváří s mistrovstvím jeho tváře kopii.','videos\\08db6ea2-5770-4741-8bab-217b3692b21b1abc4659-6168-48eb-8977-f52137fa8c80.mp4',0,0,0,'2023-06-20 20:23:47.221526','08db6ea2-5770-4741-8bab-217b3692b21b'),('08db71cc-8f77-424a-8d8b-f7d103ee0140','Život na kolejích','thumbnails\\08db6e99-7793-4749-8f99-bb6d63ea2f6edeb34537-3d41-4fb6-81ce-434cb30102c3.jpeg','00:00:54.000000','Rosa na kolejích, v kávové příchuti,\r\nčerstvá a lahodná, jak sladkost v duši.\r\nKávový nápoj, co radost v srdcích budí,\r\nmilovníky kávy po cestách provází.','videos\\08db6e99-7793-4749-8f99-bb6d63ea2f6e429c6943-b379-4b40-8841-4566a204e669.mp4',0,0,0,'2023-06-20 20:25:59.718497','08db6e99-7793-4749-8f99-bb6d63ea2f6e');
/*!40000 ALTER TABLE `Videos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-07-18  9:11:15
