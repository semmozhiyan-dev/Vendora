import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native"
import { Image } from "expo-image"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { getOrderById, cancelOrder } from "../../services/orders"
import { Order } from "../../types"
import { formatPrice, formatDateTime, statusColor, statusLabel } from "../../utils/format"
import ErrorState from "../../components/ErrorState"
import { Colors, Spacing, FontSize, BorderRadius } from "../../constants/theme"

const STATUS_ORDER = ["PENDING", "PAID", "SHIPPED", "DELIVERED"]

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancelling, setCancelling] = useState(false)
  const router = useRouter()
  const insets = useSafeAreaInsets()

  useEffect(() => {
    if (!id) return
    const fetch = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await getOrderById(id)
        setOrder(res.order)
      } catch (e: any) {
        setError(e.message || "Order not found")
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  const handleCancel = async () => {
    if (!order) return
    setCancelling(true)
    try {
      await cancelOrder(order._id)
      const res = await getOrderById(order._id)
      setOrder(res.order)
    } catch (e: any) {
      // silent
    } finally {
      setCancelling(false)
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={Colors.light.primary} style={{ marginTop: 100 }} />
      </View>
    )
  }

  if (error || !order) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ErrorState message={error || "Order not found"} onRetry={() => router.back()} />
      </View>
    )
  }

  const currentIdx = STATUS_ORDER.indexOf(order.status)
  const timeline = order.timeline?.length
    ? order.timeline
    : STATUS_ORDER.map((s, i) => ({
        status: s,
        timestamp: i <= currentIdx ? order.createdAt : "",
      }))

  const canCancel = ["PENDING", "PAID"].includes(order.status)

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <View style={styles.headerRow}>
          <Text style={styles.orderIdLabel}>Order #{order._id.slice(-8)}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor(order.status) + "20" }]}>
            <Text style={[styles.statusText, { color: statusColor(order.status) }]}>
              {statusLabel(order.status)}
            </Text>
          </View>
        </View>
        <Text style={styles.orderDate}>{formatDateTime(order.createdAt)}</Text>
      </View>

      {order.status === "DELIVERED" && (
        <View style={styles.deliveredBanner}>
          <Text style={styles.deliveredIcon}>✅</Text>
          <Text style={styles.deliveredText}>Order Delivered Successfully!</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items</Text>
        {order.items?.map((item) => (
          <View key={item.product?._id || Math.random()} style={styles.itemRow}>
            <Image
              source={{ uri: item.product?.image || undefined }}
              style={styles.itemImage}
              contentFit="cover"
            />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={2}>
                {item.product?.name || "Product"}
              </Text>
              <Text style={styles.itemMeta}>
                {formatPrice(item.price)} × {item.quantity}
              </Text>
            </View>
            <Text style={styles.itemTotal}>
              {formatPrice(item.price * item.quantity)}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        {order.shippingAddress ? (
          <View>
            <Text style={styles.addressText}>{order.shippingAddress.street}</Text>
            <Text style={styles.addressText}>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
            </Text>
            <Text style={styles.addressText}>{order.shippingAddress.country}</Text>
          </View>
        ) : (
          <Text style={styles.addressText}>No address saved</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Timeline</Text>
        {timeline.map((entry, i) => {
          const isPast = i <= currentIdx
          const isCurrent = i === currentIdx && currentIdx >= 0
          return (
            <View key={entry.status} style={styles.timelineRow}>
              <View style={styles.timelineDot}>
                <View
                  style={[
                    styles.dot,
                    isPast && styles.dotPast,
                    isCurrent && styles.dotCurrent,
                  ]}
                />
                {i < timeline.length - 1 && (
                  <View style={[styles.line, isPast && styles.linePast]} />
                )}
              </View>
              <View style={styles.timelineContent}>
                <Text style={[styles.timelineStatus, isPast && styles.timelinePast]}>
                  {statusLabel(entry.status)}
                </Text>
                {entry.timestamp && (
                  <Text style={styles.timelineDate}>{formatDateTime(entry.timestamp)}</Text>
                )}
              </View>
            </View>
          )
        })}
      </View>

      {order.trackingId && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tracking</Text>
          <Text style={styles.trackingId}>ID: {order.trackingId}</Text>
          {order.estimatedDelivery && (
            <Text style={styles.estimatedDate}>
              Est. Delivery: {formatDateTime(order.estimatedDelivery)}
            </Text>
          )}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>
            {formatPrice(order.totalAmount / 1.18)}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>GST (18%)</Text>
          <Text style={styles.summaryValue}>
            {formatPrice(order.totalAmount - order.totalAmount / 1.18)}
          </Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatPrice(order.totalAmount)}</Text>
        </View>
      </View>

      {canCancel && (
        <TouchableOpacity
          style={[styles.cancelBtn, cancelling && styles.cancelBtnDisabled]}
          onPress={handleCancel}
          disabled={cancelling}
          activeOpacity={0.7}
        >
          {cancelling ? (
            <ActivityIndicator color={Colors.light.danger} />
          ) : (
            <Text style={styles.cancelBtnText}>Cancel Order</Text>
          )}
        </TouchableOpacity>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  content: { padding: Spacing.four, paddingBottom: 60, gap: Spacing.four },

  headerCard: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.four,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderIdLabel: { fontSize: FontSize.sm, fontWeight: "600", color: Colors.light.textSecondary, fontFamily: "monospace" },
  statusBadge: { paddingHorizontal: Spacing.three, paddingVertical: Spacing.half, borderRadius: BorderRadius.full },
  statusText: { fontSize: FontSize.xs, fontWeight: "600" },
  orderDate: { fontSize: FontSize.xs, color: Colors.light.textSecondary, marginTop: Spacing.one },

  deliveredBanner: {
    backgroundColor: "#ECFDF5",
    borderRadius: BorderRadius.lg,
    padding: Spacing.four,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  deliveredIcon: { fontSize: 24 },
  deliveredText: { fontSize: FontSize.base, fontWeight: "600", color: Colors.light.success },

  section: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.four,
  },
  sectionTitle: { fontSize: FontSize.base, fontWeight: "600", color: Colors.light.text, marginBottom: Spacing.three },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.three,
  },
  itemImage: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.backgroundElement,
  },
  itemInfo: { flex: 1, marginLeft: Spacing.three },
  itemName: { fontSize: FontSize.sm, fontWeight: "500", color: Colors.light.text },
  itemMeta: { fontSize: FontSize.xs, color: Colors.light.textSecondary, marginTop: 2 },
  itemTotal: { fontSize: FontSize.sm, fontWeight: "600", color: Colors.light.text },

  addressText: { fontSize: FontSize.sm, color: Colors.light.text, lineHeight: 20 },

  timelineRow: { flexDirection: "row", minHeight: 50 },
  timelineDot: { alignItems: "center", width: 24, marginRight: Spacing.three },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.light.border,
    marginTop: 4,
  },
  dotPast: { backgroundColor: Colors.light.success },
  dotCurrent: {
    backgroundColor: Colors.light.primary,
    borderWidth: 3,
    borderColor: Colors.light.primaryLight,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.light.border,
    marginTop: 4,
  },
  linePast: { backgroundColor: Colors.light.success },
  timelineContent: { flex: 1, paddingBottom: Spacing.four },
  timelineStatus: { fontSize: FontSize.sm, fontWeight: "500", color: Colors.light.textSecondary },
  timelinePast: { color: Colors.light.text, fontWeight: "600" },
  timelineDate: { fontSize: FontSize.xs, color: Colors.light.textSecondary, marginTop: 2 },

  trackingId: { fontSize: FontSize.sm, fontWeight: "500", color: Colors.light.text, fontFamily: "monospace" },
  estimatedDate: { fontSize: FontSize.xs, color: Colors.light.textSecondary, marginTop: Spacing.one },

  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: Spacing.two },
  summaryLabel: { fontSize: FontSize.sm, color: Colors.light.textSecondary },
  summaryValue: { fontSize: FontSize.sm, fontWeight: "600", color: Colors.light.text },
  totalRow: { borderTopWidth: 1, borderTopColor: Colors.light.border, paddingTop: Spacing.three, marginTop: Spacing.one },
  totalLabel: { fontSize: FontSize.base, fontWeight: "700", color: Colors.light.text },
  totalValue: { fontSize: FontSize.base, fontWeight: "700", color: Colors.light.primary },

  cancelBtn: {
    borderWidth: 1,
    borderColor: Colors.light.danger,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.three,
    alignItems: "center",
  },
  cancelBtnDisabled: { opacity: 0.5 },
  cancelBtnText: { color: Colors.light.danger, fontSize: FontSize.base, fontWeight: "600" },
})
