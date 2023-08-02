# ReadMe

## Požadavky na spuštění

S použitím nástroje Docker by neměl být problém spustit aplikaci na jakékoliv platformě podporující Docker. Já jsem aplikaci testoval pouze na platformě Windows, proto budu daný návod psát pro tuto platformu.

Docker nainstalujeme dle návodu (https://docs.docker.com/desktop/install/windows-install/). Já zvolil verzi Docker for Windows, která obsahuje jak potřebný Docker tak Docker compose, avšak tyto aplikace je možné nainstalovat i samostatně.

## Windows

## Ubuntu server

Při zvolení image ubuntu server, je nejprve potřeba nainstalovat docker.
Jelikož přes virtualbox nejde pohodlně vkládat příkazy ze schránky do gui-less prostředí, využíval jsem pro připojení SSH.
SSH serverf již defaultně v image běží, je tedy potřeba přidat pouze přesměrování.
Nastavení (VM) -> Síť -> Pokročilé -> Předávání portů -> Zde založit záznam dle screenu.
![Alt text](./readmeImages/image.png)
Poté je možné se do VM připojit přes jakéhokoliv SSH klienta (putty, kitty) pod adresou localhost:2222.

Kromě tohoto SSH portu je potřeba ještě přidat další porty (80, 5199, 3000) pro funkčnost aplikace.
![Alt text](./readmeImages/image2.png)

### Instalace dockeru

Postupoval jsem dle oficiální dokumentace.

1. přidání docker repozitáře

```
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg

sudo install -m 0755 -d /etc/apt/keyrings
 curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

 sudo chmod a+r /etc/apt/keyrings/docker.gpg
 echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

2. stažení informací o novém repozitáři

```
sudo apt-get update
```

3. samotná instalace Dockeru

```
 sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### Naklonování aplikace

Je potřeba se přesunout do adresáře s aplikací.

- Ten buď máte již k dispozici
- případně je možné si jej stáhnout příkazem:

```
git clone https://github.com/panda7789/videoportal2 --depth 1
cd ./videoportal2/docker
```

Poté je již možné spusti jeden z docker compose.
Pro vyzkušení doporučuji spustit si demo aplikace.

## Demo aplikace

Pro potřeby prezentace aplikace jsem vytvořil soubor _docker-compose-demo.yml_, který vytvoří aplikaci a naplní ji ukázkovými daty.

Kontejnery se spustí příkazem:

```powershell
sudo docker compose --file docker-compose-demo.yml up --build
```

Při vytváření se databáze naplní daty z sql souboru _/docker/db/demo.sql_. \
Dále se pro fileserver použije adresář _/docker/fileserver/demo_

Aplikaci je opět možné nalézt na adrese

> <http://localhost:80>

Kromě administrátorského uživatele jsou zde vytvořeny i další uživatelé:

| uživatelské jméno | heslo |
| ----------------- | ----- |
| aa@tt.cc          | 123   |
| upol@upol.cz      | 123   |
| adam@adam.cz      | 123   |
| nyan@cat.cz       | 123   |

## Výchozí spuštění

Pro jednoduché spuštění je vytvořen ve složce _docker_ soubor _docker-compose.yml_.
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

## Build aplikace

Pokud byly změněny zdrojové kódy backendu nebo frontendu, je možné spustit build také pomocí docker kontejneru.

Jedná se o soubor _/docker/docker-compose-build.yml_, který lze spustit příkazem:

```
docker compose --file docker-compose-build.yml up --build
```

Po spuštění se pro backend vytvoří kontejner api-build, který serverovou část zkompiluje a vypublikuje zpět do složky _/backend/publish_. Z této složky potom využívají další docker kontejnery pro spuštění.

Pro frontend se vytvoří kontejner frontend-build, který nejprve nainstaluje potřebné npm balíčky a poté pomocí nástroje vite frontendovou část aplikace zkompiluje a připraví pro produkční prostředí. Výsledek kompilace je možné nalézt v adresáři _/frontend/dist_, ze kterého opět čerpají ostatní docker kontejnery, pro spuštění.

Prvotní instalace balíčků může trvat delší dobu, avšak balíčky se místo do kontejneru instalují přímo na hostitelský disk, takže při příštím buildu se znovu stahovat nemusí.

## Dev prostředí aplikace

Kromě již zmíněných docker compose souborů existuje ještě _docker-compose-dev.yml_, který složí primárně pro vývoj.

Kontejnery je možné spustit příkazem:

```
docker compose --file docker-compose-dev.yml up --build
```

Po spuštění je vytvořena databáze, bacnendový server a fileserver.
Bohužel se mi nepodařilo přidat i vývojový kontejner pro frontendovou část aplikace. Tu si je tedy nutné spustit bokem.

Nejprve je potřeba otevřít projekt _/frontend_ ve VS Code (případně jiném editoru). \
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
