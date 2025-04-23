import gulp from 'gulp'
import sharp from 'sharp'
import { deleteAsync } from 'del'
import path from 'path'
import fs from 'fs/promises'

const paths = {
  src: img/',
  dest: './dist-img/'
}

// WebP変換＋ファイル名ベースで自動命名
async function convertWebp() {
  await fs.mkdir(paths.dest, { recursive: true })

  const files = await fs.readdir(paths.src)

  // ファイル名の共通部分をキーにして連番管理
  const groupCount = {}

  await Promise.all(
    files.map(async file => {
      const ext = path.extname(file)
      const rawName = path.basename(file, ext)
      const inputPath = path.join(paths.src, file)

      if (!['.jpg', '.jpeg', '.png'].includes(ext.toLowerCase())) return

      // 連番前のベース名を抽出（例：about-image）
      const baseMatch = rawName.match(/^([a-z0-9\-]+?)(?:[-_]?[a-z0-9]*)?$/i)
      const baseName = baseMatch ? baseMatch[1] : 'image'

      // 連番カウント
      if (!groupCount[baseName]) groupCount[baseName] = 1
      const padded = String(groupCount[baseName]).padStart(2, '0')
      groupCount[baseName]++

      const outputName = `${baseName}-${padded}.webp`
      const outputPath = path.join(paths.dest, outputName)

      const buffer = await fs.readFile(inputPath)

      await sharp(buffer)
        .webp({ quality: 80 })
        .toFile(outputPath)
    })
  )
}

// クリーン
function clean() {
  return deleteAsync([paths.dest])
}

const build = gulp.series(clean, convertWebp)
export { build }
export default build
