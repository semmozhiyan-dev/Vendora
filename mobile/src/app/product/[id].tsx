import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native"
import { Image } from "expo-image"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { getProductById } from "../../services/products"
import { addToCart } from "../../services/cart"
import { Product } from "../../types"
import { formatPrice } from "../../utils/format"
import { getProductImages } from "../../utils/images"
import { ProductDetailSkeleton } from "../../components/LoadingSkeleton"
import ErrorState from "../../components/ErrorState"
import { Colors, Spacing, FontSize, BorderRadius } from "../../constants/theme"

const { width } = Dimensions.get("window")

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [addedMessage, setAddedMessage] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const images = product ? getProductImages(product._id) : []

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await getProductById(id)
        setProduct(res.product)
      } catch (e: any) {
        setError(e.message || "Product not found")
      } finally {
        setLoading(false)
      }
    }
    if (id) fetch()
  }, [id])

  const handleAddToCart = async () => {
    if (!product) return
    setAdding(true)
    try {
      await addToCart(product._id, quantity)
      setAddedMessage(true)
      setTimeout(() => setAddedMessage(false), 2000)
    } catch (e: any) {
      // silent
    } finally {
      setAdding(false)
    }
  }

  if (loading) return <ProductDetailSkeleton />
  if (error || !product) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ErrorState message={error || "Product not found"} onRetry={() => router.back()} />
      </View>
    )
  }

  const outOfStock = product.stock <= 0

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: product.image || images[selectedImage] }}
          style={styles.image}
          contentFit="cover"
          placeholder="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNFNUU3RUIiLz48L3N2Zz4="
        />
      </View>

      {images.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbnails}>
          {images.map((img, i) => (
            <TouchableOpacity
              key={img}
              onPress={() => setSelectedImage(i)}
              activeOpacity={0.7}
            >
              <Image
                source={{ uri: img }}
                style={[
                  styles.thumb,
                  i === selectedImage && styles.thumbActive,
                ]}
                contentFit="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <View style={styles.info}>
        {product.category && (
          <View style={styles.categoryPill}>
            <Text style={styles.category}>{product.category.toUpperCase()}</Text>
          </View>
        )}
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>

        <View style={styles.stockRow}>
          <View style={[styles.stockDot, outOfStock ? styles.dotOut : styles.dotIn]} />
          <Text style={[styles.stockText, outOfStock ? styles.stockOut : styles.stockIn]}>
            {outOfStock ? "Out of stock" : `${product.stock} in stock`}
          </Text>
        </View>

        {product.description ? (
          <>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </>
        ) : null}

        {!outOfStock && (
          <View style={styles.actionRow}>
            <Text style={styles.qtyLabel}>Quantity</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQuantity(Math.min(product.stock, quantity + 1))}
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.addBtn,
            (outOfStock || adding) && styles.addBtnDisabled,
          ]}
          onPress={handleAddToCart}
          disabled={outOfStock || adding}
          activeOpacity={0.9}
        >
          {adding ? (
            <ActivityIndicator color={Colors.light.primary} />
          ) : (
            <Text style={styles.addBtnText}>
              {outOfStock ? "Out of Stock" : addedMessage ? "Added to Cart" : "Add to Cart"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  content: { paddingBottom: 40 },
  imageWrap: {
    margin: Spacing.four,
    borderRadius: BorderRadius["3xl"],
    overflow: "hidden",
    backgroundColor: Colors.light.backgroundElement,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  thumbnails: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
    marginBottom: Spacing.four,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderColor: "transparent",
    opacity: 0.7,
  },
  thumbActive: {
    borderColor: Colors.light.accent,
    opacity: 1,
  },
  info: { paddingHorizontal: Spacing.five, gap: Spacing.three },
  categoryPill: {
    alignSelf: "flex-start",
    backgroundColor: Colors.light.accentLight,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  category: {
    fontSize: FontSize.xs,
    fontWeight: "700",
    color: Colors.light.accent,
    letterSpacing: 1.5,
  },
  name: { fontSize: FontSize["2xl"], fontWeight: "800", color: Colors.light.textHeading, lineHeight: 32 },
  price: { fontSize: FontSize["3xl"], fontWeight: "900", color: Colors.light.primary },
  stockRow: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  stockDot: { width: 8, height: 8, borderRadius: 4 },
  dotIn: { backgroundColor: Colors.light.success },
  dotOut: { backgroundColor: Colors.light.danger },
  stockText: { fontSize: FontSize.sm },
  stockIn: { color: Colors.light.success, fontWeight: "600" },
  stockOut: { color: Colors.light.danger, fontWeight: "600" },
  sectionTitle: {
    fontSize: FontSize.base,
    fontWeight: "700",
    color: Colors.light.textHeading,
    marginTop: Spacing.three,
  },
  description: { fontSize: FontSize.sm, color: Colors.light.text, lineHeight: 22 },
  actionRow: {
    marginTop: Spacing.five,
    paddingTop: Spacing.five,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  qtyLabel: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.light.textSecondary,
    marginBottom: Spacing.three,
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.four,
  },
  qtyBtn: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.card,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyBtnText: { fontSize: 22, fontWeight: "600", color: Colors.light.primary },
  qtyValue: { fontSize: FontSize.lg, fontWeight: "700", minWidth: 30, textAlign: "center" },
  addBtn: {
    backgroundColor: Colors.light.accent,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.four,
    alignItems: "center",
    marginTop: Spacing.five,
    marginBottom: Spacing.four,
  },
  addBtnDisabled: { opacity: 0.5 },
  addBtnText: { color: Colors.light.primary, fontSize: FontSize.base, fontWeight: "700" },
})
