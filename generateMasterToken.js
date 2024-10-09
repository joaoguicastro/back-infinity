require('dotenv').config();
const jwt = require('jsonwebtoken');

// Payload do mestre
const payload = {
  userId: 1, // ID do usuário mestre
  cargo: 'master' // Cargo do mestre
};

// Geração do token usando o JWT_SECRET do .env
const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

// Exibindo o token no console
console.log('Token do mestre:', token);
