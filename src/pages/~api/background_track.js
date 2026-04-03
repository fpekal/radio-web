export const prerender = false

import { getBackgroundTrack, setBackgroundTrack } from '../../js/server/radio.js'
import Track from '../../js/server/track.js'

export async function GET() {
  const track = getBackgroundTrack()
  return new Response(JSON.stringify({name: await track.getName(), url: await track.getUrl()}))
}

export async function POST({ request }) {
  const json = await request.json()
  const track = Track.createTrack(json)

  if (track === null) {
	return new Response(null, { status: 400 })
  }

  setBackgroundTrack(track)
  return new Response(null, { status: 200 })
}
