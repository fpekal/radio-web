import { exec } from 'child_process'

class Track {
  async getName() { return "EMPTY" }
  async getUrl() { return "EMPTY" }
}

class Raw extends Track {
  constructor(name, url) {
    super()
    this.url = url
	this.name = name
  }

  async getName() { return this.name }
  async getUrl() { return this.url }
}

class Youtube extends Track {
  constructor(url) {
	super()
	this.url = url
	this.name = "EMPTY"
	this.real_url = "EMPTY"

	this.parsing_resolve
	this.parsing = new Promise((resolve) => { this.parsing_resolve = resolve })
	this.parseURL()
  }

  async parseURL() {
    exec(`yt-dlp --print "%(title)s" ${this.url}`, {}, (error, stdout, stderr) => {
	  this.name = stdout.split("\n")[0]

	  exec(`yt-dlp -x -g ${this.url}`, {}, (error, stdout, stderr) => {
		this.real_url = stdout.split("\n")[0]

		this.parsing_resolve()
	  })
    })
  }

  async getName() {
	await this.parsing
	return this.name
  }

  async getUrl() {
	await this.parsing
	return this.real_url
  }
}

class YoutubePlaylistEntry extends Track {
  constructor(name, url) {
	super()
	this.url = url
	this.name = name
  }

  async getName() {
	return this.name
  }

  async getUrl() {
	return this.url
  }
}

async function youtubeFromPlaylist(url) {
  let urls = []
  let names = []

  let promise_url_resolve
  let promise_url = new Promise((resolve) => { promise_url_resolve = resolve })
  let promise_names_resolve
  let promise_names = new Promise((resolve) => { promise_names_resolve = resolve })

  exec(`yt-dlp -x -g ${url}`, {}, (error, stdout, stderr) => {
	const output = stdout.split("\n")

	urls = output

	promise_url_resolve()
  })

  exec(`yt-dlp --print "%(title)s" ${url}`, {}, (error, stdout, stderr) => {
	const output = stdout.split("\n")

	names = output

	promise_names_resolve()
  })

  await promise_url
  await promise_names

  let playlist = []

  for (let i = 0; i < urls.length; i++) {
	playlist.push(new YoutubePlaylistEntry(names[i], urls[i]))
  }

  return playlist
}

async function createTracks(json) {
  switch (json.track_type) {
    case "raw":
      return [new Raw(json.name, json.url)]
      break

    case "youtube":
      return [new Youtube(json.url)]
      break
	
	case "youtube_playlist":
	  return await youtubeFromPlaylist(json.url)
	  break
  }

  return []
}

export default { Track, Raw, Youtube, createTracks }
