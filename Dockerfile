FROM php:8.2-apache

# Enable Apache modules
RUN a2enmod rewrite expires headers

# Copy all files to the Apache document root
COPY . /var/www/html/

# Make sure permissions are correct for API to save files
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

EXPOSE 80

CMD ["apache2-foreground"]
