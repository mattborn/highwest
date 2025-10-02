const fs = require('fs')
const path = require('path')

const config = {
  buildDir: './build',
  layoutFile: './src/layout.html',
  pagesFile: './src/pages.json',
  srcDir: './src',
}

const build = () => {
  const isDevelopment = process.argv.includes('--dev') || process.argv.includes('--watch')
  const basePath = isDevelopment ? '/' : '/highwest/'

  const layoutTemplate = fs.readFileSync(config.layoutFile, 'utf8')
  const layout = layoutTemplate.replace(/{base}/g, basePath)
  const pages = fs.existsSync(config.pagesFile)
    ? JSON.parse(fs.readFileSync(config.pagesFile, 'utf8'))
    : {}

  if (!fs.existsSync(config.buildDir))
    fs.mkdirSync(config.buildDir, { recursive: true })

  // Process source files
  if (fs.existsSync(config.srcDir)) {
    fs.readdirSync(config.srcDir).forEach(file => {
      const srcPath = path.join(config.srcDir, file)
      const buildPath = path.join(config.buildDir, file)
      const stat = fs.statSync(srcPath)

      if (stat.isDirectory()) {
        fs.cpSync(srcPath, buildPath, { recursive: true })
        console.log(`📁 ${file}`)
      } else if (file.endsWith('.html') && file !== 'layout.html') {
        const content = fs.readFileSync(srcPath, 'utf8')
        const pageName = file.replace('.html', '')
        const pageConfig = pages[pageName] || {}

        const replacements = {
          ...pageConfig,
          content,
          moreStyles: fs.existsSync(path.join(config.srcDir, `${pageName}.css`))
            ? `<link rel="stylesheet" href="${pageName}.css" />`
            : '',
          moreScripts: fs.existsSync(path.join(config.srcDir, `${pageName}.js`))
            ? `<script defer src="${pageName}.js"></script>`
            : '',
        }

        let html = layout
        Object.keys(replacements).forEach(key => {
          html = html.replace(new RegExp(`{${key}}`, 'g'), replacements[key])
        })

        fs.writeFileSync(buildPath, html)
        console.log(`📄 ${file}`)
      } else if (file !== 'layout.html') {
        fs.copyFileSync(srcPath, buildPath)
        console.log(`📄 ${file}`)
      }
    })
  }

  // Copy assets folder
  if (fs.existsSync('./assets')) {
    fs.cpSync('./assets', path.join(config.buildDir, 'assets'), { recursive: true })
    console.log(`📁 assets`)
  }

  // Copy root files
  ;['CNAME', 'favicon.ico', 'favicon.svg', 'robots.txt'].forEach(file => {
    if (fs.existsSync(file)) {
      fs.copyFileSync(file, path.join(config.buildDir, file))
      console.log(`📋 ${file}`)
    }
  })

  console.log('\n🎉 Build complete!')
}

build()

if (process.argv.includes('--watch')) {
  fs.watch(config.srcDir, () => build())
  console.log('Watching for changes')
}
