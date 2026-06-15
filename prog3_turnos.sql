-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-06-2026 a las 01:42:03
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `prog3_turnos`
--
CREATE DATABASE IF NOT EXISTS `prog3_turnos` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `prog3_turnos`;

DELIMITER $$
--
-- Procedimientos
--
DROP PROCEDURE IF EXISTS `sp_estadisticas_generales`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_estadisticas_generales` ()   BEGIN
    SELECT
        COUNT(*)                                                    AS total_turnos,
        SUM(CASE WHEN atentido = 1 THEN 1 ELSE 0 END)              AS turnos_atendidos,
        SUM(CASE WHEN atentido = 0 THEN 1 ELSE 0 END)              AS turnos_pendientes,
        COALESCE(SUM(valor_total), 0)                               AS recaudacion_total
    FROM turnos_reservas
    WHERE activo = 1;
END$$

DROP PROCEDURE IF EXISTS `sp_estadisticas_por_especialidad`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_estadisticas_por_especialidad` ()   BEGIN
    SELECT
        e.id_especialidad,
        e.nombre                                                    AS especialidad,
        COUNT(tr.id_turno_reserva)                                  AS total_turnos,
        SUM(CASE WHEN tr.atentido = 1 THEN 1 ELSE 0 END)           AS turnos_atendidos,
        COALESCE(SUM(tr.valor_total), 0)                            AS recaudacion
    FROM especialidades e
    INNER JOIN medicos m        ON m.id_especialidad = e.id_especialidad
    LEFT JOIN turnos_reservas tr ON tr.id_medico    = m.id_medico AND tr.activo = 1
    WHERE e.activo = 1
    GROUP BY e.id_especialidad, e.nombre
    ORDER BY total_turnos DESC;
END$$

DROP PROCEDURE IF EXISTS `sp_estadisticas_por_medico`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_estadisticas_por_medico` ()   BEGIN
    SELECT
        m.id_medico,
        u.apellido,
        u.nombres,
        e.nombre                                                    AS especialidad,
        COUNT(tr.id_turno_reserva)                                  AS total_turnos,
        SUM(CASE WHEN tr.atentido = 1 THEN 1 ELSE 0 END)           AS turnos_atendidos,
        COALESCE(SUM(tr.valor_total), 0)                            AS recaudacion
    FROM medicos m
    INNER JOIN usuarios u       ON u.id_usuario     = m.id_usuario
    INNER JOIN especialidades e ON e.id_especialidad = m.id_especialidad
    LEFT JOIN turnos_reservas tr ON tr.id_medico   = m.id_medico AND tr.activo = 1
    WHERE u.activo = 1
    GROUP BY m.id_medico, u.apellido, u.nombres, e.nombre
    ORDER BY total_turnos DESC;
END$$

DROP PROCEDURE IF EXISTS `sp_estadisticas_por_obra_social`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_estadisticas_por_obra_social` ()   BEGIN
    SELECT
        os.id_obra_social,
        os.nombre                                                   AS obra_social,
        os.es_particular,
        COUNT(tr.id_turno_reserva)                                  AS total_turnos,
        SUM(CASE WHEN tr.atentido = 1 THEN 1 ELSE 0 END)           AS turnos_atendidos,
        COALESCE(SUM(tr.valor_total), 0)                            AS recaudacion
    FROM obras_sociales os
    LEFT JOIN turnos_reservas tr ON tr.id_obra_social = os.id_obra_social AND tr.activo = 1
    WHERE os.activo = 1
    GROUP BY os.id_obra_social, os.nombre, os.es_particular
    ORDER BY total_turnos DESC;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `especialidades`
--

DROP TABLE IF EXISTS `especialidades`;
CREATE TABLE IF NOT EXISTS `especialidades` (
  `id_especialidad` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` varchar(120) NOT NULL,
  `activo` tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_especialidad`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `especialidades`
--

INSERT INTO `especialidades` (`id_especialidad`, `nombre`, `activo`) VALUES
(1, 'PEDIATRÍA', 1),
(2, 'CLÍNICA', 1),
(3, 'TRAUMATOLOGÍA', 1),
(4, 'INFECTOLOGÍA', 1),
(9, 'NEUROLOGÍA', 1),
(15, 'DERMATOLOG�A CL�NICA', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicos`
--

DROP TABLE IF EXISTS `medicos`;
CREATE TABLE IF NOT EXISTS `medicos` (
  `id_medico` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `id_especialidad` int(10) UNSIGNED NOT NULL,
  `matricula` int(10) UNSIGNED NOT NULL,
  `descripcion` text DEFAULT NULL,
  `valor_consulta` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_medico`),
  UNIQUE KEY `matricula` (`matricula`),
  KEY `fk_medicos_especialidades` (`id_especialidad`),
  KEY `fk_medicos_usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `medicos`
--

INSERT INTO `medicos` (`id_medico`, `id_usuario`, `id_especialidad`, `matricula`, `descripcion`, `valor_consulta`) VALUES
(1, 1, 1, 1000, 'test', 5000.00),
(2, 2, 1, 2000, 'test', 5000.00),
(3, 3, 3, 3000, 'test', 10000.00),
(4, 4, 4, 4000, 'test', 15000.00),
(5, 15, 1, 5555, 'M�dico de prueba', 8000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicos_obras_sociales`
--

DROP TABLE IF EXISTS `medicos_obras_sociales`;
CREATE TABLE IF NOT EXISTS `medicos_obras_sociales` (
  `id_medico_obra_social` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_medico` int(10) UNSIGNED NOT NULL,
  `id_obra_social` int(10) UNSIGNED NOT NULL,
  `activo` tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_medico_obra_social`),
  KEY `fk_mos_medico` (`id_medico`),
  KEY `fk_mos_obra_social` (`id_obra_social`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `medicos_obras_sociales`
--

INSERT INTO `medicos_obras_sociales` (`id_medico_obra_social`, `id_medico`, `id_obra_social`, `activo`) VALUES
(1, 1, 1, 1),
(2, 2, 1, 1),
(3, 3, 2, 1),
(4, 4, 3, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `obras_sociales`
--

DROP TABLE IF EXISTS `obras_sociales`;
CREATE TABLE IF NOT EXISTS `obras_sociales` (
  `id_obra_social` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` varchar(120) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `porcentaje_descuento` decimal(9,2) NOT NULL,
  `es_particular` tinyint(1) UNSIGNED NOT NULL DEFAULT 0,
  `activo` tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_obra_social`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `obras_sociales`
--

INSERT INTO `obras_sociales` (`id_obra_social`, `nombre`, `descripcion`, `porcentaje_descuento`, `es_particular`, `activo`) VALUES
(1, 'Jerárquicos', 'jer', 10.00, 0, 1),
(2, 'OSUNER', 'osu', 10.00, 0, 1),
(3, 'OSECAC', 'ose', 11.00, 0, 1),
(4, 'OSUNER 3', 'OSU', 13.00, 0, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pacientes`
--

DROP TABLE IF EXISTS `pacientes`;
CREATE TABLE IF NOT EXISTS `pacientes` (
  `id_paciente` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `id_obra_social` int(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`id_paciente`),
  KEY `fk_pacientes_obras_sociales` (`id_obra_social`),
  KEY `fk_pacientes_usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `pacientes`
--

INSERT INTO `pacientes` (`id_paciente`, `id_usuario`, `id_obra_social`) VALUES
(1, 5, 2),
(2, 6, 2),
(3, 7, 3),
(4, 8, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turnos_reservas`
--

DROP TABLE IF EXISTS `turnos_reservas`;
CREATE TABLE IF NOT EXISTS `turnos_reservas` (
  `id_turno_reserva` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_medico` int(10) UNSIGNED NOT NULL,
  `id_paciente` int(10) UNSIGNED NOT NULL,
  `id_obra_social` int(10) UNSIGNED NOT NULL,
  `fecha_hora` datetime NOT NULL,
  `valor_total` decimal(10,2) NOT NULL,
  `atentido` tinyint(3) UNSIGNED NOT NULL,
  `activo` tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_turno_reserva`),
  KEY `fk_turnos_reservas_pacientes` (`id_paciente`),
  KEY `fk_turnos_reservas_medicos` (`id_medico`),
  KEY `fk_turnos_reservas_obras_sociales` (`id_obra_social`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `turnos_reservas`
--

INSERT INTO `turnos_reservas` (`id_turno_reserva`, `id_medico`, `id_paciente`, `id_obra_social`, `fecha_hora`, `valor_total`, `atentido`, `activo`) VALUES
(1, 1, 1, 1, '2026-04-01 17:00:00', 4500.00, 0, 1),
(2, 3, 2, 2, '2026-04-01 18:00:00', 9000.00, 0, 1),
(4, 4, 3, 3, '2026-04-01 19:00:00', 13500.00, 0, 1),
(5, 3, 2, 2, '2026-04-14 18:00:00', 9000.00, 0, 1),
(6, 3, 2, 2, '2026-04-21 18:00:00', 9000.00, 0, 1),
(7, 4, 3, 3, '2026-05-07 16:00:00', 133500.00, 0, 1),
(8, 1, 1, 1, '2026-06-20 10:00:00', 4500.00, 1, 1),
(9, 1, 1, 2, '2026-06-25 15:15:00', 4500.00, 1, 1),
(10, 1, 1, 2, '2026-07-01 10:00:00', 4500.00, 0, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id_usuario` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `documento` varchar(20) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `nombres` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contrasenia` varchar(255) NOT NULL,
  `foto_path` varchar(255) NOT NULL,
  `rol` tinyint(3) UNSIGNED NOT NULL,
  `activo` tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `documento` (`documento`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `documento`, `apellido`, `nombres`, `email`, `contrasenia`, `foto_path`, `rol`, `activo`) VALUES
(1, '31000111', 'Lopez', 'Marcelo', 'lopmar@correo.com', '2a2646782c5b98ee3084c8734c05f870dbd39a8320e0a2d356acb12083d61bef', 'uploads/usuarios/1781184205742.jpg', 1, 1),
(2, '31000112', 'Diaz', 'Juan', 'diajua@correo.com', 'efe60972bee3664517525d7abd799fda05ecca0cd4ce583894b86a900782b424', '', 1, 1),
(3, '31000113', 'Benitez', 'Horacio', 'benhor@correo.com', 'eb2209c3ce078113e5dad388f31a6e6d81b3578c500a1dd30a7ebd2d36bed230', '', 1, 1),
(4, '31000114', 'Perez', 'Luis', 'perlui@correo.com', 'e738d2ec597343b44987139c0f056c1341e98f8b3d3814640499a8e74b24a650', '', 1, 1),
(5, '41000111', 'Lopez', 'Jacinto', 'lopjac@correo.com', '79570b42e34bb9e2edc92b9b03982f70653dd11905e7040870a570cfae72b0b0', '', 2, 1),
(6, '41000112', 'Hunk', 'Lorena', 'hunlor@correo.com', '464db19217fabdaabc5add321054f39216d03edfef2efaf8c6769485415b7f25', '', 2, 1),
(7, '41000113', 'Aguirre', 'Brian', 'agubri@correo.com', '2dfa174ae2688ec55d00f57c5a0a7783ba1f0e2981ab7df9f1cf933686c15274', '', 2, 1),
(8, '51000111', 'Fernandez', 'Benito', 'ferben@correo.com', 'f127f4e9e4248f77eaa446ea9bff721e3e79eedf114ba6e1cfc633853ef07b4c', '', 3, 1),
(10, '51000112', 'Gomez', 'Silvia', 'gomsil@correo.com', '601de117008d80e65ffad05dce97462d8f1b1e9aad6d68cf2b289703b8366b52', '', 3, 1),
(13, '40111222', 'Perez', 'Juan', 'juan@test.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '', 2, 1),
(15, '40111223', 'Perez', 'Carlos', 'carlos.perez@test.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '', 2, 1);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_medicos`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `v_medicos`;
CREATE TABLE IF NOT EXISTS `v_medicos` (
`id_medico` int(10) unsigned
,`id_usuario` int(10) unsigned
,`apellido` varchar(100)
,`nombres` varchar(100)
,`email` varchar(255)
,`foto_path` varchar(255)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_pacientes`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `v_pacientes`;
CREATE TABLE IF NOT EXISTS `v_pacientes` (
`id_paciente` int(10) unsigned
,`id_usuario` int(10) unsigned
,`apellido` varchar(100)
,`nombres` varchar(100)
,`email` varchar(255)
,`id_obra_social` int(10) unsigned
,`descripcion_obra_social` varchar(255)
,`foto_path` varchar(255)
);

-- --------------------------------------------------------

--
-- Estructura para la vista `v_medicos`
--
DROP TABLE IF EXISTS `v_medicos`;

DROP VIEW IF EXISTS `v_medicos`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_medicos`  AS SELECT `m`.`id_medico` AS `id_medico`, `m`.`id_usuario` AS `id_usuario`, `u`.`apellido` AS `apellido`, `u`.`nombres` AS `nombres`, `u`.`email` AS `email`, `u`.`foto_path` AS `foto_path` FROM (`medicos` `m` join `usuarios` `u` on(`m`.`id_usuario` = `u`.`id_usuario`)) WHERE `u`.`activo` = 1 ;

-- --------------------------------------------------------

--
-- Estructura para la vista `v_pacientes`
--
DROP TABLE IF EXISTS `v_pacientes`;

DROP VIEW IF EXISTS `v_pacientes`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_pacientes`  AS SELECT `p`.`id_paciente` AS `id_paciente`, `p`.`id_usuario` AS `id_usuario`, `u`.`apellido` AS `apellido`, `u`.`nombres` AS `nombres`, `u`.`email` AS `email`, `os`.`id_obra_social` AS `id_obra_social`, `os`.`descripcion` AS `descripcion_obra_social`, `u`.`foto_path` AS `foto_path` FROM ((`pacientes` `p` join `usuarios` `u` on(`p`.`id_usuario` = `u`.`id_usuario`)) join `obras_sociales` `os` on(`p`.`id_obra_social` = `os`.`id_obra_social`)) WHERE `u`.`activo` = 1 ;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `medicos`
--
ALTER TABLE `medicos`
  ADD CONSTRAINT `fk_medicos_especialidades` FOREIGN KEY (`id_especialidad`) REFERENCES `especialidades` (`id_especialidad`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_medicos_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `medicos_obras_sociales`
--
ALTER TABLE `medicos_obras_sociales`
  ADD CONSTRAINT `fk_mos_medico` FOREIGN KEY (`id_medico`) REFERENCES `medicos` (`id_medico`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_mos_obra_social` FOREIGN KEY (`id_obra_social`) REFERENCES `obras_sociales` (`id_obra_social`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD CONSTRAINT `fk_pacientes_obras_sociales` FOREIGN KEY (`id_obra_social`) REFERENCES `obras_sociales` (`id_obra_social`),
  ADD CONSTRAINT `fk_pacientes_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `turnos_reservas`
--
ALTER TABLE `turnos_reservas`
  ADD CONSTRAINT `fk_turnos_reservas_medicos` FOREIGN KEY (`id_medico`) REFERENCES `medicos` (`id_medico`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_turnos_reservas_obras_sociales` FOREIGN KEY (`id_obra_social`) REFERENCES `obras_sociales` (`id_obra_social`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_turnos_reservas_pacientes` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id_paciente`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
