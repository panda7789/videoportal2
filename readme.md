# VideoPortál

## Požadavky na spuštění
S použitím nástroje Docker by neměl být problém spustit aplikaci na jakékoliv platformě podporující Docker. Já jsem aplikaci testoval pouze na platformě Windows, proto budu daný návod psát pro tuto platformu.

Docker nainstalujeme dle návodu (https://docs.docker.com/desktop/install/windows-install/). Já zvolil verzi Docker for Windows, která obsahuje jak potřebný Docker tak Docker compose, avšak tyto aplikace je možné nainstalovat i samostatně.

## Jednoduché spuštění
Pro jednoduché spuštění je vytvořen ve složce *docker* soubor *docker-compose.yml*.
V powershellu otevřeme zmíněnou složku /docker a spustíme příkaz:
```powershell
docker compose --file docker-compose.yml up --build
```

Tento příkaz vytvoří a spustí následující kontejnery:
- frontend
  - sestaví image dle souboru /frontend/Dockerfile
    - definice je založena na webovém serveru nginx
    - vystaví se port 80
    - zkopíruje se obsah z /frontend/dist do složky nginxu
  - poté se image spustí a namapuje příslušný port 80
- api
  - sestaví image dle souboru /backend/Backend/Backend/Dockerfile
    - 