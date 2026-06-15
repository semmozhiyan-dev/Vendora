import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Image } from "expo-image"
import { Product } from "../types"
import { formatPrice } from "../utils/format"
import { Colors, Spacing, FontSize, BorderRadius } from "../constants/theme"

interface Props {
  product: Product
  onPress: (product: Product) => void
}

const PLACEHOLDER = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU3RUIiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzlDQ0FGMiIgZm9udC1zaXplPSI0MCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuKWkjwvdGV4dD48L3N2Zz4="
const IMAGE_BASE = "https://vendore.tech/images/products"

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

export default function ProductCard({ product, onPress }: Props) {
  const imageSource = getProductImage(product)

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(product)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: imageSource }}
        style={styles.image}
        contentFit="cover"
        placeholder={PLACEHOLDER}
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <View style={styles.row}>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          {product.stock > 0 ? (
            <Text style={styles.inStock}>{product.stock} left</Text>
          ) : (
            <Text style={styles.outOfStock}>Out of stock</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: Colors.light.backgroundElement,
  },
  info: {
    padding: Spacing.three,
    gap: Spacing.one,
  },
  name: {
    fontSize: FontSize.sm,
    fontWeight: "500",
    color: Colors.light.text,
    lineHeight: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: FontSize.base,
    fontWeight: "700",
    color: Colors.light.primary,
  },
  inStock: {
    fontSize: FontSize.xs,
    color: Colors.light.success,
  },
  outOfStock: {
    fontSize: FontSize.xs,
    color: Colors.light.danger,
  },
})
