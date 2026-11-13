import sharp from 'sharp'

const sizes = [
  ['icon-192.png', 192],
  ['icon-512.png', 512],
  ['icon-512-maskable.png', 512],
]

await Promise.all(
  sizes.map(([name, size]) => sharp('public/icon.svg').resize(size, size).png().toFile(`public/${name}`))
)