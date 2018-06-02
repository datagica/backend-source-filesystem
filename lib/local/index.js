/* @flow weak */
'use strict'

const { BasicTemplate } = require('@datagica/backend-source')

const chokidar  = require('chokidar')
const formats   = require('./formats')
const utils     = require('./utils')

const { getAllFileData } = utils

class Template extends BasicTemplate {

  start () {
    if (this.isRunning || !this.config.isActive) { return }
    this.isRunning = true

    const config = this.config
    
    this.debug = true

    const onAdd = async file => {
      try {
        await this.config.saveRecord({
          uri        : `file://${file.path}`,
          date       : file.date,
          hash       : file.hash,
          bundleId   : config.bundleId,
          templateId : config.templateId,
          sourceId   : config.sourceId,
          name       : file.binary.filename,
          binary     : file.binary
        })
        console.log(`[file/local] processed ${file.path}`)
      } catch (exc) {
        console.log(`[file/local] failed ${file.path}: ${exc}`)
      }
    }

    // One-liner for current directory, ignores .dotfiles
    const patterns = config.settings.parameters.value.files.value
      .reduce((acc, item) => acc.concat(formats(item)), [])

    this.watcher = chokidar.watch(
      patterns,
      {
        ignored: /[\/\\]\./,
        persistent: true
      }
    )

    this.watcher.on('add', async filePath => {
      if (this.debug) console.log(`[file/local] new file ${filePath}`)
      try {
        const data = await getAllFileData(filePath)
        await onAdd(data)
      } catch (exc) {
        console.error(`[file/local] failed ${filePath}:`, exc)
      }
    })
    .on('change', async filePath => {
      if (this.debug) console.log(`[file/local] change on ${filePath}`)
      try {
        const data = await getAllFileData(filePath)
        await onAdd(data)
      } catch (exc) {
        console.error(`[file/local] failed ${filePath}:`, exc)
      }
    })
    .on('unlink', filePath => {
      if (this.debug) console.log(`[file/local] removed file ${filePath}`)
      this.api.delete(filePath)
    })
    .on('addDir', filePath => {
      if (this.debug) console.log(`[file/local] new dir ${filePath}`)
    })
    .on('unlinkDir', filePath => {
      if (this.debug) console.log(`[file/local] removed dir ${filePath}`)
    })
    .on('error', error => console.error(`[file/local] error ${error}`))
    .on('ready', () => {
      if (this.debug) console.log('[file/local] watching filesystem events')
    })
    .on('raw', (event, path, details) => {
      if (this.debug) console.log(JSON.stringify({ event, path, details }, null, 2));
    })
  }

  stop () {

    if (!this.isRunning) { return }

    this.isRunning = false

    if (this.watcher && typeof this.watcher.close === 'function') {
      this.watcher.close()
    }
  }
}

Template.templateId = "local"
Template.templateLabel = {
  en: "Files",
  fr: "Fichiers"
}
Template.templateDescription = {
  en: "Files or directories",
  fr: "Fichiers ou répertoires"
}

Template.settings = {
  parameters: {
    label: {
      en: "Settings",
      fr: "Paramètres"
    },
    type: "group",
    value: {
      files: {
        label: {
          en: "Files",
          fr: "Fichiers"
        },
        type: "filelist",
        value: []
      }
    }
  }
}

Template.meta = {
  templateId:          Template.templateId,
  templateLabel:       Template.templateLabel,
  templateDescription: Template.templateDescription,
  settings:            Template.settings,
}

module.exports = Template
