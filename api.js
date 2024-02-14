const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package
const { Resend } = require('resend');
const port = process.env.PORT || 4000;

const app = express()
  .use(cors()) // Enable CORS for all routes and origins
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }));


const resend = new Resend('re_Tp1Lp9Z6_B2sH67CuEkwsDfvXSHyznaXH');

app.post('/enviar-email', (req, res) => {
  let { nome, email, telefone_dd, telefone_numero, local_interesse } = req.body;
  console.log(req.body)
  let mailOptions = {
    from: 'Contato <onboarding@resend.dev>',
    to: ['kayky.paulinoalves@gmail.com'],
    subject: 'Contato Empresarial',
    html: `<h1>Nome ${nome}</h1><br>
    <p>E-mail: ${email}</p>
    <p>Numero: ${telefone_dd}${telefone_numero}</p>
    <p>Assunto: ${local_interesse}</p>
    `,
  };

  resend.emails.send(mailOptions);

  return res.status(200).json({ error: false });
});

app.listen(port, () => {
  console.log('Servidor rodando em http://localhost:${port}');
});
