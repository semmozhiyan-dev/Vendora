import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Colors, Spacing, FontSize, BorderRadius } from "../../constants/theme"
import { useAuth } from "../../store/AuthContext"
import api from "../../api/api"

interface DashboardStats {
  totalUsers: number
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  recentOrders: any[]
}

export default function AdminDashboardScreen() {
  const { isAdmin } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const insets = useSafeAreaInsets()

  const fetchStats = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true)
      else setLoading(true)
      const res = await api.get("/admin/dashboard")
      setStats(res.data.data)
    } catch {
      // silent
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (!isAdmin) {
    return (
      <View style={styles.container}>
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

  const statCards = stats
    ? [
        { label: "Users", value: stats.totalUsers, color: Colors.light.primary },
        { label: "Products", value: stats.totalProducts, color: Colors.light.success },
        { label: "Orders", value: stats.totalOrders, color: Colors.light.warning },
        {
          label: "Revenue",
          value: `₹${(stats.totalRevenue || 0).toLocaleString("en-IN")}`,
          color: Colors.light.danger,
        },
      ]
    : []

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => fetchStats(true)} />
      }
    >
      <Text style={styles.heading}>Admin Dashboard</Text>

      <View style={styles.statsGrid}>
        {statCards.map((card) => (
          <View key={card.label} style={styles.statCard}>
            <Text style={[styles.statValue, { color: card.color }]}>{card.value}</Text>
            <Text style={styles.statLabel}>{card.label}</Text>
          </View>
        ))}
      </View>

      {stats?.recentOrders?.length ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          {stats.recentOrders.map((order: any) => (
            <View key={order._id} style={styles.orderRow}>
              <Text style={styles.orderId}>#{order._id?.slice(-8)}</Text>
              <Text style={styles.orderAmount}>
                ₹{(order.totalAmount || 0).toLocaleString("en-IN")}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  content: { padding: Spacing.four, paddingBottom: 60 },
  heading: {
    fontSize: FontSize["2xl"],
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: Spacing.five,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.three,
    marginBottom: Spacing.five,
  },
  statCard: {
    width: "47%",
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.four,
    alignItems: "center",
  },
  statValue: {
    fontSize: FontSize["3xl"],
    fontWeight: "700",
  },
  statLabel: {
    fontSize: FontSize.sm,
    color: Colors.light.textSecondary,
    marginTop: Spacing.one,
  },
  section: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.four,
  },
  sectionTitle: {
    fontSize: FontSize.base,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: Spacing.four,
  },
  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.light.border,
  },
  orderId: {
    fontSize: FontSize.sm,
    fontWeight: "500",
    color: Colors.light.textSecondary,
    fontFamily: "monospace",
  },
  orderAmount: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.light.text,
  },
  errorText: {
    fontSize: FontSize.base,
    color: Colors.light.danger,
    textAlign: "center",
    marginTop: 100,
  },
})
