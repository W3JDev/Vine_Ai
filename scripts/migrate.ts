import { PrismaClient } from "@prisma/client"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)
const prisma = new PrismaClient()

async function main() {
  try {
    console.log("Running database migrations...")
    await execAsync("npx prisma migrate deploy")

    console.log("Checking for admin user...")
    const adminUser = await prisma.user.findUnique({
      where: { email: "admin@example.com" },
    })

    if (!adminUser) {
      console.log("Creating admin user...")
      // Create admin user with bcrypt hashed password
      await prisma.user.create({
        data: {
          name: "Admin",
          email: "admin@example.com",
          // Password is 'adminpassword'
          password: "$2b$10$rQEL5.Qqwz5bRHrSXJLV2OB0HmIjXMjYFTRXJzLtFYnL.lV1JwXSa",
          settings: {
            create: {
              systemPrompt: "You are a helpful assistant.",
              voiceEnabled: true,
              voiceType: "default",
              voiceSpeed: "1",
            },
          },
        },
      })
      console.log("Admin user created")
    } else {
      console.log("Admin user already exists")
    }

    console.log("Migration completed successfully")
  } catch (error) {
    console.error("Migration failed:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
