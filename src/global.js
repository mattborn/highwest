// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href')
    if (href.startsWith('#') && !href.match(/#(all|hospitality|multifamily|commercial)$/)) {
      e.preventDefault()
      const target = document.querySelector(href)
      if (target) target.scrollIntoView({ behavior: 'smooth' })
    }
  })
})

// Filter functionality
document.addEventListener('click', e => {
  const filterLink = e.target.closest('.filter-nav a')
  if (filterLink) {
    e.preventDefault()
    document.querySelectorAll('.filter-nav a').forEach(a => a.classList.remove('active'))
    filterLink.classList.add('active')

    const filter = filterLink.href.split('#')[1]
    document.querySelectorAll('.project-card').forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter
      card.style.display = show ? '' : 'none'
      if (show) card.style.visibility = 'visible'
    })
  }
})

// ScrollReveal animations
const sr = ScrollReveal({
  cleanup: true,
  distance: '20%',
  interval: 100,
  origin: 'bottom',
  viewFactor: 0,
})
sr.reveal('.logo, nav a, h1, h2, h3, p, .button, .signoff, .team-card, .filter-nav')
