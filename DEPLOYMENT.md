# Deployment Guide for softwares.ak23studiokits.com

This guide is specifically tailored for deploying to **https://softwares.ak23studiokits.com/**.

## 1. Frontend Build (React)

I have created a `.env.production` file with the correct settings for your domain:
- API URL: `https://softwares.ak23studiokits.com/api`
- Admin URL: `https://softwares.ak23studiokits.com/admin/`

### Steps:
1.  Run the build command locally:
    ```bash
    npm run build
    ```
2.  This will create a `dist` folder in your project directory.
3.  **Upload the CONTENTS of the `dist` folder** (index.html, assets folder, etc.) to the **root** of your `public_html` folder on the server.

## 2. Backend Setup (PHP)

1.  **Upload the `api` folder** form your local project to `public_html/api` on the server.
2.  **Upload the `admin` folder** from your local project to `public_html/admin` on the server.
3.  **Database Config**:
    - Rename `config.production.php` to `config.php`.
    - Edit this file and fill in your **Live Database Credentials** (Database Name, User, Password).
    - Update your **Pesapal Live Keys** (Consumer Key, Secret, and new IPN ID).
4.  Upload this new `config.php` to `public_html/config.php` on the server.

## 3. Database Migration

1.  Export your local database `studiomusicbuilder` as a `.sql` file.
2.  Import this `.sql` file into your live server's database using phpMyAdmin or similar tool.

## 4. Folder Structure Check

Your server `public_html` should look like this:

```
public_html/
├── assets/             <-- From dist/assets
├── admin/              <-- From local admin folder
├── api/                <-- From local api folder
├── config.php          <-- Your EDITED production config
├── index.html          <-- From dist/index.html
├── vite.svg            <-- From dist
└── ... other files from dist
```

## Troubleshooting

- **404 on Refresh**: If you refresh a page like `https://softwares.ak23studiokits.com/checkout` and get a 404, you need to configure your web server (Apache/Nginx) to redirect all requests to `index.html`.
    - **For Apache**: Create an `.htaccess` file in `public_html` with:
      ```apache
      <IfModule mod_rewrite.c>
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
      </IfModule>
      ```
