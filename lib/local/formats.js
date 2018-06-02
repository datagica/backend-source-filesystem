const fs = require('fs')

const fileTypes = [
  'pdf',
  'txt',
  'htm',
  'html',
  'md',
  'markdown',
  'odt',
  'ott',
  'ods',
  'ots',
  'odp',
  'otp',
  'odg',
  'otg',
  'odf',
  'rtf',
  'png',
  'jpg',
  'xml',
  'sql',
  'log',
  'csv',
  'xsl',
  'xls',
  'xlsx',
  'xlsb',
  'xlsm',
  'xltx',
  'pptx',
  'potx',
  'doc',
  'docx'
]


function getPatterns(input) {
  if (fs.lstatSync(input).isDirectory()) {
    return [ `${input}${input.match(/\/$/) ? '' : '/'}**/*.+(${fileTypes.join('|')})` ]
  } else {
    return [ input ]
  }
}

module.exports = getPatterns
