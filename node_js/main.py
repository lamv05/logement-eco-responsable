from fastapi import FastAPI,HTTPException
from pydantic import BaseModel
import sqlite3
from fastapi import  Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from collections import Counter
import httpx

#openweather api
API_KEY = "8623114add1f450a2f06de44298ad65b"  
BASE_URL = "https://api.openweathermap.org/data/2.5/forecast"

def db_request(rqst: str):
    conn = sqlite3.connect('logement.db')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute(rqst)
    response=c.fetchall()
    conn.commit()
    conn.close()
    return response


app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")


class logement(BaseModel):
    adresse: str
    num_tel: str 
    adresse_ip: str

class piece(BaseModel):
    nom: str
    localisation: str 
    logement_id: int

class type_capteur_actionneur(BaseModel):
    unite: str
    other: str=""
    
class capteur_actionneur(BaseModel):
    reference_commerciale: str
    reference_piece: str
    type_device: str
    port_com_serv: int

class mesure(BaseModel):
    value: float
    capteur_actionneur_id: int 
    

class facture(BaseModel):
    type: str
    date: str 
    price: float
    consommation: float 
    logement_id : int

@app.post("/add-logement/")
async def create_logement(logement: logement):
    print(logement)
    adresse=logement.adresse
    num_tel=logement.num_tel
    adresse_ip=logement.adresse_ip

    rqst=("INSERT INTO logement(adresse,num_tel,adresse_ip) VALUES (%s,%s,%s)" % adresse,num_tel,adresse_ip)

    db_request(rqst)

    return logement

@app.post("/add-piece/")
async def create_piece(piece: piece):
    print(piece)
    nom=piece.nom
    localisation=piece.localisation
    logement_id=piece.logement_id

    rqst=("INSERT INTO piece(nom,localisation,logement_id) VALUES (%s,%s,%s)" % nom,localisation,logement_id)

    db_request(rqst)

    return piece

@app.post("/add-type_capteur/")
async def create_type_capteur(type_capteur: type_capteur_actionneur):
    print(type_capteur)
    unite=type_capteur.unite
    other=type_capteur.other

    rqst=("INSERT INTO type_capteur_actionneur(unite,other) VALUES (%s,%s)" % unite,other)

    db_request(rqst)

    return type_capteur

@app.post("/add-capteur/")
async def create_capteur(capteur: capteur_actionneur):
    print(capteur)
    reference_commerciale=capteur.reference_commerciale
    reference_piece=capteur.reference_piece
    type_device=capteur.type_device
    port_com_serv=capteur.port_com_serv

    rqst=("INSERT INTO capteur_actionneur(reference_commerciale,reference_piece,type_device,port_com_serv) VALUES (%s,%s,%s,%s)" % reference_commerciale,reference_piece,type_device,port_com_serv)

    db_request(rqst)

    return capteur

@app.post("/add-mesure/")
async def create_mesure(mesure: mesure):
    print(mesure)
    value=mesure.value
    capteur_actionneur_id=mesure.capteur_actionneur_id

    rqst="INSERT INTO mesure(valeur,capteur_actionneur_id) VALUES (\""+str(value)+"\",\""+str(capteur_actionneur_id)+"\");"

    db_request(rqst)

    return mesure

@app.post("/add-facture/")
async def create_facture(facture: facture):
    print(facture)
    type=facture.type
    date=facture.date
    montant=facture.price
    consommation=facture.consommation
    logement=facture.logement_id

    rqst="INSERT INTO facture(type_facture,date_facture,montant,consommation,logement_id) VALUES (\""+str(type)+"\",\""+str(date)+"\",\""+str(montant)+"\",\""+str(consommation)+"\",\""+str(logement)+"\");"
    db_request(rqst)

    return facture


@app.get("/read-{table}")
async def param(table: str,id: str=0,key: str=""):
    if key!="":
        rqst=("SELECT %s" % key)
    else:
        rqst=("SELECT *")
    rqst=rqst+(" FROM %s" % table)
    if int(id)!=0:
        rqst=rqst+(" WHERE id=%s" % id)
    print(rqst)
    response=db_request(rqst)
    return response

@app.get("/last-mesure")
async def param(capteur_id: int=0):
    rqst="SELECT valeur FROM mesure WHERE id=(SELECT max(id) FROM mesure) AND capteur_actionneur_id="+str(capteur_id)
    mesure = db_request(rqst)
    return mesure[0]


@app.get("/chart", response_class=HTMLResponse)
async def chart(request: Request,id: int=0):
    
    
    if id>0:  
        rqst = "SELECT type_facture FROM facture WHERE logement_id="+str(id)
    else:
        rqst = "SELECT type_facture FROM facture"


    factures=db_request(rqst)
    factures = [row[0] for row in factures]
    print(factures)
    compte_factures = Counter(factures)
    types_factures = list(compte_factures.keys())
    print(compte_factures)
    chart_data=[]

    #parcours du tableau

    for types in types_factures:

        i=0        
        

        chart_data.append([types,compte_factures[types]])

        i=i+1

    print(chart_data)
    return templates.TemplateResponse(
        "chart.html", {"request": request, "chart_data": chart_data}
    )

@app.get("/meteo", response_class=HTMLResponse)
async def get_weather(request: Request, city: str):
   
    params = {
        "q": city,
        "appid": API_KEY,
        "units": "metric",
        "cnt": 5  # Nombre de jours
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(BASE_URL, params=params)
    
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Erreur lors de l'appel à l'API météo")
    
    data = response.json()

    # Traiter les données pour les rendre utilisables dans le template
    forecasts = []
    for forecast in data["list"]:
        forecasts.append({
            "date": forecast["dt_txt"],
            "temperature": forecast["main"]["temp"],
            "description": forecast["weather"][0]["description"]
        })
    
    # Rendre le template HTML avec les prévisions
    return templates.TemplateResponse(
        "meteo.html",
        {"request": request, "city": city, "forecasts": forecasts}
    )

@app.get("/get-temperature")
async def get_temp(city: str="paris"):
   
    params = {
        "q": city,
        "appid": API_KEY,
        "units": "metric",
        "cnt": 1  # Nombre de jours
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(BASE_URL, params=params)
    
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Erreur lors de l'appel à l'API météo")
    
    data = response.json()

    # Traiter les données pour les rendre utilisables dans le template
    forecasts = []
    for forecast in data["list"]:
        forecasts.append({
            "date": forecast["dt_txt"],
            "temperature": forecast["main"]["temp"],
            "description": forecast["weather"][0]["description"]
        })
    return forecast