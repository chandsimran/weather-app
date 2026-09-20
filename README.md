# Weather Dashboard App

A modern, real-time weather dashboard built with HTML, CSS, JavaScript, and a serverless API proxy.

## Architecture & API Security

This application uses a serverless backend proxy (`/api/weather`) to fetch data from OpenWeatherMap.

* **Serverless API Proxy**: The frontend JavaScript calls `/api/weather?city=...` rather than calling OpenWeather directly. The serverless function attaches the secret API key server-side.
* **Environment Variables**: The API key is loaded strictly from the `OPENWEATHER_API_KEY` environment variable.
* **Secret Management**: Local secrets are managed via a `.env` file. **`.env` files must NEVER be committed to Git.** A `.env.example` file is provided as a template.

---

## Deployment Instructions

### Recommended Platform: Vercel

**Vercel** is the recommended deployment platform for this project because `api/weather.js` follows the Vercel Node.js serverless function convention out of the box.

1. Import this repository into Vercel.
2. In the Vercel project settings under **Environment Variables**, add:
   * **Name**: `OPENWEATHER_API_KEY`
   * **Value**: `<Your OpenWeather API Key>`
3. Deploy! Vercel automatically routes `/api/weather` to the serverless function.

> **Note on GitHub Pages**: GitHub Pages hosts static files only and cannot execute backend Node.js serverless code. Deploying this repository directly to GitHub Pages without an external proxy backend will cause `/api/weather` calls to fail.

---

## Local Development

To run the application locally without external npm dependencies:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Add your OpenWeather API key to `.env`:
   ```env
   OPENWEATHER_API_KEY=your_actual_api_key_here
   ```
3. Start the local server:
   ```bash
   node server.js
   ```
4. Open `http://localhost:3000` in your web browser.
