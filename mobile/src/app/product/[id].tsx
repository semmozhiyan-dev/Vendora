import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native"
import { Image } from "expo-image"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { getProductById } from "../../services/products"
import { addToCart } from "../../services/cart"
import { Product } from "../../types"
import { formatPrice } from "../../utils/format"
import { ProductDetailSkeleton } from "../../components/LoadingSkeleton"
import ErrorState from "../../components/ErrorState"
import { Colors, Spacing, FontSize, BorderRadius } from "../../constants/theme"

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [addedMessage, setAddedMessage] = useState(false)
  const router = useRouter()
  const insets = useSafeAreaInsets()

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
      <Image
        source={{ uri: product.image || undefined }}
        style={styles.image}
        contentFit="cover"
        placeholder="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNFNUU3RUIiLz48L3N2Zz4="
      />

      <View style={styles.info}>
        {product.category && (
          <Text style={styles.category}>{product.category.toUpperCase()}</Text>
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
          activeOpacity={0.8}
        >
          {adding ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.addBtnText}>
              {outOfStock ? "Out of Stock" : addedMessage ? "Added ✓" : "Add to Cart"}
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
  image: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: Colors.light.backgroundElement,
  },
  info: { padding: Spacing.four, gap: Spacing.three },
  category: {
    fontSize: FontSize.xs,
    fontWeight: "600",
    color: Colors.light.primary,
    letterSpacing: 1,
  },
  name: { fontSize: FontSize["2xl"], fontWeight: "700", color: Colors.light.text },
  price: { fontSize: FontSize["3xl"], fontWeight: "700", color: Colors.light.primary },
  stockRow: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  stockDot: { width: 8, height: 8, borderRadius: 4 },
  dotIn: { backgroundColor: Colors.light.success },
  dotOut: { backgroundColor: Colors.light.danger },
  stockText: { fontSize: FontSize.sm },
  stockIn: { color: Colors.light.success },
  stockOut: { color: Colors.light.danger },
  sectionTitle: {
    fontSize: FontSize.base,
    fontWeight: "600",
    color: Colors.light.text,
    marginTop: Spacing.two,
  },
  description: { fontSize: FontSize.sm, color: Colors.light.textSecondary, lineHeight: 22 },
  actionRow: { marginTop: Spacing.two },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.four,
  },
  qtyBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.backgroundElement,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyBtnText: { fontSize: 22, fontWeight: "600", color: Colors.light.text },
  qtyValue: { fontSize: FontSize.lg, fontWeight: "600", minWidth: 30, textAlign: "center" },
  addBtn: {
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.four,
    alignItems: "center",
    marginTop: Spacing.four,
  },
  addBtnDisabled: { opacity: 0.5 },
  addBtnText: { color: "#fff", fontSize: FontSize.base, fontWeight: "600" },
})
