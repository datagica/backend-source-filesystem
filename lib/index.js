/* @flow weak */
'use strict'

const TemplateBundle = require('@datagica/backend-source').TemplateBundle;

const Local = require('./local/index')

class Bundle extends TemplateBundle {

  constructor() {
    super({
      name: "file",
      label: {
        en: "Documents",
        fr: "Documents"
      },
      description: {
        en: "Sync with documents of various formats",
        fr: "Synchronisation avec des documents"
      },
      templates: [
        Local
      ]
    })
  }
}

module.exports = Bundle
