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

function createTrack(json) {
  switch (json.track_type) {
    case "raw":
      return new Raw(json.name, json.url)
      break

    case "youtube":
      return new Youtube(json.url)
      break
  }

  return null
}

export default { Track, Raw, Youtube, createTrack }
