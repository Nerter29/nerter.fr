# Utiliser une image de base avec Nginx
FROM nginx:latest

# Copier les fichiers de configuration personnalisés de Nginx
COPY ./nginx.conf /etc/nginx/nginx.conf

# Copier les fichiers de votre site web dans le dossier de travail de Nginx
COPY ./src /usr/share/nginx/html
# Exposer le port 80 (port par défaut pour HTTP)
EXPOSE 80
