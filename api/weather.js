const https = require('https');

/**
 * Helper to format JSON response for both Vercel/Netlify serverless and raw Node HTTP response.
 */
function sendJson(res, statusCode, payload) {
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(statusCode).json(payload);
  }
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify(payload));
}

/**
 * Serverless API handler for weather requests.
 * Hides the OpenWeather API key on the server side.
 */
module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    if (typeof res.status === 'function') return res.status(200).end();
    res.statusCode = 200;
    return res.end();
  }

  if (req.method !== 'GET') {
    return sendJson(res, 405, { error: 'Method Not Allowed' });
  }

  // Extract and validate city query parameter
  const parsedUrl = new URL(req.url, 'http://localhost');
  const city = parsedUrl.searchParams.get('city') || (req.query && req.query.city);

  if (!city || typeof city !== 'string' || !city.trim()) {
    return sendJson(res, 400, { error: 'City parameter is required.' });
  }

  if (city.trim().length > 100) {
    return sendJson(res, 400, { error: 'City parameter exceeds maximum length of 100 characters.' });
  }

  // Retrieve API key from environment variables
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey || apiKey === 'your_openweather_api_key_here') {
    return sendJson(res, 500, {
      error: 'Server configuration error: OPENWEATHER_API_KEY is not configured.'
    });
  }

  const typeParam = parsedUrl.searchParams.get('type') || (req.query && req.query.type);
  const endpoint = typeParam === 'forecast' ? 'forecast' : 'weather';

  const targetUrl = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${encodeURIComponent(
    city.trim()
  )}&appid=${apiKey}&units=metric`;

  try {
    const apiResponse = await new Promise((resolve, reject) => {
      https
        .get(targetUrl, (apiRes) => {
          let body = '';
          apiRes.on('data', (chunk) => (body += chunk));
          apiRes.on('end', () => {
            resolve({ statusCode: apiRes.statusCode, body });
          });
        })
        .on('error', (err) => reject(err));
    });

    let data;
    try {
      data = JSON.parse(apiResponse.body);
    } catch {
      return sendJson(res, 502, { error: 'Invalid response from weather provider.' });
    }

    if (apiResponse.statusCode !== 200) {
      return sendJson(res, apiResponse.statusCode, {
        error: data.message || 'City not found'
      });
    }

    return sendJson(res, 200, data);
  } catch (err) {
    return sendJson(res, 500, { error: 'Failed to communicate with weather provider.' });
  }
};
