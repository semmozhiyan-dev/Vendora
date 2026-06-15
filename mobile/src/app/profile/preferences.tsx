import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  Switch,
  StyleSheet,
  ActivityIndicator,
} from "react-native"
import { useAuth } from "../../store/AuthContext"
import { getProfile, updatePreferences } from "../../services/auth"
import { Colors, Spacing, FontSize, BorderRadius } from "../../constants/theme"

export default function PreferencesScreen() {
  const { user, updateUser } = useAuth()
  const [emailNotifs, setEmailNotifs] = useState(user?.preferences?.emailNotifications ?? true)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getProfile()
        setEmailNotifs(res.data.preferences?.emailNotifications ?? true)
      } catch {
        // use default
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const handleToggle = async (value: boolean) => {
    setSaving(true)
    setEmailNotifs(value)
    try {
      await updatePreferences(value)
    } catch {
      setEmailNotifs(!value)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.light.primary} style={{ marginTop: 100 }} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Preferences</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowInfo}>
            <Text style={styles.rowLabel}>Email Notifications</Text>
            <Text style={styles.rowDesc}>
              Receive order updates and promotions via email
            </Text>
          </View>
          <Switch
            value={emailNotifs}
            onValueChange={handleToggle}
            disabled={saving}
            trackColor={{ true: Colors.light.primary, false: Colors.light.border }}
          />
        </View>
        {emailNotifs && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>On</Text>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  heading: {
    fontSize: FontSize["2xl"],
    fontWeight: "800",
    color: Colors.light.textHeading,
    padding: Spacing.four,
    paddingBottom: Spacing.five,
  },
  card: {
    marginHorizontal: Spacing.four,
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius["3xl"],
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: Spacing.five,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowInfo: { flex: 1, marginRight: Spacing.four },
  rowLabel: { fontSize: FontSize.base, fontWeight: "600", color: Colors.light.textHeading },
  rowDesc: { fontSize: FontSize.xs, color: Colors.light.textSecondary, marginTop: 2 },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: Colors.light.accent,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.half,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.three,
  },
  badgeText: { fontSize: FontSize.xs, fontWeight: "700", color: Colors.light.primary, letterSpacing: 0.5 },
})
