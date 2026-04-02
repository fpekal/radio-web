import { player, player_ready } from './mpv.js'

let queue = []
let playing = false

export async function startFromQueue() {
  if (queue.length > 0) {
    console.log(`Starting music from queue: ${await queue[0].getName()}`)
	const track = queue.shift()
	const url = await track.getUrl()
    player.loadfile(url)
	playing = true
  }
}

export async function startFromQueueIfNotPlaying() {
  if (!playing) {
    await startFromQueue()
  }
}

export async function addTrackToQueue(track) {
  console.log(`Adding track to queue: ${await track.getName()}`)
  queue.push(track)

  await startFromQueueIfNotPlaying()
}

export function clearQueue() {
  console.log("Clearing queue")
  queue = []
}

export function isPlaying() {
  return playing
}

export function pause() {
  console.log("Music paused")
  player.pause()
}

export function resume() {
  console.log("Music resumed")
  player.play()
}

async function init() {
  await player_ready

  player.onEndFile(() => {
	console.log("Music ended")
	playing = false
	startFromQueueIfNotPlaying()
  })
}

init()
