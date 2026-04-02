import { spawn } from 'child_process';
import { MPVClient } from 'mpv-ipc'

let player
let player_promise_resolve
let player_promise = new Promise((resolve) => {player_promise_resolve = resolve})

function init() {
  let runtime_dir = process.env.XDG_RUNTIME_DIR

  spawn('mpv', ['--no-video', '--idle', '--input-ipc-server=' + runtime_dir + '/radioweb-mpv.socket'],
	{
	  detached: true,
	  stdio: "ignore"
	}).unref()

  setTimeout(() => {
	player = new MPVClient(runtime_dir + '/radioweb-mpv.socket')
	player.on('event', (name, args) => {
	  console.log(name, args)
	})

	player_promise_resolve()
  }, 1000)

  console.log('MPV initialized')
}

export async function play(url) {
  await player_promise

  player.loadfile(url)
}

init()
