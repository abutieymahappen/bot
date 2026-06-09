import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} from "@whiskeysockets/baileys"

import Pino from "pino"

async function startBot() {

  const { state, saveCreds } =
    await useMultiFileAuthState("./session")

  const { version } =
    await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    auth: state,
    logger: Pino({ level: "silent" })
  })

  sock.ev.on("creds.update", saveCreds)

  if (!state.creds.registered) {

    const code =
      await sock.requestPairingCode("27687085163")

    console.log(`
╔════════════════════╗
║ AKATSUKII TESTER   ║
╠════════════════════╣
║ ${code}
╚════════════════════╝
`)
  }

  sock.ev.on("messages.upsert", async ({ messages }) => {

    const msg = messages[0]
    if (!msg.message) return

    const from = msg.key.remoteJid

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      ""

    if (text === ".ping") {

      await sock.sendMessage(from, {
        text: "🏓 PONG!"
      })
    }

    if (text === ".menu") {

      await sock.sendMessage(from, {
        text: `
╭─〔 AKATSUKII TESTER 〕
│
├ .ping
├ .menu
│
╰────────────⬣
`
      })
    }
  })
}

startBot()
