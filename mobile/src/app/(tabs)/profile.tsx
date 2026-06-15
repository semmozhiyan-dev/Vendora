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
        ? [
            { label: "Admin Dashboard", icon: "📊", route: "/admin/dashboard" as string },
            { label: "Manage Products", icon: "📦", route: "/admin/products" as string },
            { label: "Manage Orders", icon: "📋", route: "/admin/orders" as string },
            { label: "Manage Users", icon: "👥", route: "/admin/users" as string },
          ]
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
      <View style={styles.headerRow}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>V</Text>
        </View>
        <View>
          <Text style={styles.heading}>Profile</Text>
          <Text style={styles.subheading}>Manage your account</Text>
        </View>
      </View>

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
          activeOpacity={0.9}
        >
          <Text style={styles.recentLabel}>LATEST ORDER</Text>
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
              activeOpacity={0.7}
            >
              <View style={styles.menuIconWrap}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
              </View>
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  logoBox: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 20,
    fontWeight: "900",
    color: Colors.light.accent,
  },
  heading: {
    fontSize: FontSize["2xl"],
    fontWeight: "800",
    color: Colors.light.textHeading,
  },
  subheading: {
    fontSize: FontSize.xs,
    color: Colors.light.textSecondary,
    marginTop: 1,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Spacing.four,
    marginBottom: Spacing.five,
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius["3xl"],
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: Spacing.five,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: FontSize["2xl"],
    fontWeight: "800",
    color: Colors.light.accent,
  },
  profileInfo: { marginLeft: Spacing.four, flex: 1 },
  profileName: { fontSize: FontSize.lg, fontWeight: "700", color: Colors.light.textHeading },
  profileEmail: { fontSize: FontSize.sm, color: Colors.light.textSecondary, marginTop: 2 },
  adminBadge: {
    alignSelf: "flex-start",
    backgroundColor: Colors.light.accentLight,
    paddingHorizontal: Spacing.three,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.two,
  },
  adminBadgeText: { fontSize: FontSize.xs, fontWeight: "700", color: Colors.light.accent, letterSpacing: 0.5 },
  recentCard: {
    marginHorizontal: Spacing.four,
    marginBottom: Spacing.five,
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius["2xl"],
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: Spacing.four,
  },
  recentLabel: { fontSize: 10, fontWeight: "700", color: Colors.light.accent, letterSpacing: 2, marginBottom: Spacing.two },
  recentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recentAmount: { fontSize: FontSize.base, fontWeight: "900", color: Colors.light.primary },
  miniBadge: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  miniBadgeText: { fontSize: FontSize.xs, fontWeight: "700" },
  section: {
    marginHorizontal: Spacing.four,
    marginBottom: Spacing.four,
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius["2xl"],
    borderWidth: 1,
    borderColor: Colors.light.border,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.four,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.light.border,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.backgroundElement,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.three,
  },
  menuIcon: { fontSize: 18 },
  menuLabel: { flex: 1, fontSize: FontSize.base, fontWeight: "500", color: Colors.light.textHeading },
  dangerText: { color: Colors.light.danger },
  chevron: { fontSize: 24, color: Colors.light.textSecondary, fontWeight: "300" },
})
