export const prerender = false

import { getPlayingTrack, addTrackToQueue, getQueue } from '../../js/server/radio.js'
import Track from '../../js/server/track.js'

export async function GET() {
  const queue = getQueue()

  const tracks = queue.map(async (track) => {
	return {
	  name: await track.getName(),
	  url: await track.getUrl(),
	}
  })

  return new Response(JSON.stringify(await Promise.all(tracks)))
}

export async function POST({ params, request }) {
  const json = await request.json()

  const success_response = new Response(null, { status: 200 })

  const track = Track.createTrack(json)
  if (track == null) {
	return new Response(null, { status: 400 })
  }

  await addTrackToQueue(track)

  return success_response
}
