FROM node:18-alpine

WORKDIR /app

# Instalar Angular CLI globalmente
RUN npm install -g @angular/cli

COPY package*.json ./

# Instalar todas as dependências do projeto sem dependências opcionais
RUN npm install --legacy-peer-deps

COPY . .

# Adicionar script de inicialização
COPY start.sh ./
RUN chmod +x start.sh

EXPOSE 4200
CMD ["./start.sh"]
