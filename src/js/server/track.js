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
    exec(`yt-dlp -x -g ${this.url}`, {}, (error, stdout, stderr) => {
	  this.real_url = stdout

	  exec(`yt-dlp --print "%(title)s" ${this.url}`, {}, (error, stdout, stderr) => {
		this.name = stdout

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

export default { Track, Raw, Youtube }
