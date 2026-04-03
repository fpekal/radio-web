export const prerender = false

import { skip } from '../../js/server/radio.js'

export async function GET() {
  skip()
  return new Response(null, { status: 200 })
}
