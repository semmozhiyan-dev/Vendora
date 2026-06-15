const PRODUCT_IMAGES_BASE = "/images/products"

export function getProductImageUrl(productId?: string, index: number = 0): string {
  if (!productId) return `${PRODUCT_IMAGES_BASE}/image1.jpg`
  const hash = [...productId].reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const pairIndex = (hash % 8) * 2 + index
  const imageNum = Math.min(pairIndex + 1, 16)
  return `${PRODUCT_IMAGES_BASE}/image${imageNum}.jpg`
}

export function getProductImages(productId?: string): string[] {
  if (!productId) return [`${PRODUCT_IMAGES_BASE}/image1.jpg`]
  const hash = [...productId].reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const pairIndex = (hash % 8) * 2
  return [
    `${PRODUCT_IMAGES_BASE}/image${Math.min(pairIndex + 1, 16)}.jpg`,
    `${PRODUCT_IMAGES_BASE}/image${Math.min(pairIndex + 2, 16)}.jpg`,
  ]
}
