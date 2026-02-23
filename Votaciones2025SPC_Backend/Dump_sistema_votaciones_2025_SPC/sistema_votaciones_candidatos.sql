-- MySQL dump 10.13  Distrib 8.0.40, for macos14 (x86_64)
--
-- Host: 192.168.1.58    Database: sistema_votaciones
-- ------------------------------------------------------
-- Server version	5.7.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `candidatos`
--

DROP TABLE IF EXISTS `candidatos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidatos` (
  `id_candidato` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `grupo` varchar(50) NOT NULL,
  `biografia` text,
  `foto_url` varchar(255) DEFAULT 'public/media/user.jpeg',
  PRIMARY KEY (`id_candidato`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidatos`
--

LOCK TABLES `candidatos` WRITE;
/*!40000 ALTER TABLE `candidatos` DISABLE KEYS */;
INSERT INTO `candidatos` VALUES (1,'Maximiliano Giraldo Giraldo','3','Representante del curso 3-01','public/media/REPRESENTANTES/PRIMARIA/3-01_GIRALDO_GIRALDO_MAXIMILIANO.JPG'),(2,'María Gabriela Gamboa Medina','3','Representante del curso 3-02','public/media/REPRESENTANTES/PRIMARIA/3-02_GAMBOA_MEDINA_MARIA_GABRIELA.JPG'),(3,'Adrian Jose Hernandez Peñarredonda','4','Representante del curso 4-01','public/media/REPRESENTANTES/PRIMARIA/4-01_HERNANDEZ_PEÑAREDONDA_ADRIAN_JOSE.JPG'),(4,'Lucas Caballero Agudelo','4','Representante del curso 4-02','public/media/REPRESENTANTES/PRIMARIA/4-02_CABALLERO_AGUDELO_LUCAS.JPG'),(5,'Brenda Lucia Rodriguez Gomez','5','Representante del curso 5-01','public/media/REPRESENTANTES/PRIMARIA/5-01 _RODRIGUEZ_GOMEZ_BRENDA_LUCIA.JPG'),(6,'Daniel de Jesus Sanchez Puello','5','Representante del curso 5-02','public/media/REPRESENTANTES/PRIMARIA/5-02_SANCHEZ PUELLO_DANIEL_DE_JESUS.JPG'),(7,'Isabella Llamas Delgado','5','Representante del curso 5-03','public/media/REPRESENTANTES/PRIMARIA/5-03_LLAMAS_DELGADO_ISABELLA.JPG'),(8,'Gabriel Gaona Palencia','6','Representante del curso 6-01','public/media/REPRESENTANTES/BACHILLERATO/6-01_GAONA_PALENCIA_GABRIEL.JPG'),(9,'Juan Felipe Barboza Daza','6','Representante del curso 6-02','public/media/REPRESENTANTES/BACHILLERATO/6-02_BARBOZA_DAZA_JUAN_FELIPE.JPG'),(10,'Jaime David Cuadro Pico','6','Representante del curso 6-03','public/media/REPRESENTANTES/BACHILLERATO/6-03_CUADRO_PICO_JAIME_DAVID.JPG'),(11,'Allan Camilo Pupo Hurtado','7','Representante del curso 7-01','public/media/REPRESENTANTES/BACHILLERATO/7-01_PUPO_HURTADO_ALLAN_CAMILO.JPG'),(12,'Naishell Zanaya Meza Mendez','7','Representante del curso 7-02','public/media/REPRESENTANTES/BACHILLERATO/7-02_MEZA_MENDEZ_NAISHELL_ZANAYA.JPG'),(13,'Jorge Andres Martinez Vasquez','7','Representante del curso 7-03','public/media/REPRESENTANTES/BACHILLERATO/7-03_MARTINEZ_VASQUEZ_JORGE_ANDRES.JPG'),(14,'Elías David Spath Ospino','8','Representante del curso 8-01','public/media/REPRESENTANTES/BACHILLERATO/8-01_SPATH_OSPINO_ELIAS_DAVID.JPG'),(15,'Silvana Salas López','8','Representante del curso 8-02','public/media/REPRESENTANTES/BACHILLERATO/8-02_SALAS_LOPEZ_SILVANA.JPG'),(16,'Isabella Castro Torres','8','Representante del curso 8-03','public/media/REPRESENTANTES/BACHILLERATO/8-03_CASTRO_TORRES_ISABELLA.JPG'),(17,'Samantha Carolina Caraballo Mercado','9','Representante del curso 9-01','public/media/REPRESENTANTES/BACHILLERATO/9-01_CARABALLO_MERCADO_SAMANTHA_CAROLINA.JPG'),(18,'Catalina Balseiro Vergara','9','Representante del curso 9-02','public/media/REPRESENTANTES/BACHILLERATO/9-02_BALSEIRO_VERGARA_CATALINA.JPG'),(19,'Alili del Pilar Caballero Gaviria','9','Representante del curso 9-03','public/media/REPRESENTANTES/BACHILLERATO/9-03_CABALLERO_GAVIRIA_ALILI_DEL_PILAR.JPG'),(20,'Victoria Leaño Caro','10','Representante del curso 10-01','public/media/REPRESENTANTES/BACHILLERATO/10-01_LEAÑO_CARO_VICTORIA.JPG'),(21,'Juan Esteban Lopez Borja','10','Representante del curso 10-02','public/media/REPRESENTANTES/BACHILLERATO/10-02_LOPEZ_BORJA_JUAN_ESTEBAN.JPG'),(22,'Juan David Marinez Guzman','10','Representante del curso 10-03','public/media/REPRESENTANTES/BACHILLERATO/10-03_MARTINEZ_GUZMAN_JUAN_DAVID.JPG'),(23,'Sara Lucia Hernandez Reales','11','Representante del curso 11-01','public/media/REPRESENTANTES/BACHILLERATO/11-01_HERNANDEZ_REALES_SARA_LUCIA.JPG'),(24,'Ashley Trespalacio Franco','11','Representante del curso 11-02','public/media/REPRESENTANTES/BACHILLERATO/11-02_TRESPALACIOS_FRANCO_ASHLEY.JPG'),(25,'Juan Manuel Viasus Aldana','11','Representante del curso 11-03','public/media/REPRESENTANTES/BACHILLERATO/11-03_VIASUS_ALDANA_JUAN_MANUEL.JPG'),(26,'Esteban David Ferrer Vanegas','11','Representante del curso 11-04','public/media/REPRESENTANTES/BACHILLERATO/11-04_FERRER_VANEGAS_ESTEBAN_DAVID.JPG'),(27,'Daniela Reyes Trouchon','Consejo','Miembro del Consejo Directivo','public/media/REPRESENTANTES/BACHILLERATO/PERSONERIA_Y_CONSEJO/CONSEJO_DIRECTIVO/11-01_DANIELA_REYES_TROUCHON.JPG'),(28,'Valentina Jimenez Vuelva','Consejo','Miembro del Consejo Directivo','public/media/REPRESENTANTES/BACHILLERATO/PERSONERIA_Y_CONSEJO/CONSEJO_DIRECTIVO/11-02_JIMENEZ_BUELVAS_VALENTINA.JPG'),(29,'Nicolás Andrés Correa de Arco','Consejo','Miembro del Consejo Directivo','public/media/REPRESENTANTES/BACHILLERATO/PERSONERIA_Y_CONSEJO/CONSEJO_DIRECTIVO/11-03_CORREA_DE_ARCO_NICOLAS_ANDRES.JPG'),(30,'Stefanía Mercado López','Consejo','Miembro del Consejo Directivo','public/media/REPRESENTANTES/BACHILLERATO/PERSONERIA_Y_CONSEJO/CONSEJO_DIRECTIVO/11-04_MERCADO_LOPEZ_STEFANIA.JPG'),(31,'01 - Isabela Valenzuela Velez','Personero','Personera estudiantil','public/media/REPRESENTANTES/BACHILLERATO/PERSONERIA_Y_CONSEJO/PERSONERIA/11-01_ISABELA_VALENZUELA_VELEZ.JPG'),(32,'02 - Natalia Martinez Jauregui','Personero','Personera estudiantil','public/media/REPRESENTANTES/BACHILLERATO/PERSONERIA_Y_CONSEJO/PERSONERIA/11-02_MARTINEZ_JAUREGUI_NATALIA_LOURDES.JPG'),(33,'03 - Nelson Miguel González Anaya','Personero','Personero estudiantil','public/media/REPRESENTANTES/BACHILLERATO/PERSONERIA_Y_CONSEJO/PERSONERIA/11-03_GONZALEZ_ANAYA_NELSON_MIGUEL.JPG'),(34,'04 - Carlos Juan Durán Montero','Personero','Personero estudiantil','public/media/REPRESENTANTES/BACHILLERATO/PERSONERIA_Y_CONSEJO/PERSONERIA/11-04_DURAN_MONTERO_CARLOS_JUAN.JPG'),(64,'Voto en Blanco 1','1','Opción de voto en blanco','public/media/votoenblanco.jpg'),(65,'Voto en Blanco 2','2','Opción de voto en blanco','public/media/votoenblanco.jpg'),(66,'Voto en Blanco 3','3','Opción de voto en blanco','public/media/votoenblanco.jpg'),(67,'Voto en Blanco 4','4','Opción de voto en blanco','public/media/votoenblanco.jpg'),(68,'Voto en Blanco 5','5','Opción de voto en blanco','public/media/votoenblanco.jpg'),(69,'Voto en Blanco 6','6','Opción de voto en blanco','public/media/votoenblanco.jpg'),(70,'Voto en Blanco 7','7','Opción de voto en blanco','public/media/votoenblanco.jpg'),(71,'Voto en Blanco 8','8','Opción de voto en blanco','public/media/votoenblanco.jpg'),(72,'Voto en Blanco 9','9','Opción de voto en blanco','public/media/votoenblanco.jpg'),(73,'Voto en Blanco 10','10','Opción de voto en blanco','public/media/votoenblanco.jpg'),(74,'Voto en Blanco 11','11','Opción de voto en blanco','public/media/votoenblanco.jpg'),(75,'Voto en Blanco Consejo','Consejo','Opción de voto en blanco','public/media/votoenblanco.jpg'),(76,'Voto en Blanco Personero','Personero','Opción de voto en blanco','public/media/votoenblanco.jpg');
/*!40000 ALTER TABLE `candidatos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-04  9:53:30
