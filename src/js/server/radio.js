import { player, player_ready } from './mpv.js'
import Track from './track.js'

let queue = []

let playing_from_queue = false
let playing_background_track = false

let current_queue_track = null
let background_track = new Track.Raw("RMFMAXX", "https://195.150.20.243/RMFMAXXX48")

let ignore_next_endfile = false

async function nextFromQueueUnconditionally() {
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
}

export async function startFromQueue() {
  if (playing_from_queue) return

  if (queue.length > 0) {
	await nextFromQueueUnconditionally()
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

export async function removeTrackFromQueue(index) {
  console.log(`Removing track from queue: ${await queue[index].getName()}`)
  queue.splice(index, 1)
}

export async function moveTrackInQueue(index, new_position) {
  console.log(`Moving track in queue: ${await queue[index].getName()}`)
  const track = queue[index]
  queue.splice(index, 1)
  queue.splice(new_position, 0, track)
}

export function clearQueue() {
  console.log("Clearing queue")
  queue = []
}

export function isPlayingFromQueue() {
  return playing_from_queue
}

export function pause() {
  console.log("Music paused")
  player.pause()
}

export function resume() {
  console.log("Music resumed")
  player.play()
}

export function seek(progress) {
  player.seek(progress, 'absolute-percent')
}

export function skip() {
  console.log("Music skipped")
  ignore_next_endfile = true
  if (playing_from_queue) {
	if (queue.length > 0) {
	  nextFromQueueUnconditionally()
	}
	else {
	  startBackgroundTrack()
	}
  }
}

export async function getVolume() {
  return await player.getVolume()
}

export async function setVolume(volume) {
  await player.setVolume(volume)
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

export function getBackgroundTrack() {
  return background_track
}

export function setBackgroundTrack(track) {
  background_track = track

  if (playing_background_track) {
	playing_background_track = false
	ignore_next_endfile = true
	startBackgroundTrack()
  }
}

export function getPlayingTrack() {
  if (playing_from_queue) return current_queue_track
  if (playing_background_track) return background_track
  return null
}

export async function getProgressPercentage() {
  try {
	return await player.getProperty('percent-pos')
  }
  catch (e) {
	return 0
  }
}

export async function getDuration() {
  try {
	return await player.getProperty('duration')
  }
  catch (e) {
	return 0
  }
}

export function getQueue() {
  return queue
}

await init()
