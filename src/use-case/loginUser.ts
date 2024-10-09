import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UsuarioRepository } from '../repositories/usuarioRepository';
import { env } from '../env';  // Importa as variáveis de ambiente de maneira correta

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

  // Usa a chave secreta correta das variáveis de ambiente
  const token = jwt.sign({ userId: usuario.id, cargo: usuario.cargo }, env.JWT_SECRET, { expiresIn: '1d' });
  
  return { token, cargo: usuario.cargo };
}
