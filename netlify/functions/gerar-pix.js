exports.handler = async (event) => {
  // Permitir CORS para qualquer origem
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Responder preflight OPTIONS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Permitir apenas POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { amount, fullName, whatsapp } = body;

    // Validação dos campos obrigatórios
    if (!amount || !fullName || !whatsapp) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Campos obrigatórios: amount, fullName, whatsapp' })
      };
    }

    // Garantir que o valor é numérico e positivo
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Valor inválido' })
      };
    }

    // Credenciais da ProPix (variáveis de ambiente ou fallback)
    const clientId = process.env.PROPIX_CLIENT_ID || 'live_9d381ed5edb516c2b8f76d9befc731ac';
    const clientSecret = process.env.PROPIX_CLIENT_SECRET || 'sk_2379688f11f7562b37619ce8539188c9ddaca27538e0b4fc64ee39a3bb30ad73';

    // Limpar o documento (whatsapp) - pegar apenas dígitos
    const payerDocument = whatsapp.replace(/\D/g, '').slice(-11);

    const response = await fetch('https://api.propixbr.com/api/v1/deposit', {
      method: 'POST',
      headers: {
        'x-client-id': clientId,
        'x-client-secret': clientSecret,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amountValue,
        description: `Investimento - ${fullName}`,
        payerName: fullName,
        payerDocument: payerDocument
      })
    });

    const data = await response.json();
    console.log('ProPix API Response:', JSON.stringify(data));

    if (data.success) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          qrCode: data.qrcodeUrl || null,
          copyPaste: data.copyPaste || null,
          transactionId: data.transactionId || null,
          valorOriginal: data.valorOriginal || amountValue,
          valorLiquido: data.valorLiquido || null
        })
      };
    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: data.error || 'Erro ao gerar PIX'
        })
      };
    }

  } catch (error) {
    console.error('Erro na function:', error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Erro interno no servidor: ' + error.message
      })
    };
  }
};
