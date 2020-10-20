FROM mcr.microsoft.com/dotnet/core/aspnet:3.1 AS base
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000

FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build
WORKDIR /src
COPY ["homeappnetapi.csproj", "./"]
RUN dotnet restore "homeappnetapi.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "homeappnetapi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "homeappnetapi.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "homeappnetapi.dll"]
