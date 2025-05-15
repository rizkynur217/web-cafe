const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN'
    }
  })
  console.log('Created admin user:', admin)

  // Create customer user
  const customerPassword = await bcrypt.hash('customer123', 10)
  const customer = await prisma.user.create({
    data: {
      name: 'Customer',
      email: 'customer@example.com',
      password: customerPassword,
      role: 'CUSTOMER'
    }
  })
  console.log('Created customer user:', customer)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 