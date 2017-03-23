const glob = require('glob')
const Metalsmith = require('metalsmith')
const layouts = require('metalsmith-layouts')
const assets = require('metalsmith-assets')
const sass = require('metalsmith-sass')
const markdown = require('metalsmith-markdown')
const dataMarkdown = require('metalsmith-data-markdown')
const contentful = require('contentful-metalsmith')

const handlebars = require('handlebars')

// add custom helpers to handlebars
// https://github.com/superwolff/metalsmith-layouts/issues/63
//
// using the global handlebars instance
glob.sync('helpers/*.js').forEach((fileName) => {
  const helper = fileName.split('/').pop().replace('.js', '')

  handlebars.registerHelper(
    helper,
    require(`./${fileName}`)
  )
})

Metalsmith(__dirname)
  .source('src')
  .destination('build')
  .use(contentful({
    space_id: 'mlafe1ddeja4',
    access_token: '50e6372018f52e401878dbc39e1b0c7382c55210bf4be4b33fafb061d0baebd1',
  }))
  .use(layouts({
    engine: 'handlebars',
    partials: 'partials'
  }))
  .use(assets({
    source: 'assets/',
    destination: 'assets/'
  }))
  .use(sass({
    outputStyle: 'compressed'
  }))
  .use(markdown())
  .use(dataMarkdown({
    removeAttributeAfterwards: true
  }))
  .build(function (err) {
    if (err) throw err

    console.log('Successfully build metalsmith')
  })
