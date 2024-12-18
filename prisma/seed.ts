import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const existingUser = await prisma.usuario.findUnique({
    where: { email: 'joaoguicastro100@gmail.com' },
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('081104', 10);

    await prisma.usuario.create({
      data: {
        nome: 'Joao Guilherme',
        email: 'joaoguicastro100@gmail.com',
        senha: hashedPassword,
        cargo: 'master',
      },
    });

    console.log('Usuário mestre criado com sucesso!');
  } else {
    console.log('Usuário mestre já existe!');
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
