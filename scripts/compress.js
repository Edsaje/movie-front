// =============================================================================
// SCRIPT D'AUTOMATISATION : COMPRESSION DES IMAGES DU PROJET (scripts/compress.js)
// Déclenché par la commande NPM : npm run compress
// =============================================================================

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import sharp from 'sharp'

// Dossier contenant les images à optimiser
const IMAGES_DIR = path.resolve('public/images')

// Extensions d'images prises en charge
const SUPPORTED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp']

async function compressImages() {
  console.log('\n[RETRO-COMPRESS] Démarrage de la compression des images du vidéoclub...\n')

  // 1. Vérifie si le dossier existe
  if (!fs.existsSync(IMAGES_DIR)) {
    console.log(`Dossier introuvable : ${IMAGES_DIR}`)
    return
  }

  // 2. Récupère tous les fichiers du dossier
  const files = fs.readdirSync(IMAGES_DIR)
  const imageFiles = files.filter((file) =>
    SUPPORTED_EXTENSIONS.includes(path.extname(file).toLowerCase()),
  )

  if (imageFiles.length === 0) {
    console.log('ℹAucune image trouvée dans public/images/ à compresser.')
    return
  }

  let totalOriginalSize = 0
  let totalCompressedSize = 0

  // 3. Traite chaque image
  for (const file of imageFiles) {
    const inputPath = path.join(IMAGES_DIR, file)
    const ext = path.extname(file).toLowerCase()
    const statsBefore = fs.statSync(inputPath)
    const sizeBefore = statsBefore.size

    // Buffer de sortie compressé
    let pipeline = sharp(inputPath)

    if (ext === '.png') {
      // Compression PNG sans perte excessive (niveau 8)
      pipeline = pipeline.png({ quality: 80, compressionLevel: 8 })
    } else if (ext === '.jpg' || ext === '.jpeg') {
      // Compression JPEG qualité 80
      pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true })
    } else if (ext === '.webp') {
      // Compression WebP qualité 80
      pipeline = pipeline.webp({ quality: 80 })
    }

    const outputBuffer = await pipeline.toBuffer()
    const sizeAfter = outputBuffer.length

    // Réécrit le fichier avec sa version compressée
    fs.writeFileSync(inputPath, outputBuffer)

    totalOriginalSize += sizeBefore
    totalCompressedSize += sizeAfter

    const gainPercent = (((sizeBefore - sizeAfter) / sizeBefore) * 100).toFixed(1)
    const sizeBeforeKb = (sizeBefore / 1024).toFixed(1)
    const sizeAfterKb = (sizeAfter / 1024).toFixed(1)

    console.log(`${file.padEnd(25)} : ${sizeBeforeKb} Ko ➔ ${sizeAfterKb} Ko (-${gainPercent}%)`)
  }

  // 4. Bilan global
  const totalSavedKb = ((totalOriginalSize - totalCompressedSize) / 1024).toFixed(1)
  const totalGainPercent = (
    ((totalOriginalSize - totalCompressedSize) / totalOriginalSize) *
    100
  ).toFixed(1)

  console.log('\n============================================================')
  console.log(
    `TOTAL ÉCONOMISÉ : ${totalSavedKb} Ko (${totalGainPercent}% de réduction sur le projet)`,
  )
  console.log('============================================================\n')
}

compressImages().catch((err) => {
  console.error('Erreur lors de la compression :', err)
  process.exit(1)
})
