import { prisma } from "@/lib/prisma";

// Deletes in FK-safe order (children before parents). Used between tests so
// each test starts from a clean, empty database.
export async function resetDb() {
  await prisma.session.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.loginAttempt.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.mediaAsset.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.category.deleteMany();
  await prisma.siteSettings.deleteMany();
  await prisma.adminUser.deleteMany();
}
