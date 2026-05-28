// Uses native fetch (Node 18+)

const SAM_API_BASE = 'https://api.sam.gov/entity-information/v3/activedatas';

exports.handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  const apiKey = process.env.SAM_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'SAM_API_KEY not configured',
        message: 'Set SAM_API_KEY in Netlify dashboard → Environment variables',
        setupUrl: 'https://openkiosk.org/sam-gov-api-key/',
      }),
    };
  }

  const params = event.queryStringParameters || {};
  const {
    keyword = '',
    naics = '',
    setaside = '',
    agency = '',
    postedFrom = '01/01/2023',
    postedTo = '12/31/2030',
    page = '1',
    limit = '20',
  } = params;

  try {
    const queryParts = [
      `status=active`,
      `dateRange=${postedFrom}-${postedTo}`,
      `publishOption=active`,
    ];

    if (keyword) queryParts.push(`keyword=${encodeURIComponent(keyword)}`);
    if (naics) queryParts.push(`naics=${encodeURIComponent(naics)}`);
    if (setaside) queryParts.push(`setAside=${encodeURIComponent(setaside)}`);
    if (agency) queryParts.push(`agency=${encodeURIComponent(agency)}`);

    queryParts.push(`page=${page}`);
    queryParts.push(`limit=${limit}`);

    const url = `${SAM_API_BASE}?${queryParts.join('&')}`;

    const response = await fetch(url, {
      headers: {
        'ApiKey': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        statusCode: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'SAM.gov API error', details: errorText }),
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Server error', message: error.message }),
    };
  }
};