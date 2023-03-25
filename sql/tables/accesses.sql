CREATE TABLE accesses(
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `isEntry` BOOLEAN NOT NULL,
  `clientId` INT NOT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_client FOREIGN KEY (clientId) REFERENCES clients (id)
)