CREATE SCHEMA IF NOT EXISTS `nexa_careers`;
USE `nexa_careers`;
CREATE TABLE `carrera` (
  `id_carrera` INT NOT NULL AUTO_INCREMENT,
  `carrera`    VARCHAR(255),
  PRIMARY KEY (`id_carrera`)
);

CREATE TABLE `estudiante` (
  `id_estudiante` INT          NOT NULL AUTO_INCREMENT,
  `nombre`        VARCHAR(255),
  `apellido`      VARCHAR(255),
  `telefono`      INT,
  `gmail`         VARCHAR(255),
  `cv`            VARCHAR(255),
  `creado_en`     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  `contrasena`    VARCHAR(255),
  `activo`        BOOLEAN, --0 inactivo, 1 activo
  `id_carrera`    INT NOT NULL,
  `descripcion`   VARCHAR(255),
  `habilidades`   VARCHAR(255),
  `educacion`     VARCHAR(255),
  `imagen`        VARCHAR(255),
  PRIMARY KEY (`id_estudiante`),
  FOREIGN KEY (`id_carrera`) REFERENCES `carrera`(`id_carrera`)
);

CREATE TABLE `empleador` (
  `id_empleador` INT          NOT NULL AUTO_INCREMENT,
  `empresa`      VARCHAR(255),
  `descripcion`  VARCHAR(255),
  `telefono`     INT,
  `gmail`        VARCHAR(255),
  `creado_en`    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  `contrasena`   VARCHAR(255),
  `activo`       BOOLEAN, --0 inactivo, 1 activo
  `imagen`       VARCHAR(255),
  PRIMARY KEY (`id_empleador`)
);

CREATE TABLE `supervisor` (
  `id_supervisor` INT          NOT NULL AUTO_INCREMENT,
  `nombre`        VARCHAR(255),
  `apellido`      VARCHAR(255),
  `telefono`      INT,
  `gmail`         VARCHAR(255),
  `creado_en`     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  `contrasena`    VARCHAR(255),
  `activo`        BOOLEAN, --0 inactivo, 1 activo
  PRIMARY KEY (`id_supervisor`)
);

CREATE TABLE `oferta` (
  `id_oferta`      INT          NOT NULL AUTO_INCREMENT,
  `oferta`         VARCHAR(100),
  `descripcion`    TEXT,
  `fecha_apertura` DATE,
  `fecha_cierre`   DATE,
  `modalidad`      VARCHAR(255),
  `estado`         INT, -- 0 pendiente, 1 aceptado, 2 rechazado, 3 archivado
  `id_empleador`  INT          NOT NULL,
  `imagen`         VARCHAR(255),
  `rechazo`        TEXT, --motivo del rechazo
  PRIMARY KEY (`id_oferta`),
  FOREIGN KEY (`id_empleador`) REFERENCES `empleador`(`id_empleador`)
);

CREATE TABLE `postulante` (
  `id_postulante` INT NOT NULL AUTO_INCREMENT,
  `id_oferta`     INT NOT NULL,
  `id_estudiante` INT NOT NULL,
  `estado`        INT, -- 0 pendiente, 1 aceptado, 2 rechazado
  PRIMARY KEY (`id_postulante`),
  FOREIGN KEY (`id_oferta`)     REFERENCES `oferta`(`id_oferta`),
  FOREIGN KEY (`id_estudiante`) REFERENCES `estudiante`(`id_estudiante`)
);

CREATE TABLE `curso` (
  `id_curso`       INT          NOT NULL AUTO_INCREMENT,
  `curso`          VARCHAR(255),
  `descripcion`    TEXT,
  `fecha_creacion` DATE,
  `estado`         INT, -- 0 pendiente, 1 aceptado, 2 rechazado, 3 archivado
  `id_estudiante`  INT,
  `id_empleador`   INT,
  `tipo_ofertante` BOOLEAN      NOT NULL, -- 0 estudiante, 1 empleador
  `contacto`       VARCHAR(255),
  PRIMARY KEY (`id_curso`),
  FOREIGN KEY (`id_estudiante`) REFERENCES `estudiante`(`id_estudiante`),
  FOREIGN KEY (`id_empleador`)  REFERENCES `empleador`(`id_empleador`)
);

CREATE TABLE `categoria` (
  `id_categoria` INT          NOT NULL AUTO_INCREMENT,
  `categoria`    VARCHAR(255),
  PRIMARY KEY (`id_categoria`)
);

CREATE TABLE `categoria_oferta` (
  `id_categoria_oferta` INT NOT NULL AUTO_INCREMENT,
  `id_categoria`        INT NOT NULL,
  `id_oferta`           INT NOT NULL,
  PRIMARY KEY (`id_categoria_oferta`),
  FOREIGN KEY (`id_categoria`) REFERENCES `categoria`(`id_categoria`),
  FOREIGN KEY (`id_oferta`)    REFERENCES `oferta`(`id_oferta`)
);

CREATE TABLE `categoria_curso` (
  `id_categoria_curso` INT NOT NULL AUTO_INCREMENT,
  `id_categoria`       INT NOT NULL,
  `id_curso`           INT NOT NULL,
  PRIMARY KEY (`id_categoria_curso`),
  FOREIGN KEY (`id_categoria`) REFERENCES `categoria`(`id_categoria`),
  FOREIGN KEY (`id_curso`)     REFERENCES `curso`(`id_curso`)
);