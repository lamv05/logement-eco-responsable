# Projet site internet - Logement éco-responsable

## Contenu

Ce repository contient les sources pour créer la base de donnée ainsi que le site internet utilisant 2 framework différents **nodejs** et **fastapi**. Un ficher réponse aux questions s'y trouve également.

Ayant d'abord réalisé le site avec nodejs j'ai tenu a utilisé fastapi car nous l'avons vu en cours. De ce fait la version du site sur nodejs est plus complète que celle avec fastapi et constitue la version prise en compte pour l'évaluation.

Je me suis fortement appuyé sur chatgpt pour ce projet dont voici le lien vers les prompt 
[https://chatgpt.com/share/6769e6c2-2094-8004-a319-c54a1477581a](url)


## Pour lançer le serveur 

### nodejs

Dependencies

npm install 
- sqlite3 [https://github.com/TryGhost/node-sqlite3](url)
- express [https://github.com/expressjs/express](url)

Pour lançer le serveur executer la commande dans le répertoire contenant le fichier **server.js**:
```
node server.js
```

### fastapi

Dependencies

pip install 
- fastapi
- jinja2


Pour lançer le serveur executer la commande dans le répertoire contenant le fichier **main.py**:
```
fastapi run
```

