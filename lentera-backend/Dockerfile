FROM php:8.3-fpm-alpine

# Install system dependencies & PostgreSQL driver
RUN apk add --no-linux-headers --no-cache \
    zip unzip curl libpng-dev libxml2-dev libzip-dev postgresql-dev nginx supervisor

RUN docker-php-ext-install pdo pdo_pgsql zip bcmath gd

# Copy composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

RUN composer install --no-dev --optimize-autoloader

RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 80

CMD ["sh", "-c", "php artisan migrate --force && php artisan config:cache && php artisan route:cache && php artisan serve --host=0.0.0.0 --port=80"]
