import React, { useEffect, useState, useCallback } from "react"
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native"
import { Image } from "expo-image"
import { useRouter } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useAuth } from "../../store/AuthContext"
import { getCart, updateCartItem, removeCartItem } from "../../services/cart"
import { CartItem } from "../../types"
import { formatPrice, calcSubtotal, calcGst, calcTotal } from "../../utils/format"
import { getProductImageUrl } from "../../utils/images"
import EmptyState from "../../components/EmptyState"
import ErrorState from "../../components/ErrorState"
import { Colors, Spacing, FontSize, BorderRadius } from "../../constants/theme"

export default function CartScreen() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set())
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { user } = useAuth()

  const fetchCart = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true)
      else setLoading(true)
      setError(null)
      const res = await getCart()
      setItems(res.cart?.items || [])
    } catch (e: any) {
      setError(e.message || "Failed to load cart")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchCart()
  }, [])

  const handleUpdate = async (productId: string, quantity: number) => {
    setUpdatingIds((prev) => new Set(prev).add(productId))
    try {
      if (quantity < 1) {
        await removeCartItem(productId)
      } else {
        await updateCartItem(productId, quantity)
      }
      await fetchCart()
    } catch (e: any) {
      // revert on error
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev)
        next.delete(productId)
        return next
      })
    }
  }

  const subtotal = calcSubtotal(
    items.map((i) => ({ price: i.product.price, quantity: i.quantity }))
  )
  const gst = calcGst(subtotal)
  const total = calcTotal(subtotal)

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={Colors.light.accent} style={{ marginTop: 100 }} />
      </View>
    )
  }

  if (error) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ErrorState message={error} onRetry={() => fetchCart()} />
      </View>
    )
  }

  if (items.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          subtitle="Browse products and add items to your cart"
          actionLabel="Browse Products"
          onAction={() => router.push("/(tabs)")}
        />
      </View>
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerRow}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>V</Text>
        </View>
        <Text style={styles.heading}>Cart</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{items.length}</Text>
        </View>
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => item.product._id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => fetchCart(true)} />
        }
        renderItem={({ item }) => {
          const isUpdating = updatingIds.has(item.product._id)
          return (
            <View style={[styles.itemCard, isUpdating && styles.updating]}>
              <Image
                source={{ uri: item.product.image || getProductImageUrl(item.product._id) }}
                style={styles.itemImage}
                contentFit="cover"
              />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={2}>
                  {item.product.name}
                </Text>
                <Text style={styles.itemPrice}>{formatPrice(item.product.price)}</Text>
                <View style={styles.quantityRow}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => handleUpdate(item.product._id, item.quantity - 1)}
                    disabled={isUpdating}
                  >
                    <Text style={styles.qtyBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyValue}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => handleUpdate(item.product._id, item.quantity + 1)}
                    disabled={isUpdating || item.quantity >= item.product.stock}
                  >
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )
        }}
        ListFooterComponent={() => (
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>Free</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>GST (18%)</Text>
              <Text style={styles.summaryValue}>{formatPrice(gst)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatPrice(total)}</Text>
            </View>
            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={() => router.push("/checkout")}
              activeOpacity={0.9}
            >
              <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    gap: Spacing.three,
  },
  logoBox: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 18,
    fontWeight: "900",
    color: Colors.light.accent,
  },
  heading: {
    fontSize: FontSize["2xl"],
    fontWeight: "800",
    color: Colors.light.textHeading,
    flex: 1,
  },
  countBadge: {
    backgroundColor: Colors.light.accent,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  countText: {
    fontSize: FontSize.xs,
    fontWeight: "700",
    color: Colors.light.primary,
  },
  list: { padding: Spacing.four, paddingBottom: 120 },
  itemCard: {
    flexDirection: "row",
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius["2xl"],
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: Spacing.three,
    marginBottom: Spacing.three,
  },
  updating: { opacity: 0.6 },
  itemImage: {
    width: 88,
    height: 88,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.light.backgroundElement,
  },
  itemInfo: { flex: 1, marginLeft: Spacing.three, gap: Spacing.one },
  itemName: { fontSize: FontSize.sm, fontWeight: "500", color: Colors.light.textHeading },
  itemPrice: { fontSize: FontSize.base, fontWeight: "900", color: Colors.light.primary },
  quantityRow: { flexDirection: "row", alignItems: "center", gap: Spacing.three, marginTop: Spacing.one },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.card,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyBtnText: { fontSize: 18, fontWeight: "600", color: Colors.light.primary },
  qtyValue: { fontSize: FontSize.base, fontWeight: "700", minWidth: 24, textAlign: "center" },
  summary: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius["2xl"],
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: Spacing.five,
    marginTop: Spacing.two,
    gap: Spacing.three,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryLabel: { fontSize: FontSize.sm, color: Colors.light.textSecondary },
  summaryValue: { fontSize: FontSize.sm, fontWeight: "600", color: Colors.light.primary },
  totalRow: { borderTopWidth: 1, borderTopColor: Colors.light.border, paddingTop: Spacing.four, marginTop: Spacing.two },
  totalLabel: { fontSize: FontSize.base, fontWeight: "700", color: Colors.light.textHeading },
  totalValue: { fontSize: FontSize.base, fontWeight: "900", color: Colors.light.primary },
  checkoutBtn: {
    backgroundColor: Colors.light.accent,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.four,
    alignItems: "center",
    marginTop: Spacing.three,
  },
  checkoutBtnText: { color: Colors.light.primary, fontSize: FontSize.base, fontWeight: "700" },
})
