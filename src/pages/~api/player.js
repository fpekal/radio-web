export const prerender = false

import { isPlayingFromQueue, getProgressPercentage, getVolume } from '../../js/server/radio.js'

export async function GET() {
  return new Response(JSON.stringify({
	status: isPlayingFromQueue() ? "queue" : "background",
	progress: await getProgressPercentage(),
	volume: await getVolume(),
  }), { status: 200 })
}
