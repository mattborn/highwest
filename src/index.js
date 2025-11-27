const video = document.querySelector('video')
let clicked = false
video.addEventListener('click', () => {
  if (!clicked) {
    clicked = true
    video.muted = false
    // video.currentTime = 0
    setTimeout(() => video.play(), 100)
  }
})

fetch(window.location.pathname + 'projects.json')
  .then(res => res.json())
  .then(projects => {
    const grid = document.querySelector('.project-grid')
    if (grid) {
      projects.forEach(p => {
        const card = document.createElement('div')
        card.className = 'project-card'
        card.dataset.category = p.category.toLowerCase()
        if (p.image) {
          const optimizedImage = p.image.includes('cloudinary.com')
            ? p.image.replace('/upload/', '/upload/q_auto,w_832/')
            : p.image
          card.style.backgroundImage = `url(${optimizedImage})`
        }

        if (p.status) {
          const status = document.createElement('div')
          status.className = 'project-status'
          status.textContent = p.status
          card.appendChild(status)
        }

        const cardBottom = document.createElement('div')
        cardBottom.className = 'card-bottom'

        const title = document.createElement('h3')
        title.textContent = p.title
        cardBottom.appendChild(title)

        if (p.units || p.budget) {
          const stats = document.createElement('div')
          stats.className = 'project-stats'

          if (p.units) {
            const unitStat = document.createElement('div')
            unitStat.className = 'stat'
            unitStat.innerHTML = `<i class="fa-solid fa-key"></i><span>${p.units}</span>`
            stats.appendChild(unitStat)
          }

          if (p.budget) {
            const budgetStat = document.createElement('div')
            budgetStat.className = 'stat'
            budgetStat.innerHTML = `<i class="fa-solid fa-money-check-dollar"></i><span>$${p.budget} million budget</span>`
            stats.appendChild(budgetStat)
          }

          cardBottom.appendChild(stats)
        }

        if (p.location || p.link) {
          const footer = document.createElement('div')
          footer.className = 'project-footer'

          if (p.location) {
            const location = document.createElement('span')
            location.textContent = p.location
            footer.appendChild(location)
          }

          if (p.link) {
            const link = document.createElement('a')
            link.href = p.link
            link.textContent = 'Visit site ↗'
            if (!p.link.startsWith('/')) link.target = '_blank'
            footer.appendChild(link)
          }

          cardBottom.appendChild(footer)
        }

        card.appendChild(cardBottom)
        grid.appendChild(card)
      })
    }
  })
