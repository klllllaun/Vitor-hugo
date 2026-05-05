exports.handler = async (event) => {
  // Permitir apenas POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  try {
    const { amount, fullName, whatsapp } = JSON.parse(event.body);

    // 🔐 Variáveis de ambiente (configurar no Netlify)
    const clientId = process.env.PROPIX_CLIENT_ID;
    const clientSecret = process.env.PROPIX_CLIENT_SECRET;

    // Validação obrigatória
    if (!clientId || !clientSecret) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Variáveis de ambiente não configuradas"
        })
      };
    }

    const response = await fetch('https://api.propixbr.com/api/v1/deposit', {
      method: 'POST',
      headers: {
        'x-client-id': clientId,
        'x-client-secret': clientSecret,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amount / 100,
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
      body: JSON.stringify({
        success: false,
        message: 'Erro interno no servidor'
      })
    };
  }
};
