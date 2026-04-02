import { player, player_ready } from './mpv.js'

let queue = []
let playing = false

export function startFromQueue() {
  if (queue.length > 0) {
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
  queue.push(track)

  startFromQueueIfNotPlaying()
}

export function clearQueue() {
  queue = []
}

export function isPlaying() {
  return playing
}

export function pause() {
  player.pause()
}

export function resume() {
  player.play()
}

export async function init() {
  await player_ready

  player.onEndFile(() => {
	console.log("end of file")
	playing = false
	startFromQueueIfNotPlaying()
  })
}
