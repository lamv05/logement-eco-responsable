-- Question 2

DROP TABLE IF EXISTS logement;
DROP TABLE IF EXISTS piece;
DROP TABLE IF EXISTS type_capteur_actionneur;
DROP TABLE IF EXISTS capteur_actionneur;
DROP TABLE IF EXISTS mesure;
DROP TABLE IF EXISTS facture;

-- Question 3

CREATE TABLE logement (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        adresse TEXT NOT NULL,
        num_tel TEXT NOT NULL,
        adresse_ip TEXT NOT NULL,
        insert_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE piece (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL,
        localisation TEXT,
        logement_id INTEGER,
        FOREIGN KEY (logement_id) REFERENCES logement(id)
    );

CREATE TABLE type_capteur_actionneur (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        unite TEXT NOT NULL,
        others TEXT
    );

CREATE TABLE capteur_actionneur (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reference_commerciale TEXT NOT NULL,
        insert_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reference_piece INTEGER,
        type_device INTEGER,
        port_com_serv INTEGER,
        FOREIGN KEY (reference_piece) REFERENCES piece(id),
        FOREIGN KEY (type_device) REFERENCES type_capteur_actionneur(id)
    );

CREATE TABLE mesure (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        valeur FLOAT,
        insert_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        capteur_actionneur_id INTEGER,
        FOREIGN KEY (capteur_actionneur_id) REFERENCES capteur_actionneur(id)
    );

CREATE TABLE facture (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type_facture TEXT NOT NULL,
        date_facture DATE,
        montant FLOAT,
        consommation FLOAT,
        logement_id INTEGER, 
        FOREIGN KEY (logement_id) REFERENCES logement(id)
    );

-- Question 4 créer un logement avec 4 pièces

INSERT INTO logement(adresse,num_tel,adresse_ip) VALUES ("20 rue Grande Fusterie","04.83.52.14.39","192.168.221.62");

INSERT INTO piece(nom,localisation,logement_id) VALUES ("cuisine","{-31.11515,144.26248,200}",(SELECT id FROM logement WHERE adresse = "20 rue Grande Fusterie"));


INSERT INTO piece(nom,localisation,logement_id) VALUES ("chambre","{-40.115,150.248,200}",(SELECT id FROM logement WHERE adresse = "20 rue Grande Fusterie"));
INSERT INTO piece(nom,localisation,logement_id) VALUES ("salon","{-20.155,1.268,200}",(SELECT id FROM logement WHERE adresse = "20 rue Grande Fusterie"));
INSERT INTO piece(nom,localisation,logement_id) VALUES ("salle de bain","{-10.11515,184.28,200}",(SELECT id FROM logement WHERE adresse = "20 rue Grande Fusterie"));

-- Question 5 créer au moins 4 types de capteurs/actionneurs

INSERT INTO type_capteur_actionneur(unite) VALUES ("temperature (°C)");
INSERT INTO type_capteur_actionneur(unite) VALUES ("humidite (%)");
INSERT INTO type_capteur_actionneur(unite) VALUES ("pression (bar)");
INSERT INTO type_capteur_actionneur(unite) VALUES ("luminosite (lux)");

-- Question 6 créer au moins 2 capteurs/actionneurs

INSERT INTO capteur_actionneur (reference_commerciale, reference_piece, type_device,port_com_serv) 
VALUES (
    "LM35DZ",
    (SELECT p.id FROM piece p JOIN logement l ON p.logement_id = l.id WHERE p.nom = "cuisine" AND l.adresse = "20 rue Grande Fusterie"),
    (SELECT id FROM type_capteur_actionneur WHERE unite = "temperature (°C)"),
    1000
);

INSERT INTO capteur_actionneur (reference_commerciale, reference_piece, type_device,port_com_serv) 
VALUES (
    "ML53ZD",
    (SELECT p.id FROM piece p JOIN logement l ON p.logement_id = l.id WHERE p.nom = "salle de bain" AND l.adresse = "20 rue Grande Fusterie"),
    (SELECT id FROM type_capteur_actionneur WHERE unite = "humidite (%)"),
    2000
);

INSERT INTO capteur_actionneur (reference_commerciale, reference_piece, type_device,port_com_serv) 
VALUES (
    "DHT11",
    "salle de bain",
    (SELECT id FROM type_capteur_actionneur WHERE unite = "temperature (°C)"),
    "1"
);

INSERT INTO capteur_actionneur (reference_commerciale, reference_piece, type_device,port_com_serv) 
VALUES (
    "ESP8266 LED",
    "salle de bain",
    "2"
);

-- Question 7 créer 2 mesures par capteur/actionneur

INSERT INTO mesure(valeur,capteur_actionneur_id) 
VALUES (
    "19",
    (SELECT id FROM type_capteur_actionneur WHERE unite="temperature (°C)")
);

INSERT INTO mesure(valeur,capteur_actionneur_id) 
VALUES (
    "22",
    (SELECT id FROM type_capteur_actionneur WHERE unite="temperature (°C)")
);

INSERT INTO mesure(valeur,capteur_actionneur_id) 
VALUES (
    "56",
    (SELECT id FROM type_capteur_actionneur WHERE unite="humidite (%)")
);

INSERT INTO mesure(valeur,capteur_actionneur_id) 
VALUES (
    "60",
    (SELECT id FROM type_capteur_actionneur WHERE unite="humidite (%)")
);
-- Question 8 créer 4 factrures

INSERT INTO facture(type_facture,date_facture,montant,consommation,logement_id)
VALUES (
   "electricite (kWh)",
   "12/11/2024",
   1509.6,
   6000,
   (SELECT id FROM logement WHERE adresse="20 rue Grande Fusterie")
);

INSERT INTO facture(type_facture,date_facture,montant,consommation,logement_id)
VALUES (
   "eau (m3)",
   "12/05/2024",
   50.1,
   10.1,
   (SELECT id FROM logement WHERE adresse="20 rue Grande Fusterie")
);

INSERT INTO facture(type_facture,date_facture,montant,logement_id)
VALUES (
   "gaz",
   "12/02/2024",
   1000.1,
   (SELECT id FROM logement WHERE adresse="20 rue Grande Fusterie")
);

INSERT INTO facture(type_facture,date_facture,montant,consommation,logement_id)
VALUES (
   "données mobile (Mo)",
   "12/01/2024",
   19.99,
   5000,
   (SELECT id FROM logement WHERE adresse="20 rue Grande Fusterie")
);


