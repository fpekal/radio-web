import { spawn, exec } from 'child_process';
import { MPVClient } from 'mpv-ipc'

export let player
let player_ready_resolve
export let player_ready = new Promise((resolve) => {player_ready_resolve = resolve})

function exit_handler() {
  player.quit()

  process.exit()
}

function init() {
  let runtime_dir = process.env.XDG_RUNTIME_DIR

  spawn('mpv', ['--af=loudnorm=I=-14:LRA=1:tp=-1:linear=false:dual_mono=true', '--no-video', '--idle', '--volume=50', '--input-ipc-server=' + runtime_dir + '/radioweb-mpv.socket'],
	{
	  detached: true,
	  stdio: "ignore"
	}).unref()

  setTimeout(() => {
	player = new MPVClient(runtime_dir + '/radioweb-mpv.socket')
	player.on('event', (name, args) => {
	  console.log(name, args)
	})

	player_ready_resolve()
  }, 1000)

  process.on('exit', exit_handler)
  process.on('SIGINT', exit_handler)
  process.on('SIGTERM', exit_handler)

  console.log('MPV initialized')
}

init()
