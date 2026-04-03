const apiBase = '/api'

async function getJSON(path) {
  const r = await fetch(`${apiBase}/${path}`)
  return await r.json()
}

async function refreshNowPlaying() {
  try {
    const track = await getJSON('track')
    const nameEl = document.getElementById('now-playing-name')
    const audio = document.getElementById('player-audio')
    nameEl.textContent = track.name || 'Unknown'
    audio.src = track.url || ''
  } catch (e) {
    console.error('Failed to fetch track', e)
  }
}

async function initControls() {
  document.getElementById('btn-pause').addEventListener('click', () => fetch(`${apiBase}/pause`))
  document.getElementById('btn-resume').addEventListener('click', () => fetch(`${apiBase}/resume`))
  document.getElementById('btn-skip').addEventListener('click', () => fetch(`${apiBase}/skip`).then(refreshNowPlaying))

  const vol = document.getElementById('volume')
  vol.addEventListener('change', () => fetch(`${apiBase}/volume`, {method: 'POST', body: JSON.stringify({volume: parseFloat(vol.value * 100)}), headers: {'Content-Type': 'application/json'}}))

  const qform = document.getElementById('queue-form')
  qform.addEventListener('submit', async (e) => {
    e.preventDefault()
    const form = e.target
    const data = { url: form.url.value, name: form.name.value }
    await fetch(`${apiBase}/queue`, {method: 'POST', body: JSON.stringify(data), headers: {'Content-Type': 'application/json'}})
    form.reset()
  })
}

window.addEventListener('DOMContentLoaded', () => {
  initControls()
  refreshNowPlaying()
  setInterval(refreshNowPlaying, 5000)
})
