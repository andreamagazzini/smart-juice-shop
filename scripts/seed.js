const { PrismaClient } = require('../node_modules/.prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  await prisma.user.upsert({
    where: { email: 'admin@juice-shop.herokuapp.com' },
    update: {},
    create: {
      email: 'admin@juice-shop.herokuapp.com',
      password: 'admin123',
      role: 'admin',
      isAdmin: true
    }
  })
  console.log('✅ Created admin user')

  // Create regular user
  await prisma.user.upsert({
    where: { email: 'user@juice-shop.herokuapp.com' },
    update: {},
    create: {
      email: 'user@juice-shop.herokuapp.com',
      password: 'password123',
      role: 'customer',
      isAdmin: false
    }
  })
  console.log('✅ Created regular user')

  // Create sample products
  const products = [
    { name: 'Orange Juice', description: 'Fresh orange juice', price: 2.99 },
    { name: 'Apple Juice', description: 'Crisp apple juice', price: 3.49 },
    { name: 'Mango Juice', description: 'Tropical mango juice', price: 4.99 },
    { name: 'Tomato Juice', description: 'Savory tomato juice', price: 3.79 },
    { name: 'Carrot Juice', description: 'Healthy carrot juice', price: 3.99 }
  ]

  for (const product of products) {
    await prisma.product.create({
      data: product
    })
  }
  console.log('✅ Created sample products')

  // Create challenges
  const challenges = [
    { key: 'loginAdmin', name: 'Login Admin', category: 'Broken Authentication', difficulty: 1, description: 'Log in with the admin user account' },
    { key: 'weakPassword', name: 'Weak Password', category: 'Broken Authentication', difficulty: 1, description: 'Log in with the admin user account using password "admin123"' },
    { key: 'sqlInjectionLogin', name: 'SQL Injection (Login)', category: 'Injection', difficulty: 3, description: 'Log in with a SQL injection attack' },
    { key: 'sqlInjectionSearch', name: 'SQL Injection (Search)', category: 'Injection', difficulty: 3, description: 'Extract sensitive data via SQL injection in the search' },
    { key: 'reflectedXss', name: 'Reflected XSS', category: 'XSS', difficulty: 2, description: 'Perform a reflected XSS attack' },
    { key: 'persistedXssFeedback', name: 'Persisted XSS (Feedback)', category: 'XSS', difficulty: 4, description: 'Perform a persisted XSS attack' },
    { key: 'accessAdminSection', name: 'Access Admin Section', category: 'Broken Access Control', difficulty: 2, description: 'Access the administration section' },
    { key: 'negativeOrder', name: 'Negative Order', category: 'Improper Input Validation', difficulty: 3, description: 'Place an order with a negative total amount' },
    { key: 'bypassPaywall', name: 'Bypass Deluxe Membership', category: 'Broken Access Control', difficulty: 4, description: 'Access a deluxe member feature without being a deluxe member' }
  ]

  for (const challenge of challenges) {
    await prisma.challenge.upsert({
      where: { key: challenge.key },
      update: {},
      create: challenge
    })
  }
  console.log('✅ Created challenges')

  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
