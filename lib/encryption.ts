import crypto from "crypto"

// Get encryption key from environment variable or use a default for development
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "this-is-a-32-char-dev-encryption-key"

// Encrypt sensitive data
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv)

  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")

  return `${iv.toString("hex")}:${encrypted}`
}

// Decrypt sensitive data
export function decrypt(text: string): string {
  const [ivHex, encryptedText] = text.split(":")
  const iv = Buffer.from(ivHex, "hex")
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv)

  let decrypted = decipher.update(encryptedText, "hex", "utf8")
  decrypted += decipher.final("utf8")

  return decrypted
}
