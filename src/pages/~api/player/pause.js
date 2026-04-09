export const prerender = false

import { pause } from '../../../js/server/radio.js'

export async function PUT() {
  await pause()
  return new Response(null, { status: 200 })
}
