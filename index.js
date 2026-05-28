import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason
} from "@whiskeysockets/baileys"

import Pino from "pino"

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session")

  const sock = makeWASocket({
    auth: state,
    logger: Pino({ level: "silent" }),
    browser: ["Ubuntu", "Chrome", "20.0.04"]
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", ({ connection }) => {
    if (connection === "open") {
      console.log("✅ BOT CONNECTED")
    }

    if (connection === "close") {
      console.log("❌ CONNECTION CLOSED")
      startBot()
    }
  })
}

startBot()
