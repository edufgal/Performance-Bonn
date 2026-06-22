/**
 * /api/athletes
 * Hawkin Dynamics authentication flow:
 * 1. POST refresh token to get access token
 * 2. GET /athletes with access token
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
    // Step 1 — get access token using refresh token as Bearer
    const tokenResponse = await fetch(HAWKIN_TOKEN_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${HAWKIN_REFRESH_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!tokenResponse.ok) {
      const detail = await tokenResponse.text();
      return res.status(502).json({ 
        error: 'Token exchange failed', 
        status: tokenResponse.status, 
        detail 
      });
    }

    const tokenData = await tokenResponse.json();

    // Hawkin returns token in different fields depending on version
    const accessToken = tokenData.access_token || tokenData.accessToken || tokenData.token || tokenData.idToken;

    if (!accessToken) {
      return res.status(502).json({ 
        error: 'No access token in response', 
        received: tokenData 
      });
    }

    // Step 2 — fetch athletes with access token
    const athletesUrl = `${HAWKIN_API_URL.replace(/\/$/, '')}/athletes`;
    const athletesResponse = await fetch(athletesUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!athletesResponse.ok) {
      const detail = await athletesResponse.text();
      return res.status(502).json({ 
        error: 'Athletes fetch failed', 
        status: athletesResponse.status, 
        detail 
      });
    }

    const data = await athletesResponse.json();

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: 'Unexpected error', message: error.message });
  }
}
