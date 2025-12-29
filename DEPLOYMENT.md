# Deployment Guide

## Environment Configuration

The application uses environment variables to configure the API and Application Base URLs. This allows you to easily switch between local development and production environments.

### Local Development
The included `.env` file is configured for your local WAMP setup:
```env
VITE_API_BASE_URL=http://localhost/byms/api
VITE_APP_BASE_URL=/byms/
```

### Production (public_html)
If you are deploying to a live server where the application is hosted in the root `public_html` directory (e.g., `https://yourdomain.com/`), update your `.env` (or set environment variables in your CI/CD pipeline) as follows:

```env
# If your API is at https://yourdomain.com/api
VITE_API_BASE_URL=https://yourdomain.com/api

# If your App is at the root
VITE_APP_BASE_URL=/
```

If you are deploying to a subdirectory (e.g., `https://yourdomain.com/studio/`), use:
```env
VITE_API_BASE_URL=https://yourdomain.com/studio/api
VITE_APP_BASE_URL=/studio/
```

## Building for Production

To build the application for production, run:
```bash
npm run build
```
This will generate the `dist` folder. Upload the contents of this folder to your server's `public_html` (or subdirectory).

## PHP Backend

Ensure your PHP files in `api/` are uploaded to the `api/` folder on your server.
Update `config.php` on the server with your production database credentials.
