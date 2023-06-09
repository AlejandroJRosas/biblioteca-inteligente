CREATE TABLE clients(
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `qrCodeUrl` VARCHAR(255) NOT NULL,
  `cardId` VARCHAR(255) NOT NULL,
  `userId` INT UNSIGNED,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)