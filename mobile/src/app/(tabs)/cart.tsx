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
import { getCart, updateCartItem, removeCartItem } from "../../services/cart"
import { CartItem } from "../../types"
import { formatPrice, calcSubtotal, calcGst, calcTotal } from "../../utils/format"
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
        <ActivityIndicator size="large" color={Colors.light.primary} style={{ marginTop: 100 }} />
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
        <Text style={styles.heading}>Cart</Text>
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
      <Text style={styles.heading}>Cart ({items.length})</Text>
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
                source={{ uri: item.product.image || undefined }}
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
              activeOpacity={0.8}
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
  heading: {
    fontSize: FontSize["2xl"],
    fontWeight: "700",
    color: Colors.light.text,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  list: { padding: Spacing.four, paddingBottom: 120 },
  itemCard: {
    flexDirection: "row",
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.three,
    marginBottom: Spacing.three,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  updating: { opacity: 0.6 },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.backgroundElement,
  },
  itemInfo: { flex: 1, marginLeft: Spacing.three, gap: Spacing.one },
  itemName: { fontSize: FontSize.sm, fontWeight: "500", color: Colors.light.text },
  itemPrice: { fontSize: FontSize.base, fontWeight: "700", color: Colors.light.primary },
  quantityRow: { flexDirection: "row", alignItems: "center", gap: Spacing.three, marginTop: Spacing.one },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.backgroundElement,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyBtnText: { fontSize: 18, fontWeight: "600", color: Colors.light.text },
  qtyValue: { fontSize: FontSize.base, fontWeight: "600", minWidth: 24, textAlign: "center" },
  summary: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.four,
    marginTop: Spacing.two,
    gap: Spacing.two,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryLabel: { fontSize: FontSize.sm, color: Colors.light.textSecondary },
  summaryValue: { fontSize: FontSize.sm, fontWeight: "600", color: Colors.light.text },
  totalRow: { borderTopWidth: 1, borderTopColor: Colors.light.border, paddingTop: Spacing.three, marginTop: Spacing.one },
  totalLabel: { fontSize: FontSize.base, fontWeight: "700", color: Colors.light.text },
  totalValue: { fontSize: FontSize.base, fontWeight: "700", color: Colors.light.primary },
  checkoutBtn: {
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.three,
    alignItems: "center",
    marginTop: Spacing.two,
  },
  checkoutBtnText: { color: "#fff", fontSize: FontSize.base, fontWeight: "600" },
})
