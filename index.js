import makeWASocket, {
  useMultiFileAuthState
} from "@whiskeysockets/baileys"

import express from "express"

const app = express()

app.get("/", (req, res) => {
  res.send("Bot is running")
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Server running on port " + PORT)
})

async function startBot() {
  const { state, saveCreds } =
    await useMultiFileAuthState("session")

  const sock = makeWASocket({
    auth: state
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", async ({
    connection
  }) => {

    if (connection === "open") {
      console.log("✅ BOT CONNECTED")
    }

    if (connection === "close") {
      console.log("❌ CONNECTION CLOSED")
    }
  })
}

startBot()
