CREATE TABLE reservations_clients(
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `reservationId` INT UNSIGNED NOT NULL,
  `clientId` INT UNSIGNED NOT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_reservations_clients_reservation FOREIGN KEY (reservationId) REFERENCES reservations (id),
  CONSTRAINT fk_reservations_clients_client FOREIGN KEY (clientId) REFERENCES clients (id)
)