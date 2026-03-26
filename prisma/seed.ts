import { PrismaClient, TaskStatus, TaskPriority } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      password: hashedPassword,
      name: 'John Doe',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      password: hashedPassword,
      name: 'Jane Smith',
    },
  });

  // Create tasks using Prisma enums
  await prisma.task.createMany({
    data: [
      {
        title: 'Complete project documentation',
        description: 'Write comprehensive documentation for the API',
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
        userId: user1.id,
      },
      {
        title: 'Set up CI/CD pipeline',
        description: 'Configure GitHub Actions for automated testing',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.MEDIUM,
        userId: user1.id,
      },
      {
        title: 'Write unit tests',
        description: 'Achieve 80% test coverage',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        userId: user1.id,
      },
      {
        title: 'Review pull requests',
        description: 'Review and merge pending PRs',
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.LOW,
        userId: user2.id,
      },
      {
        title: 'Deploy to production',
        description: 'Deploy the application to production environment',
        status: TaskStatus.PENDING,
        priority: TaskPriority.URGENT,
        userId: user2.id,
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
  console.log('📊 Created users:', user1.email, user2.email);
  console.log('📝 Created 5 sample tasks');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });