export const prerender = false

import { getBackgroundTrack, setBackgroundTrack } from '../../js/server/radio.js'
import Track from '../../js/server/track.js'

export async function GET() {
  const track = getBackgroundTrack()
  return new Response(JSON.stringify({name: await track.getName(), url: await track.getUrl()}))
}

export async function POST({ request }) {
  const json = await request.json()
  const track = (await Track.createTracks(json))[0]

  if (track === null || track === undefined) {
	return new Response(null, { status: 400 })
  }

  await setBackgroundTrack(track)
  return new Response(null, { status: 200 })
}
