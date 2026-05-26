const STORAGE_KEY = 'shoppingList'
const THEME_KEY = 'shoppingList:theme'
const FILTER_KEY = 'shoppingList:filter'
const form = document.getElementById('item-form')
const input = document.getElementById('item-input')
const qtyInput = document.getElementById('item-qty')
const sectorInput = document.getElementById('item-sector')
const colorPicker = document.getElementById('color-picker')
const listEl = document.getElementById('items-list')
const clearBtn = document.getElementById('clear-btn')
const filterContainer = document.querySelector('.filters')

const PLAYLIST_KEY = 'shoppingList:playlist'
const songForm = document.getElementById('song-form')
const songTitleInput = document.getElementById('song-title')
const songUrlInput = document.getElementById('song-url')
const playlistEl = document.getElementById('playlist')
const audioPlayer = document.getElementById('audio-player')
const playAllBtn = document.getElementById('play-all-btn')

let currentFilter = localStorage.getItem(FILTER_KEY) || 'all'

function loadList(){
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : []
}

function saveList(list){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c]))
}

function render(){
  const list = loadList()
  listEl.innerHTML = ''
  // normalize items and keep original index
  const normalized = list.map((it, i) => ({
    idx: i,
    name: it.name || '',
    qty: (it.qty && Number(it.qty)) || 1,
    sector: it.sector || 'Geral',
    done: !!it.done
  }))
  // aplicar filtro antes de agrupar
  const filtered = normalized.filter(item => {
    if(currentFilter === 'pendentes') return !item.done
    if(currentFilter === 'comprados') return item.done
    return true
  })

  // group by sector
  const groups = filtered.reduce((acc, item) => {
    const key = item.sector || 'Geral'
    if(!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})
  // sectors sorted alphabetically
  const sectors = Object.keys(groups).sort((a,b)=> a.localeCompare(b, 'pt', {sensitivity:'base'}))
  sectors.forEach(sector => {
    const group = groups[sector]
    group.sort((a,b)=> a.name.localeCompare(b.name, 'pt', {sensitivity:'base'}))
    const wrapper = document.createElement('div')
    wrapper.className = 'sector-group'
    const title = document.createElement('div')
    title.className = 'sector-title'
    title.textContent = sector
    const ul = document.createElement('ul')
    group.forEach(item => {
      const li = document.createElement('li')
      li.className = 'item' + (item.done ? ' done' : '')
      li.innerHTML = `<label><input type="checkbox" data-index="${item.idx}" ${item.done? 'checked':''}> <span class="text">${escapeHtml(item.name)} <small class="qty">x${item.qty}</small></span></label><div class="actions"><button data-edit="${item.idx}">Editar</button><button data-delete="${item.idx}">Excluir</button></div>`
      ul.appendChild(li)
    })
    wrapper.appendChild(title)
    wrapper.appendChild(ul)
    listEl.appendChild(wrapper)
  })
}

function applySavedTheme(){
  const saved = localStorage.getItem(THEME_KEY)
  const color = saved || getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#2b7cff'
  document.documentElement.style.setProperty('--accent', color)
  if(colorPicker) colorPicker.value = color
}

if(colorPicker){
  colorPicker.addEventListener('input', (e)=>{
    const c = e.target.value
    document.documentElement.style.setProperty('--accent', c)
    localStorage.setItem(THEME_KEY, c)
  })
}

function updateFilterUI(){
  if(!filterContainer) return
  const buttons = filterContainer.querySelectorAll('[data-filter]')
  buttons.forEach(b=> b.classList.toggle('active', b.getAttribute('data-filter') === currentFilter))
}

if(filterContainer){
  filterContainer.addEventListener('click', (e)=>{
    const btn = e.target.closest('[data-filter]')
    if(!btn) return
    currentFilter = btn.getAttribute('data-filter')
    localStorage.setItem(FILTER_KEY, currentFilter)
    updateFilterUI()
    render()
  })
}

form.addEventListener('submit', (e)=>{
  e.preventDefault()
  const name = input.value.trim()
  if(!name) return
  const qty = parseInt(qtyInput.value, 10) || 1
  const sector = (sectorInput && sectorInput.value) || 'Geral'
  const list = loadList()
  list.push({name, qty, sector, done:false})
  saveList(list)
  input.value = ''
  qtyInput.value = 1
  if(sectorInput) sectorInput.value = 'Geral'
  render()
})

listEl.addEventListener('click', (e)=>{
  const edit = e.target.closest('[data-edit]')
  const del = e.target.closest('[data-delete]')
  if(edit){
    const idx = Number(edit.getAttribute('data-edit'))
    const list = loadList()
    const current = list[idx]
    const updatedName = prompt('Editar item', current.name)
    if(updatedName === null) return
    const name = updatedName.trim()
    if(!name) return
    const updatedQty = prompt('Quantidade', String(current.qty))
    if(updatedQty === null) return
    const q = parseInt(updatedQty, 10)
    const updatedSector = prompt('Setor', current.sector || 'Geral')
    if(updatedSector === null) return
    const sectorVal = updatedSector.trim() || 'Geral'
    list[idx].name = name
    list[idx].qty = (isNaN(q) || q < 1) ? 1 : q
    list[idx].sector = sectorVal
    saveList(list)
    render()
    return
  }
  if(del){
    const idx = Number(del.getAttribute('data-delete'))
    const list = loadList()
    list.splice(idx,1)
    saveList(list)
    render()
    return
  }
})

listEl.addEventListener('change', (e)=>{
  if(e.target.type === 'checkbox'){
    const idx = Number(e.target.getAttribute('data-index'))
    const list = loadList()
    list[idx].done = e.target.checked
    saveList(list)
    render()
  }
})

clearBtn.addEventListener('click', ()=>{
  if(confirm('Apagar todos os itens?')){
    localStorage.removeItem(STORAGE_KEY)
    render()
  }
})

// Playlist functions
function loadPlaylist(){
  const raw = localStorage.getItem(PLAYLIST_KEY)
  return raw ? JSON.parse(raw) : []
}

function savePlaylist(pl){
  localStorage.setItem(PLAYLIST_KEY, JSON.stringify(pl))
}

function renderPlaylist(){
  if(!playlistEl) return
  const pl = loadPlaylist()
  playlistEl.innerHTML = ''
  pl.forEach((t, i)=>{
    const li = document.createElement('li')
    li.className = 'song-item'
    li.innerHTML = `<span class="song-title">${escapeHtml(t.title)}</span><div class="song-actions"><button data-play="${i}">▶</button><button data-delete-song="${i}">Excluir</button></div>`
    playlistEl.appendChild(li)
  })
}

if(songForm){
  songForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    const title = songTitleInput.value.trim()
    const url = songUrlInput.value.trim()
    if(!title) return
    const pl = loadPlaylist()
    pl.push({title, url})
    savePlaylist(pl)
    songTitleInput.value = ''
    songUrlInput.value = ''
    renderPlaylist()
  })
}

if(playlistEl){
  playlistEl.addEventListener('click', (e)=>{
    const play = e.target.closest('[data-play]')
    const del = e.target.closest('[data-delete-song]')
    if(play){
      const idx = Number(play.getAttribute('data-play'))
      const pl = loadPlaylist()
      const track = pl[idx]
      if(!track) return
      if(track.url){
        const url = track.url.trim()
        // spotify URI ou link -> abrir no Spotify
        if(url.startsWith('spotify:') || url.includes('open.spotify.com')){
          let openUrl = url
          if(url.startsWith('spotify:')){
            const parts = url.split(':')
            if(parts.length >= 3){
              // spotify:track:<id> -> https://open.spotify.com/track/<id>
              openUrl = 'https://open.spotify.com/' + parts[1] + '/' + parts[2]
            }
          }
          window.open(openUrl, '_blank')
        } else if(/\.(mp3|wav|ogg|m4a)$/i.test(url)){
          // se for arquivo de áudio direto, tocar no player
          audioPlayer.style.display = 'block'
          audioPlayer.src = url
          audioPlayer.play().catch(()=>{})
        } else {
          // abrir link em nova aba
          window.open(url, '_blank')
        }
      } else {
        // buscar no Spotify por título quando não há URL
        const q = encodeURIComponent(track.title)
        window.open('https://open.spotify.com/search/' + q, '_blank')
      }
    }
    if(del){
      const idx = Number(del.getAttribute('data-delete-song'))
      const pl = loadPlaylist()
      pl.splice(idx,1)
      savePlaylist(pl)
      renderPlaylist()
    }
  })
}

// Play all (reproduzir sequencialmente arquivos de áudio; abrir links/Spotify em novas abas se confirmado)
if(playAllBtn){
  playAllBtn.addEventListener('click', ()=>{
    const pl = loadPlaylist()
    if(!pl || pl.length === 0) return alert('Playlist vazia')
    const audioQueue = []
    const external = []
    pl.forEach(track => {
      const url = (track.url || '').trim()
      if(url){
        if(url.startsWith('spotify:') || url.includes('open.spotify.com')){
          let openUrl = url
          if(url.startsWith('spotify:')){
            const parts = url.split(':')
            if(parts.length >= 3) openUrl = 'https://open.spotify.com/' + parts[1] + '/' + parts[2]
          }
          external.push(openUrl)
        } else if(/\.(mp3|wav|ogg|m4a)$/i.test(url)){
          audioQueue.push(url)
        } else {
          external.push(url)
        }
      } else {
        // sem URL: sugerir busca no Spotify
        external.push('https://open.spotify.com/search/' + encodeURIComponent(track.title))
      }
    })

    // perguntar ao usuário se deseja abrir links externos
    if(external.length > 0){
      const ok = confirm(`Existem ${external.length} faixas sem arquivo de áudio. Abrir no Spotify/links em novas abas? (OK = abrir, Cancel = ignorar)`)
      if(ok){
        external.forEach(u=> window.open(u,'_blank'))
      }
    }

    if(audioQueue.length === 0) return

    let idx = 0
    function playNext(){
      if(idx >= audioQueue.length){
        audioPlayer.style.display = 'none'
        audioPlayer.src = ''
        audioPlayer.onended = null
        return
      }
      audioPlayer.style.display = 'block'
      audioPlayer.src = audioQueue[idx]
      audioPlayer.play().catch(()=>{})
      idx++
    }

    audioPlayer.onended = playNext
    playNext()
  })
}


render()
// Definir tema rosa conforme solicitado e salvar no localStorage
localStorage.setItem(THEME_KEY, '#ff69b4')
applySavedTheme()
renderPlaylist()
updateFilterUI()
