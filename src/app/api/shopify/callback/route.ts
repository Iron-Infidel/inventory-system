import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  if (!code) {
    return NextResponse.json({ error: 'Missing code parameter' }, { status: 400 })
  }

  const store        = process.env.SHOPIFY_STORE!
  const clientId     = process.env.SHOPIFY_CLIENT_ID!
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET!

  // Exchange code for permanent offline access token
  const res = await fetch(`https://${store}/admin/oauth/access_token`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
  })

  const data = await res.json()
  if (!data.access_token) {
    return NextResponse.json({ error: 'Token exchange failed', detail: data }, { status: 500 })
  }

  // Save token to Supabase config table so it persists
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
  await supabase.from('config').upsert({ key: 'shopify_access_token', value: data.access_token })

  return new NextResponse(
    `<html><body style="font-family:monospace;padding:2rem;background:#111;color:#eee">
      <h2 style="color:#4ade80">✅ Shopify connected!</h2>
      <p>Access token saved to database.</p>
      <p style="color:#888">Also add this to Vercel environment variables as <strong style="color:#fff">SHOPIFY_ACCESS_TOKEN</strong>:</p>
      <pre style="background:#222;padding:1rem;border-radius:8px;word-break:break-all">${data.access_token}</pre>
      <p style="color:#888">You can close this tab.</p>
    </body></html>`,
    { headers: { 'Content-Type': 'text/html' } }
  )
}
