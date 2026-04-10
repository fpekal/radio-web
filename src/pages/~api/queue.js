export const prerender = false

import Track from '../../js/server/track.js'

import { addTracksToQueue, getQueue } from '../../js/server/radio.js'

export async function GET() {
  const queue = getQueue()

  const resolved = await Promise.all(
    queue.map(async (track) => ({
      name: await track.getName(),
      url: await track.getUrl(),
    }))
  )

  const tracks = {}
  resolved.forEach((t, i) => {
    tracks[String(i)] = t
  })

  return new Response(JSON.stringify(tracks))
}

export async function POST({ params, request }) {
  const json = await request.json()

  const success_response = new Response(null, { status: 200 })

  const tracks = await Track.createTracks(json)
  if (tracks == []) {
	return new Response(null, { status: 400 })
  }

  await addTracksToQueue(tracks)

  return success_response
}
