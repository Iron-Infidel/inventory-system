/**
 * Slack Web API helper — posts messages to a channel via Bot token.
 */

const SLACK_API = 'https://slack.com/api/chat.postMessage'

export async function postSlackMessage(blocks: object[], text: string): Promise<void> {
  const token   = process.env.SLACK_BOT_TOKEN
  const channel = process.env.SLACK_CHANNEL ?? 'iron-inventory-reports'

  if (!token) throw new Error('SLACK_BOT_TOKEN env var not set')

  const res = await fetch(SLACK_API, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json; charset=utf-8',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ channel, text, blocks }),
  })

  const data = await res.json()
  if (!data.ok) throw new Error(`Slack API error: ${data.error}`)
}
