export const prerender = false

import { getVolume, setVolume } from '../../../js/server/radio.js'

export async function GET() {
  const volume = await getVolume()
  return new Response(JSON.stringify({volume: volume}))
}

export async function PUT({ request }) {
  const json = await request.json()
  await setVolume(json.volume)
  return new Response(null, { status: 200 })
}
