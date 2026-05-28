import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} from "@whiskeysockets/baileys"

import Pino from "pino"
import express from "express"

const app = express()

// Render port
const PORT = process.env.PORT || 3000

app.get("/", (req, res) => {
  res.send("WhatsApp Bot Running ✅")
})

app.listen(PORT, () => {
  console.log("Web server running on port " + PORT)
})

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session")

  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    logger: Pino({ level: "silent" }),
    auth: state,
    browser: ["Render Bot", "Chrome", "1.0.0"]
  })

  // Save session
  sock.ev.on("creds.update", saveCreds)

  // Connection updates
  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update

    if (qr) {
      console.log("QR RECEIVED")
    }

    if (connection === "open") {
      console.log("✅ BOT CONNECTED SUCCESSFULLY")
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut

      console.log("❌ CONNECTION CLOSED")

      if (shouldReconnect) {
        console.log("🔄 RECONNECTING...")
        const phoneNumber = "27687085163"
      }
    }
  })

  // Pairing code
  if (!sock.authState.creds.registered) {
    const phoneNumber = "27687085163"

    setTimeout(async () => {
      const code = await sock.requestPairingCode(phoneNumber)
      console.log("PAIR CODE:", code)
    }, 3000)
  }
}

startBot()
