import React, { useEffect, useState, useCallback } from "react"
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator,
  RefreshControl, Alert,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { Colors, Spacing, FontSize, BorderRadius } from "../../constants/theme"
import { useAuth } from "../../store/AuthContext"
import { getAdminUsers, updateUserRole, deleteUser } from "../../services/admin"
import { User } from "../../types"
import { formatDate } from "../../utils/format"

export default function AdminUsersScreen() {
  const { isAdmin, user: currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [updating, setUpdating] = useState<string | null>(null)
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const fetch = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true); else setLoading(true)
      const res = await getAdminUsers(1, 100)
      setUsers(res.data)
    } catch { } finally {
      setLoading(false); setRefreshing(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin"
    setUpdating(userId)
    try {
      await updateUserRole(userId, newRole)
      fetch()
    } catch (e: any) {
      Alert.alert("Error", e.message)
    } finally { setUpdating(null) }
  }

  const handleDelete = (u: User) => {
    Alert.alert("Delete User", `Delete user "${u.name}"? This cannot be undone.`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
        try { await deleteUser(u._id); fetch() }
        catch (e: any) { Alert.alert("Error", e.message) }
      }},
    ])
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
        <Text style={styles.heading}>Users</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetch(true)} />}
      >
        {users.length === 0 ? (
          <Text style={styles.emptyText}>No users found</Text>
        ) : users.map((u) => {
          const isSelf = currentUser?._id === u._id
          return (
            <View key={u._id} style={styles.userCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{u.name.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.userInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.userName} numberOfLines={1}>{u.name}</Text>
                  {isSelf && (
                    <View style={styles.youBadge}>
                      <Text style={styles.youText}>You</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.userEmail}>{u.email}</Text>
                <Text style={styles.userDate}>Joined {formatDate(u.createdAt)}</Text>
              </View>
              <View style={styles.userActions}>
                <TouchableOpacity
                  style={[styles.roleBtn, u.role === "admin" && styles.roleBtnAdmin]}
                  onPress={() => !isSelf && handleRoleToggle(u._id, u.role)}
                  disabled={isSelf || updating === u._id}
                >
                  {updating === u._id ? (
                    <ActivityIndicator size="small" color={Colors.light.primary} />
                  ) : (
                    <Text style={[styles.roleText, u.role === "admin" && styles.roleTextAdmin]}>
                      {u.role === "admin" ? "Admin" : "User"}
                    </Text>
                  )}
                </TouchableOpacity>
                {!isSelf && (
                  <TouchableOpacity style={styles.deleteUserBtn} onPress={() => handleDelete(u)}>
                    <Text style={styles.deleteUserText}>Delete</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )
        })}
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
  userCard: {
    flexDirection: "row", backgroundColor: Colors.light.card, borderRadius: BorderRadius["2xl"],
    borderWidth: 1, borderColor: Colors.light.border, padding: Spacing.four, marginBottom: Spacing.three,
    alignItems: "center",
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.light.accentLight,
    justifyContent: "center", alignItems: "center",
  },
  avatarText: { fontSize: FontSize.lg, fontWeight: "700", color: Colors.light.accent },
  userInfo: { flex: 1, marginLeft: Spacing.three },
  nameRow: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  userName: { fontSize: FontSize.sm, fontWeight: "600", color: Colors.light.textHeading },
  youBadge: { backgroundColor: Colors.light.accentLight, borderRadius: BorderRadius.full, paddingHorizontal: Spacing.two, paddingVertical: 1 },
  youText: { fontSize: FontSize.xs, fontWeight: "600", color: Colors.light.accent },
  userEmail: { fontSize: FontSize.xs, color: Colors.light.textSecondary, marginTop: 1 },
  userDate: { fontSize: FontSize.xs, color: Colors.light.textSecondary, marginTop: 1 },
  userActions: { gap: Spacing.two },
  roleBtn: { borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.light.border, paddingHorizontal: Spacing.three, paddingVertical: Spacing.one },
  roleBtnAdmin: { backgroundColor: Colors.light.accentLight, borderColor: Colors.light.accent },
  roleText: { fontSize: FontSize.xs, fontWeight: "600", color: Colors.light.textSecondary },
  roleTextAdmin: { color: Colors.light.accent },
  deleteUserBtn: { borderRadius: BorderRadius.full, paddingHorizontal: Spacing.three, paddingVertical: Spacing.one, backgroundColor: "#FEE2E2", alignItems: "center" },
  deleteUserText: { fontSize: FontSize.xs, fontWeight: "600", color: "#DC2626" },
  errorText: { fontSize: FontSize.base, color: Colors.light.danger, textAlign: "center", marginTop: 100 },
})
