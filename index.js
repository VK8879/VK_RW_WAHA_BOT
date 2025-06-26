const express = require('express');
const { create } = require('@wppconnect-team/wppconnect');

const app = express();
const port = process.env.PORT || 3000;

let qrCodeBase64 = null;

create({
  session: 'sessionName',
  catchQR: (base64Qr, asciiQR, attempts, urlCode) => {
    console.log('📷 QR Code (terminal):');
    console.log(asciiQR);
    qrCodeBase64 = base64Qr; // salva para exibir no navegador
  },
  headless: true, // importante para o Railway
  puppeteerOptions: {
    args: ['--no-sandbox']
  }
}).then((client) => {
  console.log('📱 Cliente conectado!');
}).catch((err) => {
  console.error('Erro ao iniciar o cliente:', err);
});

app.get('/', (req, res) => {
  res.send('WAHA + WPPConnect rodando na Railway!');
});

app.get('/qrcode', (req, res) => {
  if (qrCodeBase64) {
    const img = `<img src="${qrCodeBase64}" style="width:300px; height:300px;" />`;
    res.send(`<h2>Escaneie o QR Code com o WhatsApp</h2>${img}`);
  } else {
    res.send('QR Code ainda não gerado. Aguarde...');
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});
