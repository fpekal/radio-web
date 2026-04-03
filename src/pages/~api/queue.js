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

  switch (json.track_type) {
    case "raw":
      await addTrackToQueue(new Track.Raw(json.name, json.url))
	  return success_response
      break

    case "youtube":
      await addTrackToQueue(new Track.Youtube(json.url))
	  return success_response
      break
  }

  return new Response(null, { status: 400 })
}
