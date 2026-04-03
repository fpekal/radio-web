export const prerender = false

export async function GET() {
  const track = getPlayingTrack()

  return new Response(JSON.stringify({
    name: await track.getName(),
    url: await track.getUrl(),
  }))
}

