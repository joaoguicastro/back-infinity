import { prisma } from '../lib/prisma';

export class UsuarioRepository {
  async findByEmail(email: string) {
    return prisma.usuario.findUnique({
      where: { email },
    });
  }

  async create(data: { nome: string; email: string; senha: string; cargo: string }) {
    return prisma.usuario.create({
      data,
    });
  }

}
