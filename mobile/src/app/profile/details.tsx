import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native"
import { useRouter } from "expo-router"
import { useAuth } from "../../store/AuthContext"
import { getProfile, updateProfile } from "../../services/auth"
import { Colors, Spacing, FontSize, BorderRadius } from "../../constants/theme"

export default function ProfileDetailsScreen() {
  const { user, updateUser } = useAuth()
  const [name, setName] = useState(user?.name || "")
  const [phone, setPhone] = useState(user?.phone || "")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getProfile()
        setName(res.data.name)
        setPhone(res.data.phone || "")
      } catch {
        // use existing user data
      } finally {
        setFetching(false)
      }
    }
    fetch()
  }, [])

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name is required")
      return
    }
    setLoading(true)
    setError("")
    setSuccess("")
    try {
      const res = await updateProfile({ name: name.trim(), phone: phone.trim() })
      updateUser(res.data)
      setSuccess("Profile updated successfully")
      setTimeout(() => setSuccess(""), 3000)
    } catch (e: any) {
      setError(e.message || "Failed to update")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.light.primary} style={{ marginTop: 100 }} />
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>My Details</Text>

      {success ? (
        <View style={styles.successBanner}>
          <Text style={styles.successText}>{success}</Text>
        </View>
      ) : null}
      {error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor={Colors.light.textSecondary}
          value={name}
          onChangeText={(t) => { setName(t); setError("") }}
        />
        <TextInput
          style={[styles.input, styles.inputDisabled]}
          placeholder="Email"
          placeholderTextColor={Colors.light.textSecondary}
          value={user?.email || ""}
          editable={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone (optional)"
          placeholderTextColor={Colors.light.textSecondary}
          value={phone}
          onChangeText={(t) => { setPhone(t); setError("") }}
          keyboardType="phone-pad"
        />

        <TouchableOpacity
          style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  content: { padding: Spacing.four },
  heading: { fontSize: FontSize["2xl"], fontWeight: "800", color: Colors.light.textHeading, marginBottom: Spacing.five },
  successBanner: {
    backgroundColor: "#ECFDF5",
    borderRadius: BorderRadius["2xl"],
    padding: Spacing.three,
    marginBottom: Spacing.four,
  },
  successText: { color: Colors.light.success, fontSize: FontSize.sm, textAlign: "center", fontWeight: "600" },
  errorBanner: {
    backgroundColor: "#FEF2F2",
    borderRadius: BorderRadius["2xl"],
    padding: Spacing.three,
    marginBottom: Spacing.four,
  },
  errorText: { color: Colors.light.danger, fontSize: FontSize.sm, textAlign: "center", fontWeight: "600" },
  form: { gap: Spacing.four },
  input: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius["2xl"],
    padding: Spacing.four,
    fontSize: FontSize.base,
    color: Colors.light.textHeading,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  inputDisabled: { opacity: 0.6 },
  saveBtn: {
    backgroundColor: Colors.light.accent,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.four,
    alignItems: "center",
    marginTop: Spacing.two,
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { color: Colors.light.primary, fontSize: FontSize.base, fontWeight: "700" },
})
