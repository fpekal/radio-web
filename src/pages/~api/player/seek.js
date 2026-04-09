export const prerender = false

import { seek } from '../../../js/server/radio.js'

export async function POST({ request }) {
  const json = await request.json()
  await seek(json.progress)
  return new Response(null, { status: 200 })
}

