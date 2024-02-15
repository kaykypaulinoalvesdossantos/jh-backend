const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer'); // Import multer for handling file uploads
const { Resend } = require('resend');
const port = process.env.PORT || 4000;

const app = express()
  .use(cors())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }));

const storage = multer.memoryStorage(); // Configure multer to store files in memory
const upload = multer({ storage: storage }); // Create a multer instance

const resend = new Resend('re_Tp1Lp9Z6_B2sH67CuEkwsDfvXSHyznaXH');

app.post('/enviar-email', (req, res) => {
  let { nome, email, telefone_dd, telefone_numero, local_interesse } = req.body;
  let mailOptions = {
    from: 'Contato <onboarding@resend.dev>',
    to: ['contatojhtelecom@jhtele.com.br'],
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

app.post('/enviar-email-funcionario', upload.single('pdf_file'), (req, res) => {
  let { nome, email, telefone_dd, telefone_numero, local_interesse } = req.body;
  let pdfFile = req.file; // Access the uploaded PDF file

  if (!pdfFile) {
    return res.status(400).json({ error: true, message: "Nenhum arquivo PDF enviado." });
  }

  let mailOptions = {
    from: 'Contato <onboarding@resend.dev>',
    to: ['contatojhtelecom@jhtele.com.br'],
    subject: 'Contato para envio de currículo',
    html: `<h1>Nome ${nome}</h1><br>
    <p>E-mail: ${email}</p>
    <p>Numero: ${telefone_dd}${telefone_numero}</p>
    <p>Local de interesse: ${local_interesse}</p>
    `,
    attachments: [
      {
        filename: pdfFile.originalname,
        content: pdfFile.buffer, // Attach the PDF file content
        contentType: 'application/pdf', // Set the content type
      }
    ]
  };

  resend.emails.send(mailOptions);

  return res.status(200).json({ error: false });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
