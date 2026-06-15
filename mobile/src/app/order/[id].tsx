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
import { getOrderById, cancelOrder, getOrderTracking } from "../../services/orders"
import { Order } from "../../types"
import { formatPrice, formatDateTime, formatDate, statusColor, statusLabel } from "../../utils/format"
import { getProductImageUrl } from "../../utils/images"
import ErrorState from "../../components/ErrorState"
import { Colors, Spacing, FontSize, BorderRadius } from "../../constants/theme"

const STATUS_ORDER = ["PENDING", "PAID", "SHIPPED", "DELIVERED"]
const STATUS_LABELS: Record<string, string> = {
  PENDING: "Order placed",
  PAID: "Payment confirmed",
  SHIPPED: "Out for delivery",
  DELIVERED: "Delivered",
}

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [tracking, setTracking] = useState<{
    trackingId?: string; estimatedDelivery?: string; timeline: { status: string; timestamp: string }[]
  } | null>(null)
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
        const [orderRes, trackRes] = await Promise.allSettled([
          getOrderById(id),
          getOrderTracking(id),
        ])
        if (orderRes.status === "fulfilled") setOrder(orderRes.value.order)
        else throw new Error(orderRes.reason?.message || "Order not found")
        if (trackRes.status === "fulfilled") setTracking(trackRes.value.tracking)
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
  const timelineEntries = tracking?.timeline?.length
    ? tracking.timeline
    : order.timeline?.length
      ? order.timeline
      : STATUS_ORDER.map((s, i) => ({
          status: s,
          timestamp: i <= currentIdx ? order.createdAt : "",
        }))

  const progressPct = currentIdx >= 0 ? (currentIdx / (STATUS_ORDER.length - 1)) * 100 : 0
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
          <View style={styles.deliveredIconWrap}>
            <Text style={styles.deliveredIcon}>✓</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.deliveredText}>Order Delivered Successfully!</Text>
            <Text style={styles.deliveredSub}>Thank you for shopping with Vendora</Text>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        {order.items?.map((item) => (
          <View key={item.product?._id || Math.random()} style={styles.itemRow}>
            <Image
              source={{ uri: item.product?.image || getProductImageUrl(item.product?._id) }}
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
        <Text style={styles.sectionTitle}>Timeline</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
        </View>
        {timelineEntries.map((entry, i) => {
          const isPast = i <= currentIdx
          const isCurrent = i === currentIdx && currentIdx >= 0
          const label = STATUS_LABELS[entry.status] || statusLabel(entry.status)
          return (
            <View key={entry.status} style={styles.timelineRow}>
              <View style={styles.timelineDotCol}>
                <View style={[
                  styles.timelineDot,
                  isPast && styles.timelineDotPast,
                  isCurrent && styles.timelineDotCurrent,
                ]}>
                  {isPast && <Text style={styles.timelineCheck}>✓</Text>}
                </View>
                {i < timelineEntries.length - 1 && (
                  <View style={[styles.timelineLine, isPast && styles.timelineLinePast]} />
                )}
              </View>
              <View style={[
                styles.timelineCard,
                isPast && styles.timelineCardPast,
                isCurrent && styles.timelineCardCurrent,
              ]}>
                <Text style={[
                  styles.timelineLabel,
                  isPast && styles.timelineLabelPast,
                  isCurrent && styles.timelineLabelCurrent,
                ]}>{label}</Text>
                {entry.timestamp ? (
                  <Text style={styles.timelineDate}>{formatDateTime(entry.timestamp)}</Text>
                ) : (
                  <Text style={styles.timelinePending}>Pending</Text>
                )}
              </View>
            </View>
          )
        })}
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
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Order Date</Text>
          <Text style={styles.summaryValue}>{formatDate(order.createdAt)}</Text>
        </View>
        {order.paidAt && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Payment Date</Text>
            <Text style={styles.summaryValue}>{formatDate(order.paidAt)}</Text>
          </View>
        )}
        {order.razorpayPaymentId && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Payment ID</Text>
            <Text style={[styles.summaryValue, { fontFamily: "monospace", fontSize: FontSize.xs }]}>
              {order.razorpayPaymentId.slice(-12)}
            </Text>
          </View>
        )}
      </View>

      {(tracking?.trackingId || order.trackingId) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tracking Information</Text>
          <Text style={styles.trackingId}>ID: {tracking?.trackingId || order.trackingId}</Text>
          {(tracking?.estimatedDelivery || order.estimatedDelivery) && (
            <Text style={styles.estimatedDate}>
              Est. Delivery: {formatDate(tracking?.estimatedDelivery || order.estimatedDelivery || "")}
            </Text>
          )}
        </View>
      )}

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
    borderRadius: BorderRadius["3xl"],
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: Spacing.five,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderIdLabel: { fontSize: FontSize.sm, fontWeight: "600", color: Colors.light.textSecondary, fontFamily: "monospace" },
  statusBadge: { paddingHorizontal: Spacing.three, paddingVertical: Spacing.half, borderRadius: BorderRadius.full },
  statusText: { fontSize: FontSize.xs, fontWeight: "700", letterSpacing: 1 },
  orderDate: { fontSize: FontSize.xs, color: Colors.light.textSecondary, marginTop: Spacing.one },

  deliveredBanner: {
    backgroundColor: "#ECFDF5", borderRadius: BorderRadius["2xl"],
    borderWidth: 1, borderColor: "#A7F3D0", padding: Spacing.four,
    flexDirection: "row", alignItems: "center", gap: Spacing.three,
  },
  deliveredIconWrap: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: "#10B981",
    justifyContent: "center", alignItems: "center",
  },
  deliveredIcon: { fontSize: 20, color: "#fff", fontWeight: "800" },
  deliveredText: { fontSize: FontSize.base, fontWeight: "700", color: Colors.light.success },
  deliveredSub: { fontSize: FontSize.xs, color: Colors.light.textSecondary, marginTop: 1 },

  section: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius["2xl"],
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: Spacing.five,
  },
  sectionTitle: { fontSize: FontSize.base, fontWeight: "700", color: Colors.light.textHeading, marginBottom: Spacing.three },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.three,
  },
  itemImage: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.light.backgroundElement,
  },
  itemInfo: { flex: 1, marginLeft: Spacing.three },
  itemName: { fontSize: FontSize.sm, fontWeight: "500", color: Colors.light.textHeading },
  itemMeta: { fontSize: FontSize.xs, color: Colors.light.textSecondary, marginTop: 2 },
  itemTotal: { fontSize: FontSize.sm, fontWeight: "700", color: Colors.light.primary },

  addressText: { fontSize: FontSize.sm, color: Colors.light.text, lineHeight: 20 },

  progressBar: {
    height: 6, backgroundColor: Colors.light.backgroundElement,
    borderRadius: 3, marginBottom: Spacing.five, overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: Colors.light.success, borderRadius: 3 },
  timelineRow: { flexDirection: "row", marginBottom: 0 },
  timelineDotCol: { alignItems: "center", width: 36, marginRight: Spacing.three },
  timelineDot: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.light.card, borderWidth: 2,
    borderColor: Colors.light.border, justifyContent: "center", alignItems: "center",
    marginTop: Spacing.four, zIndex: 1,
  },
  timelineDotPast: { backgroundColor: "#10B981", borderColor: "#10B981" },
  timelineDotCurrent: {
    backgroundColor: Colors.light.card, borderColor: Colors.light.primary,
    borderWidth: 3,
  },
  timelineCheck: { color: "#fff", fontSize: 14, fontWeight: "800" },
  timelineLine: {
    width: 2, flex: 1, backgroundColor: Colors.light.border,
  },
  timelineLinePast: { backgroundColor: "#10B981" },
  timelineCard: {
    flex: 1, backgroundColor: Colors.light.card,
    borderWidth: 1, borderColor: Colors.light.border,
    borderRadius: BorderRadius["2xl"], padding: Spacing.four,
    marginBottom: Spacing.three, marginTop: Spacing.two,
  },
  timelineCardPast: { borderColor: "#10B981", backgroundColor: "#F0FDF4" },
  timelineCardCurrent: {
    borderColor: Colors.light.primary, backgroundColor: Colors.light.card,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  timelineLabel: { fontSize: FontSize.sm, fontWeight: "500", color: Colors.light.textSecondary },
  timelineLabelPast: { color: Colors.light.textHeading, fontWeight: "700" },
  timelineLabelCurrent: { color: Colors.light.primary, fontWeight: "700" },
  timelineDate: { fontSize: FontSize.xs, color: Colors.light.textSecondary, marginTop: 2 },
  timelinePending: { fontSize: FontSize.xs, color: Colors.light.textSecondary, marginTop: 2, fontStyle: "italic" },

  trackingId: { fontSize: FontSize.sm, fontWeight: "500", color: Colors.light.textHeading, fontFamily: "monospace" },
  estimatedDate: { fontSize: FontSize.xs, color: Colors.light.textSecondary, marginTop: Spacing.one },

  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: Spacing.two },
  summaryLabel: { fontSize: FontSize.sm, color: Colors.light.textSecondary },
  summaryValue: { fontSize: FontSize.sm, fontWeight: "600", color: Colors.light.primary },
  totalRow: { borderTopWidth: 1, borderTopColor: Colors.light.border, paddingTop: Spacing.three, marginTop: Spacing.one },
  summaryDivider: { height: 1, backgroundColor: Colors.light.border, marginVertical: Spacing.three },
  totalLabel: { fontSize: FontSize.base, fontWeight: "800", color: Colors.light.textHeading },
  totalValue: { fontSize: FontSize.base, fontWeight: "900", color: Colors.light.primary },

  cancelBtn: {
    borderWidth: 1,
    borderColor: Colors.light.danger,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.four,
    alignItems: "center",
  },
  cancelBtnDisabled: { opacity: 0.5 },
  cancelBtnText: { color: Colors.light.danger, fontSize: FontSize.base, fontWeight: "700" },
})
