import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

export async function createMasterUser() {
  const existingUser = await prisma.usuario.findUnique({
    where: { email: 'master@infinity.com' },
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('081104', 6);

    await prisma.usuario.create({
      data: {
        nome: 'Master User',
        email: 'master@infinity.com',
        senha: hashedPassword,
        cargo: 'master',
      },
    });

    console.log('Usuário Master criado com sucesso!');
  } else {
    console.log('Usuário Master já existe!');
  }
}
