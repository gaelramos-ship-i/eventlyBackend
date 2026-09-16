-- PostgreSQL Script
-- Adaptation du schéma MySQL Workbench

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS mydb;
SET search_path TO mydb;

-- -----------------------------------------------------
-- Table mydb.Users
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS mydb."Users" (
  id_user SERIAL PRIMARY KEY,
  pseudo_user VARCHAR(50) NOT NULL,
  email_user VARCHAR(255) NOT NULL,
  password_user VARCHAR(100) NOT NULL,
  CONSTRAINT email_events_unique UNIQUE (email_user)
);

-- -----------------------------------------------------
-- Table mydb.Events
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS mydb."Events" (
  id_event SERIAL PRIMARY KEY,
  name_event VARCHAR(255) NOT NULL,
  type_event VARCHAR(100) NOT NULL,
  date_event TIMESTAMP NOT NULL,
  address_event VARCHAR(255) NOT NULL,
  description_event TEXT NOT NULL,
  price_event DECIMAL(10,2) NULL,
  fk_id_user INT NOT NULL,
  CONSTRAINT fk_events_users1
    FOREIGN KEY (fk_id_user)
    REFERENCES mydb."Users" (id_user)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

-- Index sur la clé étrangère pour optimiser les jointures
CREATE INDEX IF NOT EXISTS fk_events_users1_idx ON mydb."Events" (fk_id_user);

-- -----------------------------------------------------
-- Table mydb.events has users
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS mydb."events_has_users" (
  fk_id_event INT NOT NULL,
  fk_id_user INT NOT NULL,
  PRIMARY KEY (fk_id_event, fk_id_user),
  CONSTRAINT fk_events_has_users_events
    FOREIGN KEY (fk_id_event)
    REFERENCES mydb."Events" (id_event)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_events_has_users_users1
    FOREIGN KEY (fk_id_user)
    REFERENCES mydb."Users" (id_user)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

-- Index sur la clé étrangère
CREATE INDEX IF NOT EXISTS fk_events_has_users_users1_idx ON mydb."events_has_users" (fk_id_user);