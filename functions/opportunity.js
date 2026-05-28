// Uses native fetch (Node 18+)

const SAM_API_BASE = 'https://api.sam.gov/opportunities/v2/competitions';

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
      }),
    };
  }

  const params = event.queryStringParameters || {};
  const { noticeId } = params;

  if (!noticeId) {
    return {
      statusCode: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'noticeId is required' }),
    };
  }

  try {
    const url = `${SAM_API_BASE}?noticeId=${encodeURIComponent(noticeId)}&postedFrom=01/01/2000&postedTo=12/31/2030`;

    const response = await fetch(url, {
      headers: {
        'API-KEY': apiKey,
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