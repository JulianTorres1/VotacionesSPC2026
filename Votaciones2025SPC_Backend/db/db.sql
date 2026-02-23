USE sistema_votaciones;-- Tabla de Candidatos (Representantes y Personeros)
CREATE TABLE candidatos (
    id_candidato INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    grupo VARCHAR(50) NOT NULL,
    -- salon al que pertenece
    biografia TEXT,
    -- Biografía o presentación del candidato
    foto_url VARCHAR(255) -- Enlace a la foto del candidato (opcional)
);-- Tabla de Votaciones
CREATE TABLE votaciones (
    id_voto INT AUTO_INCREMENT PRIMARY KEY,
    id_candidato INT,
    -- ID del candidato que recibió el voto
    -- ID del estudiante que votó
    fecha_voto TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_candidato) REFERENCES candidatos(id_candidato) ON DELETE CASCADE
);
CREATE TABLE votos (
    id_voto INT AUTO_INCREMENT PRIMARY KEY,
    id_candidato INT,
    cantidad INT DEFAULT 1,
    FOREIGN KEY (id_candidato) REFERENCES candidatos(id_candidato)
);



sudo docker run -it --rm \
 --name n8n \
 -p 5678:5678 \
 -e GENERIC_TIMEZONE="America/Bogota" \
 -e TZ="America/Bogota" \
 -e N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true \
 -e N8N_RUNNERS_ENABLED=true \
 -e N8N_SECURE_COOKIE=false \
 -v n8n_data:/home/node/.n8n \
 docker.n8n.io/n8nio/n8n


1°01
2°01
2°02
3°01
3°02
4°01
4°02
5°01
5°02
5°03
6°01
6°02
6°03
7°01
7°02
7°03
8°01
8°02
8°03
9°01
9°02
9°03
10°01
10°02
10°03
11°01
11°02
11°03
11°04


INSERT INTO candidatos (nombre, grupo, biografia, foto_url) VALUES
('Mariana Lucia Heredia', '3', 'Representante del curso 301', 'public/media/user.jpeg'),
('Matias Martinez Gonzalez', '3', 'Representante del curso 302', 'public/media/user.jpeg'),
('Joshua Cardona Lugo', '4', 'Representante del curso 401', 'public/media/user.jpeg'),
('Jesus Adrian Alvarez Palacio', '4', 'Representante del curso 402', 'public/media/user.jpeg'),
('Ardila Gutierrez Santiago', '5', 'Representante del curso 501', 'public/media/user.jpeg'),
('Laurent Sofia Vergara Cruz', '5', 'Representante del curso 502', 'public/media/user.jpeg'),
('Jeronimo Martelo Martinez', '5', 'Representante del curso 503', 'public/media/user.jpeg'),
('Martina Guzman Hincapie', '6', 'Representante del curso 6-01', 'public/media/user.jpeg'),
('Daniel Sanchez Puello', '6', 'Representante del curso 6-02', 'public/media/user.jpeg'),
('Isabella Llamas Delgado', '6', 'Representante del curso 6-03', 'public/media/user.jpeg'),
('Mariana Isabel Mendoza Vasquez', '7', 'Representante del curso 7-01', 'public/media/user.jpeg'),
('Andres Camilo Montes Romero', '7', 'Representante del curso 7-02', 'public/media/user.jpeg'),
('Venuus Boudon Morales', '7', 'Representante del curso 7-03', 'public/media/user.jpeg'),
('Juan Francisco Hernandez Cordoba', '8', 'Representante del curso 8-01', 'public/media/user.jpeg'),
('Diego Andres Silva Osorio', '8', 'Representante del curso 8-02', 'public/media/user.jpeg'),
('Mathias Carmona Navarro', '8', 'Representante del curso 8-03', 'public/media/user.jpeg'),
('Elias David Spath Ospino', '9', 'Representante del curso 9-01', 'public/media/user.jpeg'),
('Sofia Cortes Manrique', '9', 'Representante del curso 9-02', 'public/media/user.jpeg'),
('Sara Rodriguez Hernandez', '9', 'Representante del curso 9-03', 'public/media/user.jpeg'),
('Luis Alejandro Mora Lombana', '10', 'Representante del curso 10-01', 'public/media/user.jpeg'),
('Danna Sofia Guardela Vasquez', '10', 'Representante del curso 10-02', 'public/media/user.jpeg'),
('Santiago Vargas Bermudez', '10', 'Representante del curso 10-03', 'public/media/user.jpeg'),
('Ana Maria Guerrero Herazo', '10', 'Representante del curso 10-04', 'public/media/user.jpeg'),
('De Arco Muñoz Maria Paz', '11, 'Representante del curso 11-01', 'public/media/user.jpeg'),
('Guerrini Campaz Sante', '11', 'Representante del curso 11-02', 'public/media/user.jpeg'),
('Barrios Leon Paula', '11', 'Representante del curso 11-03', 'public/media/user.jpeg'),

('Morrison Arrazola Santiago', 'Personero', 'Aspirante a Personero Estudiantil', 'public/media/user.jpeg'),
('Rossy Guzman Juliana Eugenia', 'Personero', 'Aspirante a Personero Estudiantil', 'public/media/user.jpeg'),
('Fernandez Bustillo Sixto Esteban', 'Personero', 'Aspirante a Personero Estudiantil', 'public/media/user.jpeg'),

('Vergara Martinez Carlos Andres', 'Consejo', 'Aspirante a Consejo Directivo', 'public/media/user.jpeg'),
('Suarez Forero Gabriel', 'Consejo', 'Aspirante a Consejo Directivo', 'public/media/user.jpeg'),
('Beltran Lambaño Stheven', 'Consejo', 'Aspirante a Consejo Directivo', 'public/media/user.jpeg');
