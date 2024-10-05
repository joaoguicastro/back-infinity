import bcrypt from 'bcryptjs';
import { UsuarioRepository } from '../repositories/usuarioRepository';

const usuarioRepository = new UsuarioRepository();

export async function createUser(data: { nome: string; email: string; senha: string; cargo: string }) {
  const hashedPassword = await bcrypt.hash(data.senha, 10);
  return usuarioRepository.create({
    ...data,
    senha: hashedPassword,
  });
}
