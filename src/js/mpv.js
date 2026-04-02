import { exec } from 'child_process';

class Player {
  constructor() {
	let runtime_dir = process.env.XDG_RUNTIME_DIR

	exec('mpv --no-video --idle --input-ipc-server=' + runtime_dir + '/radioweb-mpv.socket &',
	  function callback(error, stdout, stderr) {
		console.log('stdout: ' + stdout)
	  })

	console.log('MPV started')
  }
}

function init() {
  const player = new Player()

  console.log('MPV initialized')
}

init()
