import React, { useEffect, useState, useCallback } from "react"
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator,
  RefreshControl, Platform, Alert,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { Colors, Spacing, FontSize, BorderRadius } from "../../constants/theme"
import { useAuth } from "../../store/AuthContext"
import { getAdminOrders, updateOrderStatus } from "../../services/admin"
import { Order } from "../../types"
import { formatPrice, formatDate, statusColor, statusLabel } from "../../utils/format"

const STATUS_OPTIONS = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"]

export default function AdminOrdersScreen() {
  const { isAdmin } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [updating, setUpdating] = useState<string | null>(null)
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const fetch = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true); else setLoading(true)
      const res = await getAdminOrders(1, 100)
      setOrders(res.data)
    } catch { } finally {
      setLoading(false); setRefreshing(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdating(orderId)
    try {
      await updateOrderStatus(orderId, newStatus)
      fetch()
    } catch (e: any) {
      Alert.alert("Error", e.message)
    } finally { setUpdating(null) }
  }

  if (!isAdmin) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>Admin access required</Text>
      </View>
    )
  }

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={Colors.light.primary} style={{ marginTop: 100 }} />
      </View>
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/admin/dashboard")}>
          <Text style={styles.backText}>← Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Orders</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetch(true)} />}
      >
        {orders.length === 0 ? (
          <Text style={styles.emptyText}>No orders yet</Text>
        ) : orders.map((order) => (
          <TouchableOpacity
            key={order._id}
            style={styles.orderCard}
            onPress={() => router.push(`/order/${order._id}`)}
            activeOpacity={0.7}
          >
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>#{order._id.slice(-8)}</Text>
              <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
            </View>
            <View style={styles.orderBody}>
              <View style={styles.orderInfo}>
                <Text style={styles.orderAmount}>{formatPrice(order.totalAmount)}</Text>
                <View style={[styles.statusBadge, { backgroundColor: statusColor(order.status) + "20" }]}>
                  <Text style={[styles.statusText, { color: statusColor(order.status) }]}>
                    {statusLabel(order.status)}
                  </Text>
                </View>
              </View>
              <View style={styles.statusSelector}>
                {STATUS_OPTIONS.map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[
                      styles.statusOption,
                      order.status === s && { backgroundColor: statusColor(s) + "20" },
                    ]}
                    onPress={() => handleStatusChange(order._id, s)}
                    disabled={updating === order._id}
                  >
                    <Text style={[
                      styles.statusOptionText,
                      order.status === s && { color: statusColor(s), fontWeight: "700" },
                    ]}>{s.charAt(0) + s.slice(1).toLowerCase()}</Text>
                  </TouchableOpacity>
                ))}
                {updating === order._id && <ActivityIndicator size="small" color={Colors.light.primary} />}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  content: { padding: Spacing.four, paddingBottom: 60 },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: Spacing.four, paddingVertical: Spacing.three,
    borderBottomWidth: 1, borderBottomColor: Colors.light.border,
  },
  backText: { fontSize: FontSize.base, color: Colors.light.primary, fontWeight: "600" },
  heading: { fontSize: FontSize.xl, fontWeight: "800", color: Colors.light.textHeading },
  emptyText: { fontSize: FontSize.base, color: Colors.light.textSecondary, textAlign: "center", marginTop: 80 },
  orderCard: {
    backgroundColor: Colors.light.card, borderRadius: BorderRadius["2xl"],
    borderWidth: 1, borderColor: Colors.light.border, padding: Spacing.four, marginBottom: Spacing.three,
  },
  orderHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: Spacing.three },
  orderId: { fontSize: FontSize.sm, fontWeight: "700", color: Colors.light.textHeading, fontFamily: Platform.OS === "web" ? "monospace" : undefined },
  orderDate: { fontSize: FontSize.xs, color: Colors.light.textSecondary },
  orderBody: { gap: Spacing.three },
  orderInfo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  orderAmount: { fontSize: FontSize.lg, fontWeight: "800", color: Colors.light.primary },
  statusBadge: { paddingHorizontal: Spacing.three, paddingVertical: Spacing.half, borderRadius: BorderRadius.full },
  statusText: { fontSize: FontSize.xs, fontWeight: "700", letterSpacing: 1 },
  statusSelector: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two, alignItems: "center" },
  statusOption: { borderRadius: BorderRadius.full, paddingHorizontal: Spacing.three, paddingVertical: Spacing.half },
  statusOptionText: { fontSize: FontSize.xs, color: Colors.light.textSecondary, fontWeight: "500" },
  errorText: { fontSize: FontSize.base, color: Colors.light.danger, textAlign: "center", marginTop: 100 },
})
