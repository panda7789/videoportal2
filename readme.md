# Video portál

Webová aplikace sloužící k nahrávání a přehrávání videa.
Jedná se o full-stack projekt, tedy .NET server a react klient.

Vyrobeno jako projekt pro bakalářskou práci.

## Funkcionality

- nahrávání a přehrávání videa
- přihlášení, registrace a správa uživatelů
- tvoření playlistů
- generování náhledu videa
- komentáře, hodnocení
- tagy
- uživatelské skupiny
- vlastní hostování

## Architektura

Aplikace se skládá z backendu který je napsaný v .NET, pro komunikaci s MySQL databází se využívá framework EFCore.\
Backend vystavuje své rozhraní pomocí [swaggeru](https://videoportal.panda7789.fun/api/swagger)\
S backendem komunikuje frontend který je napsaný nad reactem.
Pro generování rozhraní je využívána knihovna [react-query-swagger
](https://github.com/shaddix/react-query-swagger).

## Požadavky na spuštění

Demo aplikace běží na adrese (https://videoportal.panda7789.fun), zde je možné si aplikaci vyzkoušet.

Pro testování byl vytvořen docker-compose, který jediným příkazem spustí všechno potřebné. \
Samozřejmě je možné hostovat i jednotlivé komponenty aplikace zvlášť, například pokud již mám existující databázi a chci ji využít.

### Naklonování aplikace

```
git clone https://github.com/panda7789/videoportal2 --depth 1
```

## Docker

Pokud si chceme aplkaci vzkoušet, nebo přispět k vývoji, je určitě vhodné využít docker kontejnery.
<details>
  <summary>Docker</summary>
Pokud již máte docker nainstalovaný, můžete rovnou přeskočit na další sekci.

<details>
  <summary>Instalace dockeru</summary>

### Windows
<details>
  <summary>Instalace dockeru na windows</summary>
Docker nainstalujeme dle návodu (https://docs.docker.com/desktop/install/windows-install/). Já zvolil verzi Docker for Windows, která obsahuje jak potřebný Docker tak Docker compose, avšak tyto aplikace je možné nainstalovat i samostatně.
</details>

### Ubuntu server

<details>
  <summary>Poznámka pro virtuální ubuntu server</summary>
Při zvolení image ubuntu server, je nejprve potřeba nainstalovat docker.
Jelikož přes virtualbox nejde pohodlně vkládat příkazy ze schránky do gui-less prostředí, využíval jsem pro připojení SSH.
SSH serverf již defaultně v image běží, je tedy potřeba přidat pouze přesměrování.
Nastavení (VM) -> Síť -> Pokročilé -> Předávání portů -> Zde založit záznam dle screenu.
![Alt text](./readmeImages/image.png)
Poté je možné se do VM připojit přes jakéhokoliv SSH klienta (putty, kitty) pod adresou localhost:2222.

Kromě tohoto SSH portu je potřeba ještě přidat další porty (80, 5199, 3000) pro funkčnost aplikace.
![Alt text](./readmeImages/image2.png)

</details>
<details>
  <summary>Podrobná instalace dockeru</summary>
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

</details>
</details>

### Spuštění bez dat
Pokud chcete spustit docker stack bez dat je možné využít následující postup.
<details>
  <summary>Spuštění bez dat</summary>
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

</details>


### Spuštění s demo daty

Pro potřeby prezentace aplikace jsem vytvořil soubor _docker-compose-demo.yml_, který vytvoří aplikaci a naplní ji ukázkovými daty.
<details>
  <summary>Spuštění demo aplikace</summary>
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

</details>


### Spuštění DEV prostředí
Pokud chcete mít aplikaci spuštěnou přes vývojové prostředí, může se hodit kontejner, který zajistí jen databázi a fileserver.
<details>
  <summary>Spuštění dev prostředí</summary>
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
</details>
</details>


## Standalone nasazení
Aplikaci je možné provozovat také jako každou komponentu samostatně.
<details>
  <summary>Standalone</summary>

### Backend
Pro backend budete potřebovat zkompilovanou verzi aplikace. Poslední taková se nachází [zde](https://github.com/panda7789/videoportal2/releases), případně jako příloha k textu BP.
Tyto soubory je poté nutné nasadit na nějaký webový server, například na IIS ve Windows Server.

<details>
  <summary>Kompilace</summary>
Pokud chcete provádět změny, můžete si otevřít /backend/Backend.sln např ve Visual Studio.
Poté stačí zbuildit případně publishnout a zkopírovat vytvořené DLL na server.
</details>

### Frontend
Pro frontned budete také potřebovat zkompilovanou verzi aplikace.
Pokud vám vyhovují porty na api https://localhost:7287 a na fileserver http://localhost:10005 můžete použít již zkompilovanou verzi [zde](https://github.com/panda7789/videoportal2/releases) (případně ji najdete jako přílohu k textu BP), kterou stačí zkopírovat na jakýkoliv webový server, já použil nginx.

Pokud vám porty nevyhovují nebo jste provedli nějaké změny, je potřeba aplikaci znovu zkompilovat.
<details>
  <summary>Kompilace</summary>
  Nejprve je potřeba nainstalovat *pnpm* a potřebné npm balíčky příkazem:

  ```
  npm i -g pnpm
  pnpm i
  ```

  Poté je možné spustit samotnou kompilaci:

  ```
  pnpm run buildIgnoreErrors
  ```

  Výslednou aplikaci najdete ve složce **/frontend/dist**, odkud ji můžete zkopírovat na webový server.

</details>
</details>

## Konfigurace
### Backend
Konfigurace backendu se nachází v souboru appsettings.json:
<details>
  <summary>Konfigurace backendu</summary>

```json
{
  "AllowedHosts": "*", // omezení kdo může api volat
  "ConnectionStrings": { //host.docker.internal
    "DefaultConnection": "server=db;user=xxx;database=video_portal;port=3306;password=xxx" // connection string k mysql databázi
  },
  "FSBasePath": "/app/storage", // cesta kam se mají ukládat videa a obrázky (bude nahrazeno voláním na reálný fileserver)
  "MailSettings": { // nastavení emailového serveru přes který se posílají změny hesla
    "Server": "smtp.seznam.cz", 
    "Port": 587,
    "SenderName": "Info VideoPortál",
    "SenderEmail": "xxx",
    "UserName": "xxx",
    "Password": "xxx",
    "AppUrl": "https://videoportal.panda7789.fun"
  },
  "ApiPrefix": "api" // pro přístup k swaggeru, pokud máte backend vystavený pod dalším adresářem
}
```

</details>

### Frontend
Konfigrace frontendu se nachází ve zdrojových souborech a to konkrétně v .env.
<details>
  <summary>Konfigurace frontendu</summary>

```
ESLINT_NO_DEV_ERRORS=true
VITE_API_URL=https://localhost:7287 -- adresa backendu
VITE_FS_URL=http://localhost:10005 -- adresa file serveru
```

Bohužel není možné měnit konfiguraci bez zbuildění aplikace.
Pokud tedy potřebujete upravit adresy, je nutná kompilace viz Standalone nasazení/Frontend.
</details>

## CLI demo
Dle požadavků byla vytvořena i ukázková aplikace v powershellu.\
Aplikace umožňuje nahrání více již existujících souborů zároveň.\
Více [readme](/example_client/readme.md) 