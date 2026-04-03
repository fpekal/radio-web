export const prerender = false

import { pause } from '../../js/server/radio.js'

export async function GET() {
  pause()
  return new Response(null, { status: 200 })
}
