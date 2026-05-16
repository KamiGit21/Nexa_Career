
CREATE SCHEMA IF NOT EXISTS `carrera`;
CREATE TABLE `carrera`.`carrera` (
  `id_carrera` INT NOT NULL AUTO_INCREMENT,
  `carrera`    VARCHAR(255),
  PRIMARY KEY (`id_carrera`)
);

CREATE SCHEMA IF NOT EXISTS `estudiante`;
CREATE TABLE `estudiante`.`estudiante` (
  `id_estudiante` INT NOT NULL AUTO_INCREMENT,
  `nombre`        VARCHAR(255),
  `apellido`      VARCHAR(255),
  `telefono`      INT,
  `gmail`         VARCHAR(255),
  `cv`            VARCHAR(255),
  `creado_en`     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `contrasena`    VARCHAR(255),
  `activo`        BOOLEAN,
  `id_carrera`    INT NOT NULL,
  `descripcion`   VARCHAR(255),
  `habilidades`   VARCHAR(255),
  `educacion`     VARCHAR(255),
  `imagen`        VARCHAR(255),
  `motivo_bloqueo` TEXT DEFAULT NULL,
  `fecha_bloqueo`  DATETIME DEFAULT NULL,
  PRIMARY KEY (`id_estudiante`)
);


CREATE SCHEMA IF NOT EXISTS `empleador`;
CREATE TABLE `empleador`.`empleador` (
  `id_empleador` INT NOT NULL AUTO_INCREMENT,
  `empresa`      VARCHAR(255),
  `descripcion`  VARCHAR(255),
  `telefono`     INT,
  `gmail`        VARCHAR(255),
  `creado_en`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `contrasena`   VARCHAR(255),
  `activo`       BOOLEAN,
  `imagen`       VARCHAR(255),
  `motivo_bloqueo` TEXT DEFAULT NULL,
  `fecha_bloqueo`  DATETIME DEFAULT NULL,
  PRIMARY KEY (`id_empleador`)
);


CREATE SCHEMA IF NOT EXISTS `supervisor`;
CREATE TABLE `supervisor`.`supervisor` (
  `id_supervisor` INT NOT NULL AUTO_INCREMENT,
  `nombre`        VARCHAR(255),
  `apellido`      VARCHAR(255),
  `telefono`      INT,
  `gmail`         VARCHAR(255),
  `creado_en`     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `contrasena`    VARCHAR(255),
  `activo`        BOOLEAN,
  `motivo_bloqueo` TEXT DEFAULT NULL,
  `fecha_bloqueo`  DATETIME DEFAULT NULL,
  PRIMARY KEY (`id_supervisor`)
);


CREATE SCHEMA IF NOT EXISTS `oferta`;
CREATE TABLE `oferta`.`oferta` (
  `id_oferta`      INT NOT NULL AUTO_INCREMENT,
  `oferta`         VARCHAR(100),
  `descripcion`    TEXT,
  `fecha_apertura` DATE,
  `fecha_cierre`   DATE,
  `modalidad`      VARCHAR(255),
  `estado`         INT,
  `id_empleador`   INT NOT NULL,
  `imagen`         VARCHAR(255),
  `rechazo`        TEXT,
  PRIMARY KEY (`id_oferta`)
);


CREATE SCHEMA IF NOT EXISTS `postulante`;
CREATE TABLE `postulante`.`postulante` (
  `id_postulante` INT NOT NULL AUTO_INCREMENT,
  `id_oferta`     INT NOT NULL,
  `id_estudiante` INT NOT NULL,
  `estado`        INT, 
  PRIMARY KEY (`id_postulante`)
);


CREATE SCHEMA IF NOT EXISTS `curso`;
CREATE TABLE `curso`.`curso` (
  `id_curso`       INT NOT NULL AUTO_INCREMENT,
  `curso`          VARCHAR(255),
  `descripcion`    TEXT,
  `fecha_creacion` DATE,
  `estado`         INT,
  `id_estudiante`  INT,
  `id_empleador`   INT,
  `tipo_ofertante` BOOLEAN NOT NULL,
  `contacto`       VARCHAR(255),
  --`rechazo`        TEXT,
  PRIMARY KEY (`id_curso`)
);


CREATE SCHEMA IF NOT EXISTS `categoria`;
CREATE TABLE `categoria`.`categoria` (
  `id_categoria` INT NOT NULL AUTO_INCREMENT,
  `categoria`    VARCHAR(255),
  PRIMARY KEY (`id_categoria`)
);


CREATE SCHEMA IF NOT EXISTS `categoria_oferta`;
CREATE TABLE `categoria_oferta`.`categoria_oferta` (
  `id_categoria_oferta` INT NOT NULL AUTO_INCREMENT,
  `id_categoria`        INT NOT NULL,
  `id_oferta`           INT NOT NULL,
  PRIMARY KEY (`id_categoria_oferta`)
);


CREATE SCHEMA IF NOT EXISTS `categoria_curso`;
CREATE TABLE `categoria_curso`.`categoria_curso` (
  `id_categoria_curso` INT NOT NULL AUTO_INCREMENT,
  `id_categoria`       INT NOT NULL,
  `id_curso`           INT NOT NULL,
  PRIMARY KEY (`id_categoria_curso`)
);


ALTER TABLE curso ADD COLUMN rechazo TEXT DEFAULT NULL;
