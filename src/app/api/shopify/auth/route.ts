import { NextResponse } from 'next/server'

export async function GET() {
  const store    = process.env.SHOPIFY_STORE!
  const clientId = process.env.SHOPIFY_CLIENT_ID!
  const redirect = 'https://ops.ironinfidel.com/api/shopify/callback'

  const url = `https://${store}/admin/oauth/authorize?` + new URLSearchParams({
    client_id:    clientId,
    scope:        'read_orders',
    redirect_uri: redirect,
  })

  return NextResponse.redirect(url)
}
