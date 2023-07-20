# ReadMe

## Požadavky na spuštění
S použitím nástroje Docker by neměl být problém spustit aplikaci na jakékoliv platformě podporující Docker. Já jsem aplikaci testoval pouze na platformě Windows, proto budu daný návod psát pro tuto platformu.

Docker nainstalujeme dle návodu (https://docs.docker.com/desktop/install/windows-install/). Já zvolil verzi Docker for Windows, která obsahuje jak potřebný Docker tak Docker compose, avšak tyto aplikace je možné nainstalovat i samostatně.



## Výchozí spuštění
Pro jednoduché spuštění je vytvořen ve složce *docker* soubor *docker-compose.yml*.
V powershellu otevřeme zmíněnou složku /docker a spustíme příkaz:
```powershell
docker compose --file docker-compose.yml up --build
```

Tento příkaz vytvoří a spustí následující kontejnery:
- frontend
  - kontejner vytvoří webový server nad zkompilovanou veřejnou částí aplikace
  - definice image - /frontend/Dockerfile
  - vystavený port 80
- api
  - kontejner vytváří serverovou část aplikace
  - definice image - /backend/Backend/Dockerfile
  - vystavený port 5199
  - namapuje složku pro nahrávání souborů
- db
  - databáze slouží pro uložení dat
  - oficiální image mysql
  - vystavený port 3306
  - data ukládá do adresáře /docker/db/data
  - přihlašovací údaje je možné dohledat v definici
- file-server
  - kontejner zpřístupní obsah složky na http rozhraní
  - definice image - /docker/fileserver/dockerfile
  - vystavený port 3000
  - data ukládá do adresáře /docker/fileserver/data
- wait-for-db
  - kontejner čeká až bude připravena databáze a až poté spouští další části aplikace

Po spuštění běží aplikace na adrese
> <http://localhost:80>

Ve výchozím stavu se vytvoří administrátorský účet:
> uživatelské jméno: admin@admin.cz\
> heslo: 123


## Demo aplikace
Pro potřeby prezentace aplikace jsem vytvořil soubor *docker-compose-demo.yml*, který vytvoří aplikaci a naplní ji ukázkovými daty.

Kontejnery se spustí příkazem:
```powershell
docker compose --file docker-compose-demo.yml up --build
```

Při vytváření se databáze naplní daty z sql souboru */docker/db/demo.sql*. \
Dále se pro fileserver použije adresář */docker/fileserver/demo*



Aplikaci je opět možné nalézt na adrese
> <http://localhost:80>

Kromě administrátorského uživatele jsou zde vytvořeny i další uživatelé:

|uživatelské jméno|heslo|
|-|-|
|aa@tt.cc|123|
|upol@upol.cz|123|
|adam@adam.cz|123|
|nyan@cat.cz|123|

## Build aplikace
Pokud byly změněny zdrojové kódy backendu nebo frontendu, je možné spustit build také pomocí docker kontejneru.

Jedná se o soubor */docker/docker-compose-build.yml*, který lze spustit příkazem:
```
docker compose --file docker-compose-build.yml up --build
```

Po spuštění se pro backend vytvoří kontejner api-build, který serverovou část zkompiluje a vypublikuje zpět do složky */backend/publish*. Z této složky potom využívají další docker kontejnery pro spuštění.

Pro frontend se vytvoří kontejner frontend-build, který nejprve nainstaluje potřebné npm balíčky a poté pomocí nástroje vite frontendovou část aplikace zkompiluje a připraví pro produkční prostředí.  Výsledek kompilace je možné nalézt v adresáři */frontend/dist*, ze kterého opět čerpají ostatní docker kontejnery, pro spuštění.

Prvotní instalace balíčků může trvat delší dobu, avšak balíčky se místo do kontejneru instalují přímo na hostitelský disk, takže při příštím buildu se znovu stahovat nemusí.

## Dev prostředí aplikace
Kromě již zmíněných docker compose souborů existuje ještě *docker-compose-dev.yml*, který složí primárně pro vývoj.

Kontejnery je možné spustit příkazem:
```
docker compose --file docker-compose-dev.yml up --build
```

Po spuštění je vytvořena databáze, bacnendový server a fileserver.
Bohužel se mi nepodařilo přidat i vývojový kontejner pro frontendovou část aplikace. Tu si je tedy nutné spustit bokem.

Nejprve je potřeba otevřít projekt */frontend* ve VS Code (případně jiném editoru). \
Nainstalovat npm balíčky přes příkaz
```
npm i
```
a poté spustit frontend lokálně přes příkaz
```
npm run start
```

Po spuštění příkazu se spustí vite server, který aplikaci zkompiluje a spustí.\
Poté stačí upravit jakýkoliv soubor v projektu, nástroj vite změnu zdetekuje a potřebné části aplikace překompiluje. V otevřeném prohlížeči se tak provedené změny projeví automaticky, případně po manuálním refreshi.