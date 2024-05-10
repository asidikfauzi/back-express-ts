import {PrismaClient} from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient()

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10);
    await prisma.user.createMany({
        data: [
            {
                name: "John",
                email: "john@example.com",
                password: hashedPassword,
                createdAt: new Date(),
            },
            {
                name: "Doe",
                email: "doe@example.com",
                password: hashedPassword,
                createdAt: new Date(),
            }
        ]
    })

    const user = await prisma.user.findFirst({
        select: {
            id: true,
        },
        where: {
            email: 'john@example.com',
        }
    })

    if (user) {
        await prisma.task.create({
            data: {
                userId: user.id,
                title: "API OAUTH 2",
                description: "Create API OAUTH 2",
                status: "pending",
                createdAt: new Date(),
            }
        })
    }

}

main().catch((e) => {
    console.error(e)
    process.exit(1)
}).finally(async () => {
    await prisma.$disconnect()
})