/**
 * /api/athletes
 * Hawkin Dynamics — two-step authentication:
 * 1. POST to Token URL with API Key → get access_token
 * 2. GET /athletes with access_token as Bearer
 */

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { HAWKIN_TOKEN_URL, HAWKIN_API_URL, HAWKIN_REFRESH_TOKEN } = process.env;

  if (!HAWKIN_TOKEN_URL || !HAWKIN_API_URL || !HAWKIN_REFRESH_TOKEN) {
    return res.status(500).json({ error: 'Missing API credentials' });
  }

  try {
    // Step 1 — exchange API Key for access token
    const tokenResponse = await fetch(HAWKIN_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: HAWKIN_REFRESH_TOKEN }),
    });

    if (!tokenResponse.ok) {
      const detail = await tokenResponse.text();
      return res.status(502).json({ error: 'Token exchange failed', status: tokenResponse.status, detail });
    }

    const tokenData = await tokenResponse.json();

    // Hawkin can return the token in different fields
    const accessToken = tokenData.access_token || tokenData.accessToken || tokenData.token || tokenData.idToken;

    if (!accessToken) {
      return res.status(502).json({ error: 'No access token in response', received: Object.keys(tokenData) });
    }

    // Step 2 — fetch athletes
    const athletesUrl = `${HAWKIN_API_URL.replace(/\/$/, '')}/athletes`;
    const athletesResponse = await fetch(athletesUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!athletesResponse.ok) {
      const detail = await athletesResponse.text();
      return res.status(502).json({ error: 'Athletes fetch failed', status: athletesResponse.status, detail });
    }

    const data = await athletesResponse.json();

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: 'Unexpected error', message: error.message });
  }
}
