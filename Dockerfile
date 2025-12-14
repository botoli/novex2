# ===============================
# Laravel Backend (PHP 8.2 + FPM)
# ===============================

FROM php:8.2-fpm

# === Системные зависимости
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
 && docker-php-ext-install \
    pdo_mysql \
    zip \
    gd \
 && rm -rf /var/lib/apt/lists/*

# === Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# === Рабочая директория Laravel
WORKDIR /var/www/backend

# === Копируем ТОЛЬКО composer-файлы (кеш Docker)
COPY composer.json composer.lock ./

# === Установка зависимостей Laravel
RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction \
    --no-progress

# === Копируем ВЕСЬ проект
COPY . .

# === Права для Laravel
RUN chown -R www-data:www-data /var/www/backend \
 && chmod -R 775 storage bootstrap/cache

# === Открываем порт php-fpm
EXPOSE 9000

# === Запуск php-fpm
CMD ["php-fpm"]
