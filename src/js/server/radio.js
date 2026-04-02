import { player, player_ready } from './mpv.js'

let queue = []
let playing = false

export function startFromQueue() {
  if (queue.length > 0) {
    console.log(`Starting music from queue: ${queue[0]}`)
    player.loadfile(queue.shift())
	playing = true
  }
}

export function startFromQueueIfNotPlaying() {
  if (!playing) {
    startFromQueue()
  }
}

export function addTrackToQueue(track) {
  console.log(`Adding track to queue: ${track}`)
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
