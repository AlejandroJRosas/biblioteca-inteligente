CREATE TABLE accesses(
  `id` UNSIGNED INT AUTO_INCREMENT PRIMARY KEY,
  `isEntry` BOOLEAN NOT NULL,
  `clientId` UNSIGNED INT NOT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_accesses_clients FOREIGN KEY (clientId) REFERENCES clients (id)
)