import { PrismaClient, Role, DriverApprovalStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const rider = await prisma.user.upsert({
    where: { phone: '+224620000001' },
    update: {},
    create: { name: 'Seed Rider', phone: '+224620000001', role: Role.RIDER }
  });

  const driver = await prisma.user.upsert({
    where: { phone: '+224620000002' },
    update: {},
    create: { name: 'Seed Driver', phone: '+224620000002', role: Role.DRIVER }
  });

  await prisma.driverProfile.upsert({
    where: { userId: driver.id },
    update: { approvalStatus: DriverApprovalStatus.APPROVED },
    create: {
      userId: driver.id,
      plate: 'GN-1234',
      motoModel: 'Bajaj Boxer',
      licenseNumber: 'LIC123',
      idCardNumber: 'ID123',
      approvalStatus: DriverApprovalStatus.APPROVED
    }
  });

  console.log({ rider: rider.phone, driver: driver.phone });
}

main().finally(async () => prisma.$disconnect());
