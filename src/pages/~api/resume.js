export const prerender = false

import { resume } from '../../js/server/radio.js'

export async function GET() {
  resume()
  return new Response(null, { status: 200 })
}
