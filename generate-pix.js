const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Apenas permitir requisições POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { amount, fullName, whatsapp } = JSON.parse(event.body);

    // Configurações sensíveis (serão lidas das variáveis de ambiente da Netlify)
    const clientId = process.env.PROPIX_CLIENT_ID || 'live_9d381ed5edb516c2b8f76d9befc731ac';
    const clientSecret = process.env.PROPIX_CLIENT_SECRET || 'sk_2379688f11f7562b37619ce8539188c9ddaca27538e0b4fc64ee39a3bb30ad73';
    const apiUrl = 'https://api.propixbr.com/api/v1/deposit';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'x-client-id': clientId,
        'x-client-secret': clientSecret,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amount,
        description: `Investimento - ${fullName}`,
        payerName: fullName,
        payerDocument: whatsapp.replace(/\D/g, '').slice(-11)
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Erro na function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Erro interno no servidor' })
    };
  }
};
