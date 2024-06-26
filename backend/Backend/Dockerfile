#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.
#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY Backend.csproj .
RUN dotnet restore Backend.csproj
COPY . .
RUN dotnet clean Backend.csproj
RUN dotnet build Backend.csproj -c Release -o /app/build --force

FROM build AS publish
RUN dotnet publish "Backend.csproj" -c Release -o /app/publish /p:UseAppHost=false --force

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish /publish
COPY --from=publish /app/publish/appsettings.Docker.json /publish/appsettings.json

WORKDIR /publish
EXPOSE 80
EXPOSE 443
ENTRYPOINT ["dotnet", "Backend.dll"]