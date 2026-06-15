import React, { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native"
import { changePassword } from "../../services/auth"
import { Colors, Spacing, FontSize, BorderRadius } from "../../constants/theme"

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const handleChange = async () => {
    if (!currentPassword || !newPassword) {
      setError("Please fill in all fields")
      return
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters")
      return
    }
    setLoading(true)
    setError("")
    setSuccess("")
    try {
      await changePassword(currentPassword, newPassword)
      setSuccess("Password changed successfully")
      setCurrentPassword("")
      setNewPassword("")
      setTimeout(() => setSuccess(""), 3000)
    } catch (e: any) {
      setError(e.message || "Failed to change password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Change Password</Text>

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
          placeholder="Current Password"
          placeholderTextColor={Colors.light.textSecondary}
          value={currentPassword}
          onChangeText={(t) => { setCurrentPassword(t); setError("") }}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          placeholderTextColor={Colors.light.textSecondary}
          value={newPassword}
          onChangeText={(t) => { setNewPassword(t); setError("") }}
          secureTextEntry
        />

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>• Min 6 characters</Text>
          <Text style={styles.infoText}>• Should differ from current password</Text>
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
          onPress={handleChange}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>Update Password</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  content: { padding: Spacing.four },
  heading: { fontSize: FontSize["2xl"], fontWeight: "700", color: Colors.light.text, marginBottom: Spacing.five },
  successBanner: {
    backgroundColor: "#ECFDF5",
    borderRadius: BorderRadius.md,
    padding: Spacing.three,
    marginBottom: Spacing.four,
  },
  successText: { color: Colors.light.success, fontSize: FontSize.sm, textAlign: "center" },
  errorBanner: {
    backgroundColor: "#FEF2F2",
    borderRadius: BorderRadius.md,
    padding: Spacing.three,
    marginBottom: Spacing.four,
  },
  errorText: { color: Colors.light.danger, fontSize: FontSize.sm, textAlign: "center" },
  form: { gap: Spacing.four },
  input: {
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: BorderRadius.md,
    padding: Spacing.four,
    fontSize: FontSize.base,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  infoBox: {
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: BorderRadius.md,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  infoText: { fontSize: FontSize.xs, color: Colors.light.textSecondary },
  saveBtn: {
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.four,
    alignItems: "center",
    marginTop: Spacing.two,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: "#fff", fontSize: FontSize.base, fontWeight: "600" },
})
