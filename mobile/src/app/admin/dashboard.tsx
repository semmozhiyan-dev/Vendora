import React, { useEffect, useState, useCallback } from "react"
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { Colors, Spacing, FontSize, BorderRadius } from "../../constants/theme"
import { useAuth } from "../../store/AuthContext"
import { getDashboard } from "../../services/admin"
import { formatPrice, statusColor, statusLabel } from "../../utils/format"

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
  const router = useRouter()

  const fetchStats = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true)
      else setLoading(true)
      const res = await getDashboard()
      setStats(res.data)
    } catch {
      // silent
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const navItems = [
    { label: "Products", route: "/admin/products" },
    { label: "Orders", route: "/admin/orders" },
    { label: "Users", route: "/admin/users" },
  ]

  if (!isAdmin) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Admin access required</Text>
      </View>
    )
  }

  if (loading && !refreshing && !stats) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={Colors.light.primary} style={{ marginTop: 100 }} />
      </View>
    )
  }

  const statCards = stats
    ? [
        { label: "Revenue", value: formatPrice(stats.totalRevenue || 0), color: Colors.light.accent },
        { label: "Orders", value: stats.totalOrders, color: "#8B5CF6" },
        { label: "Products", value: stats.totalProducts, color: "#10B981" },
        { label: "Users", value: stats.totalUsers, color: Colors.light.primary },
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
      <View style={styles.headerCard}>
        <Text style={styles.headerLabel}>Overview</Text>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <Text style={styles.headerSub}>Welcome back, Admin</Text>
      </View>

      <View style={styles.statsGrid}>
        {statCards.map((card) => (
          <View key={card.label} style={styles.statCard}>
            <Text style={[styles.statValue, { color: card.color }]}>{card.value}</Text>
            <Text style={styles.statLabel}>{card.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.navGrid}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.navCard}
            onPress={() => router.push(item.route)}
            activeOpacity={0.7}
          >
            <Text style={styles.navLabel}>{item.label}</Text>
            <Text style={styles.navArrow}>→</Text>
          </TouchableOpacity>
        ))}
      </View>

      {stats?.recentOrders?.length ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          {stats.recentOrders.map((order: any) => (
            <TouchableOpacity
              key={order._id}
              style={styles.orderRow}
              onPress={() => router.push(`/order/${order._id}`)}
            >
              <View>
                <Text style={styles.orderId}>#{order._id?.slice(-8)}</Text>
                <Text style={styles.orderCustomer}>{order.user?.name || "Customer"}</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.orderAmount}>
                  {formatPrice(order.totalAmount || 0)}
                </Text>
                <View style={[styles.orderStatus, { backgroundColor: statusColor(order.status) + "20" }]}>
                  <Text style={[styles.orderStatusText, { color: statusColor(order.status) }]}>
                    {statusLabel(order.status)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  content: { padding: Spacing.four, paddingBottom: 60 },
  headerCard: {
    backgroundColor: Colors.light.card, borderRadius: BorderRadius["3xl"],
    borderWidth: 1, borderColor: Colors.light.border, padding: Spacing.five, marginBottom: Spacing.five,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 24, elevation: 4,
  },
  headerLabel: {
    fontSize: FontSize.xs, fontWeight: "700", color: Colors.light.accent,
    letterSpacing: 3, textTransform: "uppercase", marginBottom: Spacing.one,
  },
  headerTitle: { fontSize: FontSize["2xl"], fontWeight: "800", color: Colors.light.textHeading },
  headerSub: { fontSize: FontSize.sm, color: Colors.light.textSecondary, marginTop: Spacing.one },
  statsGrid: {
    flexDirection: "row", flexWrap: "wrap", gap: Spacing.three, marginBottom: Spacing.five,
  },
  statCard: {
    width: "47%", backgroundColor: Colors.light.card, borderRadius: BorderRadius["2xl"],
    borderWidth: 1, borderColor: Colors.light.border, padding: Spacing.four, alignItems: "center",
  },
  statValue: { fontSize: FontSize["2xl"], fontWeight: "900" },
  statLabel: {
    fontSize: FontSize.xs, color: Colors.light.textSecondary, marginTop: Spacing.one,
    fontWeight: "700", letterSpacing: 2, textTransform: "uppercase",
  },
  navGrid: { gap: Spacing.three, marginBottom: Spacing.five },
  navCard: {
    backgroundColor: Colors.light.card, borderRadius: BorderRadius["3xl"],
    borderWidth: 1, borderColor: Colors.light.border, padding: Spacing.five,
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
  },
  navLabel: { fontSize: FontSize.base, fontWeight: "700", color: Colors.light.textHeading },
  navArrow: { fontSize: FontSize.lg, color: Colors.light.accent, fontWeight: "700" },
  section: {
    backgroundColor: Colors.light.card, borderRadius: BorderRadius["2xl"],
    borderWidth: 1, borderColor: Colors.light.border, padding: Spacing.five,
  },
  sectionTitle: {
    fontSize: FontSize.base, fontWeight: "700", color: Colors.light.textHeading, marginBottom: Spacing.four,
  },
  orderRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: Spacing.three, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.light.border,
  },
  orderId: { fontSize: FontSize.sm, fontWeight: "700", color: Colors.light.textHeading, fontFamily: "monospace" },
  orderCustomer: { fontSize: FontSize.xs, color: Colors.light.textSecondary, marginTop: 1 },
  orderAmount: { fontSize: FontSize.sm, fontWeight: "700", color: Colors.light.primary },
  orderStatus: { paddingHorizontal: Spacing.two, paddingVertical: 1, borderRadius: BorderRadius.full, marginTop: 2 },
  orderStatusText: { fontSize: FontSize.xs, fontWeight: "600", letterSpacing: 1 },
  errorText: {
    fontSize: FontSize.base,
    color: Colors.light.danger,
    textAlign: "center",
    marginTop: 100,
  },
})
