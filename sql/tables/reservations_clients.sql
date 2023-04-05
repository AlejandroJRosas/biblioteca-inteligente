CREATE TABLE reservations_clients(
  `id` UNSIGNED INT AUTO_INCREMENT PRIMARY KEY,
  `reservationId` UNSIGNED INT NOT NULL,
  `clientId` UNSIGNED INT NOT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_reservations_clients_reservation FOREIGN KEY (reservationId) REFERENCES reservations (id),
  CONSTRAINT fk_reservations_clients_client FOREIGN KEY (clientId) REFERENCES clients (id)
)