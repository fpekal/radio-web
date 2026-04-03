import { player, player_ready } from './mpv.js'
import Track from './track.js'

let queue = []

let playing_from_queue = false
let playing_background_track = false

let current_queue_track = null
let background_track = new Track.Raw("RMFMAXX", "https://195.150.20.243/RMFMAXXX48")

let ignore_next_endfile = false

export async function startFromQueue() {
  if (playing_from_queue) return

  if (queue.length > 0) {
	if (playing_background_track) {
	  ignore_next_endfile = true
	}
    console.log(`Starting music from queue: ${await queue[0].getName()}`)
	const track = queue.shift()
	current_queue_track = track
	const url = await track.getUrl()
    player.loadfile(url)
	playing_from_queue = true
	playing_background_track = false
  }
  else {
	await startBackgroundTrack()
  }
}

export async function startBackgroundTrack() {
  if (playing_background_track) return

  console.log(`Starting background music: ${await background_track.getName()}`)
  player.loadfile(await background_track.getUrl())
  playing_background_track = true
  playing_from_queue = false
}

export async function startPlaying() {
  if (playing_from_queue || playing_background_track) return

  if (queue.length > 0) {
    await startFromQueue()
  }
  else {
    await startBackgroundTrack()
  }
}

export async function addTrackToQueue(track) {
  console.log(`Adding track to queue: ${await track.getName()}`)
  queue.push(track)

  await startFromQueue()
}

export function clearQueue() {
  console.log("Clearing queue")
  queue = []
}

export function isPlayingFromQueue() {
  return playingFromQueue
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

  player.onEndFile(async () => {
	if (ignore_next_endfile) {
	  ignore_next_endfile = false
	  return
	}
	console.log("Music ended")
	playing_from_queue = false
	playing_background_track = false
	await startPlaying()
  })

  await startPlaying()
}

export function getPlayingTrack() {
  if (playing_from_queue) return current_queue_track
  if (playing_background_track) return background_track
  return null
}

export function getQueue() {
  return queue
}

await init()
