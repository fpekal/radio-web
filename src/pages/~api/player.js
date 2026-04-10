export const prerender = false

import { isPlayingFromQueue, getProgressPercentage, getVolume, isPlaying } from '../../js/server/radio.js'

export async function GET() {
  return new Response(JSON.stringify({
	status: await isPlaying() ? "playing" : "paused",
	source: isPlayingFromQueue() ? "queue" : "background",
	progress: await getProgressPercentage(),
	volume: await getVolume(),
  }), { status: 200 })
}
