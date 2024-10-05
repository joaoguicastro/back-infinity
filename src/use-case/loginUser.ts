import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UsuarioRepository } from '../repositories/usuarioRepository';

const usuarioRepository = new UsuarioRepository();
const JWT_SECRET = 'sua_chave_secreta'; // Lembre-se de mover isso para variáveis de ambiente

export async function loginUser(data: { email: string; senha: string }) {
  const usuario = await usuarioRepository.findByEmail(data.email);

  if (!usuario) {
    throw new Error('Usuário não encontrado.');
  }

  const senhaCorreta = await bcrypt.compare(data.senha, usuario.senha);
  if (!senhaCorreta) {
    throw new Error('Senha incorreta.');
  }

  const token = jwt.sign({ userId: usuario.id, cargo: usuario.cargo }, JWT_SECRET, { expiresIn: '1d' });
  return { token, cargo: usuario.cargo };
}
