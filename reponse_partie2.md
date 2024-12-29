# Réponse parite 2 Serveur RESTful

Dans cette partie, le framework utilisé pour le serveur est fastapi 
Le fichier contenant les réponses est fastapi/main.py ou nodejs/main.py

### Question 1

Pour consulter une Table 

De ligne 143 à 169 j'ai défini des URI qui vont effectuer une requête GET accédant à la BDD via les fonctions proveneant de la library sqlite comme dans la partie 1.2

Par exemple 
```
@app.get("/mesure")
async def param(id: str=0):
    rqst=("SELECT * FROM mesure")
    if int(id)!=0:
        rqst=rqst+(" WHERE capteur_actionneur_id=%s" % id)
    print(rqst)
    response=db_request(rqst)
    return response
```
Permet d'obtenir les mesures de la BDD sur le chemin /mesure et permet également de filtrer quelle appareil en entrant l'id de l'appareil en paramètre 
Commande Curl
```
curl -X 'GET' \
  'http://localhost:8000/mesure?id=0' \
  -H 'accept: application/json'
```

La fonction *db_request(rqst)* effectue la requête auprès de la BDD, la fonction se trouve dans le même fichier de ligne 15 à 23

Pour remplir une Table

De ligne 32 à 140, on défini des URI qui réalise des requête POST en initialisant les classe pour chaque table au préalable

Par exemple 
```
# Définition class logement
class logement(BaseModel):
    adresse: str
    num_tel: str 
    adresse_ip: str
```
```
# Définition URL
@app.post("/add-logement/")
async def create_logement(logement: logement):
    print(logement)
    adresse=logement.adresse
    num_tel=logement.num_tel
    adresse_ip=logement.adresse_ip

    rqst=("INSERT INTO logement(adresse,num_tel,adresse_ip) VALUES (%s,%s,%s)" % adresse,num_tel,adresse_ip)

    db_request(rqst)

    return logement
```
Commande curl
```
curl -X 'POST' \
  'http://localhost:8000/add-logement/' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "adresse": "France",
  "num_tel": "000000000",
  "adresse_ip": "123.123.123.123.123"
}'
```

### Question 2 

De ligne 172 à 201, on définit un URL renvoyant une réponse HTML, cette fonction va récuperer les différent types de facture puis les afficher sur un Template html dans le fichier fastapi/template/chart.html utilisant l'API de google chart pour afficher les données récupéré sur un graphique circulaire.

Voici la commande curl pour acceder au graphique

```
curl -X 'GET' \
  'http://localhost:8000/chart?id=0' \
  -H 'accept: text/html'
```

On peut également entrer en paramètre un id correspondant à l'ID du logement

### Question 3

De ligne 203 à 234, on définit un URI effectuant une requête auprès de l'API d'open weather définit ligne 12 et 13. On affiche ensuite les information avec une réponse html comme la question précedente.

### Question 4

Réponse dans fichier esp_dht.ino configurant un esp32 de façon à ce qu'il effectue des requête HTTP POST des mesures effectué par le capteur http.
De plus, la LED de l'esp s'allume ou s'eteint en fonction de la température mesuré dans la BDD en effectuant des requête gest au chemin /last-mesure



