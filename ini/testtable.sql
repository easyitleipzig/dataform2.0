-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 25. Nov 2023 um 08:39
-- Server-Version: 10.4.28-MariaDB
-- PHP-Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `regenbogen`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `testtable`
--

CREATE TABLE `testtable` (
  `id_bigInt` bigint(20) NOT NULL COMMENT 'Id der Daten',
  `val_Int` int(11) NOT NULL COMMENT 'IntWert',
  `val_TiyInt` tinyint(4) NOT NULL COMMENT 'TinyIntWert',
  `val_Boolean` tinyint(1) NOT NULL COMMENT 'BooleanWert',
  `val_Bit` bit(1) NOT NULL COMMENT 'BitWert',
  `val_StandardVarChar` varchar(4096) NOT NULL COMMENT 'StandardVarCharWert',
  `val_StandardDate` date NOT NULL DEFAULT current_timestamp() COMMENT 'StabdardDateWert',
  `val_Time` time NOT NULL COMMENT 'StandardTimeWert',
  `val_DateTime` datetime NOT NULL COMMENT 'StandardDateTimeWert',
  `val_Text` text NOT NULL COMMENT 'StandardTextWert',
  `val_Blob` blob NOT NULL COMMENT 'StandardBlobWert',
  `val_Json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '{}' COMMENT 'StandardJsonWert' CHECK (json_valid(`val_Json`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `testtable`
--
ALTER TABLE `testtable`
  ADD PRIMARY KEY (`id_bigInt`),
  ADD UNIQUE KEY `idx_val_Int` (`val_Int`),
  ADD KEY `idx_val_TinyInt` (`val_TiyInt`);
ALTER TABLE `testtable` ADD FULLTEXT KEY `idx_val_StandardVarChar` (`val_StandardVarChar`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `testtable`
--
ALTER TABLE `testtable`
  MODIFY `id_bigInt` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Id der Daten';
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
