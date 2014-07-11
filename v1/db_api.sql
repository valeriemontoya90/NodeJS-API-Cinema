-- phpMyAdmin SQL Dump
-- version 3.4.10.1
-- http://www.phpmyadmin.net
--
-- Client: localhost
-- Généré le : Ven 11 Juillet 2014 à 10:41
-- Version du serveur: 5.5.20
-- Version de PHP: 5.3.10

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données: `db_api`
--

-- --------------------------------------------------------

--
-- Structure de la table `movie`
--

CREATE TABLE IF NOT EXISTS `movie` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `cover` varchar(255) NOT NULL,
  `genre` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=12 ;

--
-- Contenu de la table `movie`
--

INSERT INTO `movie` (`id`, `title`, `cover`, `genre`) VALUES
(1, '"Coldwater"', '', 0),
(3, '"Palo Alto"', '', 0),
(4, '"The Town"', '', 0),
(5, '"Her"', '', 0),
(6, '"Drive"', '', 0),
(7, 'Perfect sens', '', 0),
(8, 'Summerland', '', 0),
(11, 'The One', '', 0);

-- --------------------------------------------------------

--
-- Structure de la table `movie-disliked`
--

CREATE TABLE IF NOT EXISTS `movie-disliked` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idUser` int(11) NOT NULL,
  `idMovie` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Contenu de la table `movie-disliked`
--

INSERT INTO `movie-disliked` (`id`, `idUser`, `idMovie`, `date`) VALUES
(2, 2, 8, '0000-00-00 00:00:00'),
(3, 1, 4, '0000-00-00 00:00:00'),
(4, 5, 8, '0000-00-00 00:00:00'),
(5, 3, 2, '0000-00-00 00:00:00'),
(6, 4, 8, '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Structure de la table `movie-liked`
--

CREATE TABLE IF NOT EXISTS `movie-liked` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idUser` int(11) NOT NULL,
  `idMovie` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=13 ;

--
-- Contenu de la table `movie-liked`
--

INSERT INTO `movie-liked` (`id`, `idUser`, `idMovie`, `date`) VALUES
(8, 1, 6, '2014-07-10 12:21:58'),
(9, 1, 7, '2014-07-10 12:23:32'),
(12, 1, 4, '2014-07-10 14:06:35');

-- --------------------------------------------------------

--
-- Structure de la table `movie-to-watch`
--

CREATE TABLE IF NOT EXISTS `movie-to-watch` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idUser` int(11) NOT NULL,
  `idMovie` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Contenu de la table `movie-to-watch`
--

INSERT INTO `movie-to-watch` (`id`, `idUser`, `idMovie`) VALUES
(1, 2, 2),
(2, 2, 3),
(3, 3, 8),
(4, 3, 3);

-- --------------------------------------------------------

--
-- Structure de la table `movie-watched`
--

CREATE TABLE IF NOT EXISTS `movie-watched` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idUser` int(11) NOT NULL,
  `idMovie` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=15 ;

--
-- Contenu de la table `movie-watched`
--

INSERT INTO `movie-watched` (`id`, `idUser`, `idMovie`) VALUES
(3, 1, 2),
(4, 1, 3),
(7, 1, 0),
(8, 1, 0),
(9, 1, 5),
(10, 1, 2),
(11, 1, 2),
(12, 1, 2),
(13, 1, 1),
(14, 1, 6);

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `numberLikes` int(11) NOT NULL,
  `numberDislikes` int(11) NOT NULL,
  `numberWatched` int(11) NOT NULL,
  `numberWatchList` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=47 ;

--
-- Contenu de la table `user`
--

INSERT INTO `user` (`id`, `username`, `numberLikes`, `numberDislikes`, `numberWatched`, `numberWatchList`, `date`) VALUES
(1, 'Valérie', 5, 0, 1, 0, '2014-07-10 14:06:35'),
(2, 'Benjamin', 0, 0, 0, 0, '0000-00-00 00:00:00'),
(3, 'Vincentt', 0, 0, 0, 0, '2014-07-10 12:31:36'),
(5, 'Billy', 0, 0, 0, 0, '0000-00-00 00:00:00'),
(6, 'Bruno', 0, 0, 0, 0, '0000-00-00 00:00:00'),
(7, 'Fany', 0, 0, 0, 0, '2014-07-09 14:21:21'),
(8, 'Zak', 0, 0, 0, 0, '0000-00-00 00:00:00'),
(9, 'Moira', 0, 0, 0, 0, '0000-00-00 00:00:00'),
(10, 'Nicolas', 0, 0, 0, 0, '0000-00-00 00:00:00'),
(11, 'Patrick', 0, 0, 0, 0, '0000-00-00 00:00:00'),
(12, 'Man', 0, 0, 0, 0, '0000-00-00 00:00:00'),
(39, 'Julie', 0, 0, 0, 0, '2014-07-10 08:12:22'),
(42, 'Lucie', 0, 0, 0, 0, '2014-07-10 08:36:38'),
(46, 'Kevin', 0, 0, 0, 0, '2014-07-11 05:59:19');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
