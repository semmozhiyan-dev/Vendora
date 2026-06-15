import React, { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native"
import { Image } from "expo-image"
import { Product } from "../types"
import { formatPrice } from "../utils/format"
import { Colors, Spacing, FontSize, BorderRadius } from "../constants/theme"

interface Props {
  product: Product
  onPress: (product: Product) => void
}

const PLACEHOLDER = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU3RUIiLz48L3N2Zz4="
const IMAGE_BASE = "/images/products"

const productImages = [
  "image1.jpg", "image2.jpg", "image3.jpg", "image4.jpg",
  "image5.jpg", "image6.jpg", "image7.jpg", "image8.jpg",
  "image9.jpg", "image10.jpg", "image11.jpg", "image12.jpg",
  "image13.jpg", "image14.jpg", "image15.jpg", "image16.jpg",
]

const getProductImage = (product: Product): string => {
  if (product.image) return product.image
  const index = product._id ? product._id.charCodeAt(product._id.length - 1) % 16 : 0
  return `${IMAGE_BASE}/${productImages[index]}`
}

const getSecondaryImage = (product: Product): string | null => {
  if (product.image) return null
  const index = product._id ? product._id.charCodeAt(product._id.length - 1) % 16 : 0
  const pairIndex = index % 2 === 0 ? index + 1 : index - 1
  if (pairIndex < 0 || pairIndex >= productImages.length) return null
  return `${IMAGE_BASE}/${productImages[pairIndex]}`
}

export default function ProductCard({ product, onPress }: Props) {
  const [hovered, setHovered] = useState(false)
  const imageSource = getProductImage(product)
  const secondaryImage = getSecondaryImage(product)
  const displayImage = hovered && secondaryImage ? secondaryImage : imageSource
  const outOfStock = product.stock <= 0

  const hoverProps = Platform.OS === "web" ? {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  } : {}

  return (
    <TouchableOpacity
      style={[styles.card, hovered && styles.cardHovered]}
      onPress={() => onPress(product)}
      activeOpacity={0.9}
      {...hoverProps}
    >
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: displayImage }}
          style={[styles.image, hovered && styles.imageHovered]}
          contentFit="cover"
          placeholder={PLACEHOLDER}
          transition={300}
        />
        <View style={[styles.imageOverlay, hovered && styles.imageOverlayVisible]} />
        {outOfStock && (
          <View style={styles.stockBadge}>
            <Text style={styles.stockBadgeText}>OUT OF STOCK</Text>
          </View>
        )}
        {product.category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{product.category}</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          <Text style={styles.viewLink}>View details</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius["2xl"],
    borderWidth: 1,
    borderColor: Colors.light.border,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    transition: Platform.OS === "web" ? "all 0.2s ease" : undefined,
  } as any,
  cardHovered: {
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    transform: [{ translateY: -3 }],
  } as any,
  imageWrap: {
    position: "relative",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: Colors.light.backgroundElement,
    transition: Platform.OS === "web" ? "transform 0.5s ease" : undefined,
  } as any,
  imageHovered: {
    transform: [{ scale: 1.08 }],
  } as any,
  imageOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0)",
    transition: Platform.OS === "web" ? "all 0.2s ease" : undefined,
  } as any,
  imageOverlayVisible: {
    backgroundColor: "rgba(0,0,0,0.06)",
  } as any,
  stockBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: Colors.light.danger,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  stockBadgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  categoryBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: Colors.light.accent,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  categoryBadgeText: {
    color: Colors.light.primary,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  info: {
    padding: Spacing.three,
    gap: Spacing.one,
  },
  name: {
    fontSize: FontSize.sm,
    fontWeight: "500",
    color: Colors.light.textHeading,
    lineHeight: 20,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: FontSize.base,
    fontWeight: "900",
    color: Colors.light.primary,
  },
  viewLink: {
    fontSize: FontSize.xs,
    color: Colors.light.accent,
    fontWeight: "600",
  },
})
