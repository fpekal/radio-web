export const prerender = false

import { getPlayingTrack, addTrackToQueue } from '../../js/server/radio.js'
import Track from '../../js/server/track.js'

export async function GET() {
  const track = getPlayingTrack()

  return new Response(JSON.stringify({
    name: await track.getName(),
    url: await track.getUrl(),
  }))
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
