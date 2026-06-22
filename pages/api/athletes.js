/**
 * /api/athletes
 * Fetches athlete roster from Hawkin Dynamics using OAuth2 refresh token flow.
 * Credentials are read from environment variables — never hardcoded.
 */

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { HAWKIN_TOKEN_URL, HAWKIN_API_URL, HAWKIN_REFRESH_TOKEN } = process.env;

  // 1. Validate env vars are present
  if (!HAWKIN_TOKEN_URL || !HAWKIN_API_URL || !HAWKIN_REFRESH_TOKEN) {
    console.error('Missing Hawkin environment variables');
    return res.status(500).json({ error: 'Server configuration error — missing API credentials' });
  }

  try {
    // 2. Exchange refresh token for access token
    const tokenResponse = await fetch(HAWKIN_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: HAWKIN_REFRESH_TOKEN,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', errorText);
      return res.status(502).json({ error: 'Failed to authenticate with Hawkin Dynamics', detail: errorText });
    }

    const { access_token } = await tokenResponse.json();

    if (!access_token) {
      return res.status(502).json({ error: 'No access token received from Hawkin Dynamics' });
    }

    // 3. Call Hawkin API to get athletes
    const athletesUrl = `${HAWKIN_API_URL.replace(/\/$/, '')}/athletes`;
    const athletesResponse = await fetch(athletesUrl, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!athletesResponse.ok) {
      const errorText = await athletesResponse.text();
      console.error('Athletes API call failed:', errorText);
      return res.status(502).json({ error: 'Failed to fetch athletes from Hawkin Dynamics', detail: errorText });
    }

    const data = await athletesResponse.json();

    // 4. Return the data to the dashboard
    // Cache for 5 minutes so we don't hammer the API
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    return res.status(200).json(data);

  } catch (error) {
    console.error('Unexpected error in /api/athletes:', error);
    return res.status(500).json({ error: 'Unexpected server error', message: error.message });
  }
}
