import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UsuarioRepository } from '../repositories/usuarioRepository';
import { env } from '../env';  

const usuarioRepository = new UsuarioRepository();

export async function loginUser(data: { email: string; senha: string }) {
  const usuario = await usuarioRepository.findByEmail(data.email);

  if (!usuario) {
    throw new Error('Usuário não encontrado.');
  }

  const senhaCorreta = await bcrypt.compare(data.senha, usuario.senha);
  if (!senhaCorreta) {
    throw new Error('Senha incorreta.');
  }

  const token = jwt.sign({ userId: usuario.id, cargo: usuario.cargo }, env.JWT_SECRET, { expiresIn: '1d' });
  
  return { token, cargo: usuario.cargo };
}
