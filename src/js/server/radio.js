import { player, player_ready } from './mpv.js'

let queue = []
let playing = false

export async function startFromQueue() {
  if (queue.length > 0) {
    console.log(`Starting music from queue: ${await queue[0].getName()}`)
    player.loadfile(await queue.shift().getUrl())
	playing = true
  }
}

export function startFromQueueIfNotPlaying() {
  if (!playing) {
    startFromQueue()
  }
}

export async function addTrackToQueue(track) {
  console.log(`Adding track to queue: ${await track.getName()}`)
  queue.push(track)

  startFromQueueIfNotPlaying()
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
