# Réponses aux questions de la partie 1 Base de données 

Les réponses des questions 1 à 8 se trouvent dans le fichier bdd/logement.sql

### Question 1 

Voici le modèle relationnel de ma base de données

<img src="https://github.com/lamv05/logement-eco-responsable/blob/master/model_relationnel.png" width="1000"/><br/>

### Question 2

De ligne 3 à 8, on supprime la TABLE si elle existe déjà avec l'odre
```
DROP TABLE IF EXISTS logement;
```

### Question 3

De ligne 12 à 61, on créer la TABLE avec l'ordre 
```
CREATE TABLE logement (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        adresse TEXT NOT NULL,
        num_tel TEXT NOT NULL,
        adresse_ip TEXT NOT NULL,
        insert_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
```
puis en précisiant les champs par la suite

### Question 4 créer un logement avec 4 pièces

De ligne 65 à 72, on utilise l'ordre 
```
INSERT INTO logement(adresse,num_tel,adresse_ip) VALUES ("20 rue Grande Fusterie","04.83.52.14.39","192.168.221.62");
```
pour ajouter dse élément dans une table

### Question 5 créer au moins 4 types de capteurs/actionneurs 

De ligne 76 à 79, pareil que question précedente

### Question 6 créer au moins 2 capteurs/actionneurs

De ligne 83 à 112, pareil que question précedente au lieu de mettre directement la valeur on peut également la prendre d'une autre TABLE avec l'ordre 
```
SELECT id FROM type_capteur_actionneur WHERE unite = "temperature (°C)
```

### Question 7 créer 2 mesures par capteur/actionneur

De ligne 116 à 138, pareil que question précedente

### Question 8 créer 4 factures

De ligne 141 à 174, pareil que question précedente

## 1.2 Remplissage de la base de données

Réponse dans le fichier bdd/remplissage.py
On rempli la BDD à l'aide de fonctions qui accèdent à la base de donnée avec la library sqlite3 et les fonctions 

```
#initialiser de la base de donnee

conn = sqlite3.connect('logement.db')
conn.row_factory = sqlite3.Row
c = conn.cursor()

#executer des ordres
c.execute("*ordre*")
```
