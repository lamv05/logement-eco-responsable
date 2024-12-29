import sqlite3, random
from datetime import datetime, timedelta
from random_address import real_random_address



# ouverture/initialisation de la base de donnee 
conn = sqlite3.connect('logement.db')
conn.row_factory = sqlite3.Row
c = conn.cursor()

# Ajout de logements 

def remplir_logements(nb: int):

    for _ in range (nb):

        adresse=real_random_address()
        adresse=adresse['address1']+" "+adresse['postalCode'] 
        num_tel= "+"+str(random.randint(1,999))+" "+str(random.randint(1,100))+"."+str(random.randint(1,100))+"."+str(random.randint(1,100))+"."+str(random.randint(1,100))+"."+str(random.randint(1,100))
        ip_address=str(random.randint(1,255))+"."+str(random.randint(1,255))+"."+str(random.randint(1,255))+"."+str(random.randint(1,255))
        c.execute("""
                 INSERT INTO logement (adresse, num_tel, adresse_ip)
                 VALUES (?, ?, ?)
            """, (adresse, num_tel, ip_address))
        
def remplir_piece(max_piece: int):
    c.execute("SELECT id FROM logement")
    logements_id = c.fetchall()

    #12
    type_piece =["Entrée","Salle à manger","Salon","Chambre","Véranda","Salle de bain","Bureau","Cuisine","Cave","Couloir","Escalier","WC"]
    latitude= round(random.uniform(-90,90),5)
    longitude= round(random.uniform(-180,180),5)
    altitude= round(random.uniform(-20,1000),2)
    

    for logement in logements_id:

        latitude= round(random.uniform(-90,90),5)
        longitude= round(random.uniform(-180,180),5)
        altitude= round(random.uniform(-20,1000),2)

        for i in range (random.randint(2,max_piece)-1):

            nom_piece=random.choice(type_piece)
            i_latitude=round(latitude+random.uniform(-1,1),5)
            i_longitude=round(longitude+random.uniform(-1,1),5)
            coordinates="{"+str(i_latitude)+","+str(i_longitude)+","+str(altitude)+"}"
            c.execute("""
                 INSERT INTO piece (nom, localisation, logement_id)
                 VALUES (?, ?, ?)
            """, (nom_piece, coordinates, logement["id"]))



# def remplir_mesure(nb_mesure: int):
#     c.execute("SELECT id FROM capteur_actionneur")
#     capteurs = c.fetchall()

#     for capteur in capteurs:

#         for _ in range(nb_mesure):

#                 valeur = round(random.uniform(10, 100), 2)  
#                 c.execute("""
#                         INSERT INTO mesure (valeur, capteur_actionneur_id)
#                         VALUES (?, ?)
#                         """, (valeur, capteur["id"]))
                

# def remplir_facture(nb_facture: int):
#     c.execute("SELECT id FROM logement")
#     logements = c.fetchall()
#     types_facture = ["eau", "electricite", "gaz", "dechets"]

#     for logement in logements:


# 1. Ajouter des mesures pour les capteurs
def ajouter_mesures(nombre_mesures):
    # Récupère tous les capteurs
    c.execute("SELECT id FROM capteur_actionneur")
    capteurs = c.fetchall()

    for capteur in capteurs:
        capteur_id = capteur["id"]
        for _ in range(nombre_mesures):
            # Valeur de mesure aléatoire
            valeur = round(random.uniform(10, 100), 2)  # Par exemple, une valeur entre 10 et 100
            # Date de mesure aléatoire
            date_mesure = datetime.now() - timedelta(days=random.randint(0, 30))
            # Insertion de la mesure dans la table
            c.execute("""
                INSERT INTO mesure (capteur_actionneur_id, valeur, insert_date)
                VALUES (?, ?, ?)
            """, (capteur_id, valeur, date_mesure))

#faire un switch case pour adapter les valeurs en fct du type de facturers
# 2. Ajouter des factures pour les logements
def ajouter_factures(nombre_factures):
    # Récupère tous les logements
    c.execute("SELECT id FROM logement")
    logements = c.fetchall()

    # Types de factures possibles
    types_facture = ["eau", "electricite", "gaz", "dechets"]

    for logement in logements:
        logement_id = logement["id"]
        for _ in range(nombre_factures):
            # Type de facture aléatoire
            type_facture = random.choice(types_facture)
            # Montant et consommation aléatoires
            montant = round(random.uniform(50, 200), 2)  # Entre 50 et 200 unités monétaires
            consommation = random.randint(100, 500)  # Consommation entre 100 et 500 unités
            # Date de facture aléatoire
            date_facture = datetime.now() - timedelta(days=random.randint(0, 365))
            # Insertion de la facture dans la table
            c.execute("""
                INSERT INTO facture (type_facture, date_facture, montant, consommation, logement_id)
                VALUES (?, ?, ?, ?, ?)
            """, (type_facture, date_facture, montant, consommation, logement_id))



remplir_logements(nb=10) 
remplir_piece(max_piece=7)
ajouter_mesures(nombre_mesures=10)
ajouter_factures(nombre_factures=5)


# fermeture
conn.commit()
conn.close()