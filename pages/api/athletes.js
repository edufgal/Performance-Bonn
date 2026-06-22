/**
 * /api/athletes
 * Fetches athlete roster from Hawkin Dynamics using API Key authentication.
 * The API Key is used directly as a Bearer token — no token exchange needed.
 */

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { HAWKIN_API_URL, HAWKIN_REFRESH_TOKEN } = process.env;

  if (!HAWKIN_API_URL || !HAWKIN_REFRESH_TOKEN) {
    console.error('Missing Hawkin environment variables');
    return res.status(500).json({ error: 'Server configuration error — missing API credentials' });
  }

  try {
    const athletesUrl = `${HAWKIN_API_URL.replace(/\/$/, '')}/athletes`;

    const response = await fetch(athletesUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${HAWKIN_REFRESH_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Athletes API call failed:', response.status, errorText);
      return res.status(502).json({
        error: 'Failed to fetch athletes from Hawkin Dynamics',
        status: response.status,
        detail: errorText
      });
    }

    const data = await response.json();

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    return res.status(200).json(data);

  } catch (error) {
    console.error('Unexpected error in /api/athletes:', error);
    return res.status(500).json({ error: 'Unexpected server error', message: error.message });
  }
}
