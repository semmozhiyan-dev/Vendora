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
import { useRouter } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { getMyOrders } from "../../services/orders"
import { Order } from "../../types"
import { formatPrice, formatDate, statusColor, statusLabel } from "../../utils/format"
import { OrderCardSkeleton } from "../../components/LoadingSkeleton"
import ErrorState from "../../components/ErrorState"
import EmptyState from "../../components/EmptyState"
import { Colors, Spacing, FontSize, BorderRadius } from "../../constants/theme"

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const fetchOrders = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true)
      else setLoading(true)
      setError(null)
      const res = await getMyOrders()
      setOrders(res.items || [])
    } catch (e: any) {
      setError(e.message || "Failed to load orders")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [])

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.heading}>My Orders</Text>
        <View style={styles.list}>
          {Array.from({ length: 3 }).map((_, i) => (
            <OrderCardSkeleton key={i} />
          ))}
        </View>
      </View>
    )
  }

  if (error && orders.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.heading}>My Orders</Text>
        <ErrorState message={error} onRetry={() => fetchOrders()} />
      </View>
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.heading}>My Orders</Text>
      {orders.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No orders yet"
          subtitle="Your order history will appear here"
          actionLabel="Start Shopping"
          onAction={() => router.push("/(tabs)")}
        />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchOrders(true)} />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.orderCard}
              onPress={() => router.push(`/order/${item._id}`)}
              activeOpacity={0.7}
            >
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>#{item._id.slice(-8)}</Text>
                <View style={[styles.statusBadge, { backgroundColor: statusColor(item.status) + "20" }]}>
                  <Text style={[styles.statusText, { color: statusColor(item.status) }]}>
                    {statusLabel(item.status)}
                  </Text>
                </View>
              </View>
              <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
              <View style={styles.orderFooter}>
                <Text style={styles.orderTotal}>{formatPrice(item.totalAmount)}</Text>
                <Text style={styles.orderItems}>{item.items?.length || 0} items</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
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
  list: { padding: Spacing.four },
  orderCard: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.four,
    marginBottom: Spacing.three,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.one,
  },
  orderId: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.light.textSecondary,
    fontFamily: "monospace",
  },
  statusBadge: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.half,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    fontSize: FontSize.xs,
    fontWeight: "600",
  },
  orderDate: {
    fontSize: FontSize.xs,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.two,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderTotal: {
    fontSize: FontSize.base,
    fontWeight: "700",
    color: Colors.light.text,
  },
  orderItems: {
    fontSize: FontSize.xs,
    color: Colors.light.textSecondary,
  },
})
