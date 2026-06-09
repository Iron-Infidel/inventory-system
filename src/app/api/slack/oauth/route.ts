import { NextResponse } from 'next/server'

// Slack OAuth redirect handler — used only during app installation.
// We don't need to store the token here since this is a single-workspace
// internal app; the bot token is stored as an env var after install.
export async function GET() {
  return NextResponse.json({ ok: true, message: 'Slack app installed successfully.' })
}
