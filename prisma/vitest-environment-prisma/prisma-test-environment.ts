import { randomUUID } from "node:crypto"
import { execSync } from "node:child_process"
import { Environment } from "vitest"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

function databaseUrlGenerator(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("Provide a valid DATABASE URL env variable.")
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set("schema", schema)

  return String(url)
}

const prismaEnvironment: Environment = {
  name: "prisma",
  transformMode: "web",

  async setup() {
    const schema = Math.random()
    const databaseUrl = databaseUrlGenerator(String(schema).replaceAll(".", ""))

    process.env.DATABASE_URL = databaseUrl
    process.env.DATABASE_SCHEMA = String(schema).replaceAll(".", "")

    execSync("npx prisma migrate deploy")

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${process.env.DATABASE_SCHEMA}" CASCADE`
        )

        process.env.DATABASE_SCHEMA = "public"

        await prisma.$disconnect()
      },
    }
  },
}

export default prismaEnvironment
