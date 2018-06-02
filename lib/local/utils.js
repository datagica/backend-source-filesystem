const util = require('util')
const fsp = require('fs-promise')
const getFileHash = require('hash-file')

/**
  * Get the latest file change date
  *
  */
async function getFileDate (filePath) {
  const { mtime } = await fsp.stat(filePath)
  const lastChanged = new Date(util.inspect(mtime))
  const now = new Date()
  const elapsed = now.getTime() - lastChanged.getTime()
  return { lastChanged, elapsed }
}

async function getFileDateAndHash (filePath) {
  return {
    path: filePath,
    hash: await getFileHash(filePath),
    date: await getFileDate(filePath),
  }
}

async function getAllFileData (filePath) {
  return {
    path: filePath,
    hash: await getFileHash(filePath),
    date: await getFileDate(filePath),
    binary: {
      buffer: await fsp.readFile(filePath),
      filename: filePath.split('/').pop(),
    }
  }
}

module.exports = {
  getFileHash,
  getFileDate,
  getFileDateAndHash,
  getAllFileData,
}
