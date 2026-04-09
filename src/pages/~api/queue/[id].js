export const prerender = false

import { removeTrackFromQueue } from '../../../js/server/radio.js'

export async function DELETE({ params }) {
  const id = parseInt(params.id)
  await removeTrackFromQueue(id)
  return new Response(null, { status: 200 })
}

export async function PATCH({ params, request }) {
  const id = parseInt(params.id)
  const new_position = await request.json().position
  await moveTrackInQueue(id, new_position)
  return new Response(null, { status: 200 })
}
