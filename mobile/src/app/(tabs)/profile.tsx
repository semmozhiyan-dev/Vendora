import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native"
import { useRouter } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useAuth } from "../../store/AuthContext"
import { getMyOrders } from "../../services/orders"
import { Order } from "../../types"
import { formatPrice, statusLabel, statusColor } from "../../utils/format"
import { Colors, Spacing, FontSize, BorderRadius } from "../../constants/theme"

interface MenuItem {
  label: string
  icon: string
  route?: string
  danger?: boolean
  action?: () => void
}

export default function ProfileScreen() {
  const { user, logout, isAdmin } = useAuth()
  const [recentOrder, setRecentOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const insets = useSafeAreaInsets()

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getMyOrders(1, 1)
        if (res.items?.length > 0) setRecentOrder(res.items[0])
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const menuSections: MenuItem[][] = [
    [
      { label: "My Details", icon: "👤", route: "/profile/details" },
      { label: "Address Book", icon: "📍", route: "/profile/addresses" },
      { label: "Change Password", icon: "🔒", route: "/profile/password" },
      { label: "Preferences", icon: "⚙️", route: "/profile/preferences" },
    ],
    [
      { label: "My Orders", icon: "📋", route: "/(tabs)/orders" },
    ],
    [
      ...(isAdmin
        ? [{ label: "Admin Dashboard", icon: "🛠️", route: "/admin/dashboard" as string }]
        : []),
    ],
    [
      {
        label: "Logout",
        icon: "🚪",
        danger: true,
        action: () => {
          logout()
          router.replace("/(auth)/login")
        },
      },
    ],
  ]

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Profile</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.name || "User"}</Text>
          <Text style={styles.profileEmail}>{user?.email || ""}</Text>
          {isAdmin && (
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>Admin</Text>
            </View>
          )}
        </View>
      </View>

      {recentOrder && (
        <TouchableOpacity
          style={styles.recentCard}
          onPress={() => router.push(`/order/${recentOrder._id}`)}
          activeOpacity={0.7}
        >
          <Text style={styles.recentLabel}>Latest Order</Text>
          <View style={styles.recentRow}>
            <Text style={styles.recentAmount}>{formatPrice(recentOrder.totalAmount)}</Text>
            <View style={[styles.miniBadge, { backgroundColor: statusColor(recentOrder.status) + "20" }]}>
              <Text style={[styles.miniBadgeText, { color: statusColor(recentOrder.status) }]}>
                {statusLabel(recentOrder.status)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}

      {menuSections.map((section, si) => (
        <View key={si} style={styles.section}>
          {section.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.menuItem}
              onPress={() => {
                if (item.action) item.action()
                else if (item.route) router.push(item.route)
              }}
              activeOpacity={0.6}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={[styles.menuLabel, item.danger && styles.dangerText]}>
                {item.label}
              </Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  content: { paddingBottom: 40 },
  heading: {
    fontSize: FontSize["2xl"],
    fontWeight: "700",
    color: Colors.light.text,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Spacing.four,
    marginBottom: Spacing.five,
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.four,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: FontSize["2xl"],
    fontWeight: "700",
    color: "#fff",
  },
  profileInfo: { marginLeft: Spacing.four, flex: 1 },
  profileName: { fontSize: FontSize.lg, fontWeight: "600", color: Colors.light.text },
  profileEmail: { fontSize: FontSize.sm, color: Colors.light.textSecondary, marginTop: 2 },
  adminBadge: {
    alignSelf: "flex-start",
    backgroundColor: Colors.light.primaryLight,
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.one,
  },
  adminBadgeText: { fontSize: FontSize.xs, fontWeight: "600", color: Colors.light.primary },
  recentCard: {
    marginHorizontal: Spacing.four,
    marginBottom: Spacing.five,
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: BorderRadius.lg,
    padding: Spacing.four,
  },
  recentLabel: { fontSize: FontSize.xs, color: Colors.light.textSecondary, marginBottom: Spacing.one },
  recentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recentAmount: { fontSize: FontSize.base, fontWeight: "700", color: Colors.light.text },
  miniBadge: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  miniBadgeText: { fontSize: FontSize.xs, fontWeight: "600" },
  section: {
    marginHorizontal: Spacing.four,
    marginBottom: Spacing.five,
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.light.border,
  },
  menuIcon: { fontSize: 20, marginRight: Spacing.three },
  menuLabel: { flex: 1, fontSize: FontSize.base, color: Colors.light.text },
  dangerText: { color: Colors.light.danger },
  chevron: { fontSize: 22, color: Colors.light.textSecondary },
})
