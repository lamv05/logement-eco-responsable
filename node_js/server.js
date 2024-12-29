const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware pour gérer les requêtes JSON et URL-encoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Connexion à la base de données SQLite
const db = new sqlite3.Database('./logement.db', (err) => {
  if (err) {
    console.error('Erreur lors de la connexion à la base de données:', err.message);
  } else {
    console.log('Connexion réussie à la base de données SQLite.');
  }
});

// API : Récupérer tous les capteurs/actionneurs
app.get('/api/capteurs-actionneurs', (req, res) => {
  const query = `
    SELECT 
      ca.id, 
      ca.reference_commerciale, 
      ca.insert_date, 
      p.nom AS piece_name, 
      tca.unite AS type_name, 
      ca.port_com_serv
    FROM 
      capteur_actionneur ca
    LEFT JOIN 
      piece p ON ca.reference_piece = p.id
    LEFT JOIN 
      type_capteur_actionneur tca ON ca.type_device = tca.id;
  `;
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Erreur lors de la récupération des données:', err.message);
      res.status(500).json({ error: 'Erreur serveur' });
    } else {
      res.json(rows);
    }
  });
});

// API : Ajouter un capteur/actionneur
app.post('/api/capteurs-actionneurs', (req, res) => {
  const { reference_commerciale, reference_piece, type_device, port_com_serv } = req.body;
  const query = `
    INSERT INTO capteur_actionneur (reference_commerciale, reference_piece, type_device, port_com_serv)
    VALUES (?, ?, ?, ?)
  `;
  db.run(query, [reference_commerciale, reference_piece, type_device, port_com_serv], function (err) {
    if (err) {
      console.error('Erreur lors de l\'ajout:', err.message);
      res.status(500).json({ error: 'Erreur serveur' });
    } else {
      res.status(201).json({ id: this.lastID });
    }
  });
});

// API : Supprimer un capteur/actionneur
app.delete('/api/capteurs-actionneurs/:id', (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM capteur_actionneur WHERE id = ?`;
  db.run(query, [id], function (err) {
    if (err) {
      console.error('Erreur lors de la suppression:', err.message);
      res.status(500).json({ error: 'Erreur serveur' });
    } else {
      res.status(200).json({ deleted: this.changes });
    }
  });
});

// API : Récupérer les mesures d'un capteur/actionneur
app.get('/api/mesures/:capteurId', (req, res) => {
    const { capteurId } = req.params;
    const query = `
      SELECT valeur, insert_date
      FROM mesure
      WHERE capteur_actionneur_id = ?
      ORDER BY insert_date DESC
      LIMIT 10
    `;
    db.all(query, [capteurId], (err, rows) => {
      if (err) {
        console.error('Erreur lors de la récupération des mesures:', err.message);
        res.status(500).json({ error: 'Erreur serveur' });
      } else {
        res.json(rows);
      }
    });
  });

// API : Récupérer la consommation par type de facture (électricité, eau, gaz)
app.get('/api/consommation', (req, res) => {
    const type = req.query.type; // Récupérer le type de facture depuis la query string
    const query = `
      SELECT type_facture, date_facture, consommation
      FROM facture
      WHERE type_facture LIKE ?
      ORDER BY date_facture;
      LIMIT 10
    `;
    db.all(query, [type], (err, rows) => {
      if (err) {
        console.error('Erreur lors de la récupération des factures:', err.message);
        res.status(500).json({ error: 'Erreur serveur' });
      } else {
        res.json(rows);
      }
    });
  });
  
// Route pour récupérer les 24 dernières factures d'un type spécifique
app.get('/api/economie', (req, res) => {
    const typeFacture = req.query.type;

    const query = `
        SELECT * FROM facture
        WHERE type_facture = ?
        ORDER BY date_facture DESC
        LIMIT 24
    `;
    
    db.all(query, [typeFacture], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.json(rows);
    });
});


// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
