import fs from 'fs'
import { promisify } from 'util'
import getTheme from './getTheme'
import colors from './colors'

const EXPORT_PATH = './dist/color-theme.json'

const buildTheme = async path => {
  const writeFile = promisify(fs.writeFile)
  const themeWithColors = getTheme(colors)

  try {
    await writeFile(path, JSON.stringify(themeWithColors))
    console.log('👍 Theme built. 💅')
  } catch (error) {
    console.log(error)
  }
}

buildTheme(EXPORT_PATH)
