// Load and render projects
fetch(window.location.pathname + 'projects.json')
  .then(res => res.json())
  .then(projects => {
    const grid = document.querySelector('.project-grid')
    if (grid) {
      projects.forEach(p => {
        const card = p.link ? document.createElement('a') : document.createElement('div')
        card.className = 'project-card'

        if (p.link) {
          card.href = p.link
          if (!p.link.startsWith('/')) {
            card.target = '_blank'
          }
        }

        const imageDiv = document.createElement('div')
        imageDiv.className = 'project-image'

        const img = document.createElement('img')
        img.alt = p.title
        img.src = p.image

        const about = document.createElement('p')
        about.className = 'project-about'
        about.textContent = p.description

        const titleDiv = document.createElement('div')
        titleDiv.className = 'project-title'

        const title = document.createElement('h3')
        title.textContent = p.title

        const info = document.createElement('span')
        if (p.link) {
          info.className = 'project-url'
          const isLocal = p.link.startsWith('/')
          const url = isLocal ? new URL(p.link, window.location.origin) : new URL(p.link)
          info.textContent = url.hostname + (url.pathname !== '/' ? url.pathname : '')
        } else {
          info.className = 'project-location'
          info.textContent = p.location
        }

        imageDiv.appendChild(img)
        imageDiv.appendChild(about)
        titleDiv.appendChild(title)
        titleDiv.appendChild(info)
        card.appendChild(imageDiv)
        card.appendChild(titleDiv)
        grid.appendChild(card)
      })

      // ScrollReveal for dynamically loaded project cards
      ScrollReveal().reveal('.project-card', {
        cleanup: true,
        distance: '10%',
        interval: 100,
        origin: 'bottom',
        viewOffset: { bottom: 300 },
      })
      ScrollReveal().sync()
    }
  })
