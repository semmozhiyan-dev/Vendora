import React, { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native"
import { useRouter } from "expo-router"
import { useAuth } from "../../store/AuthContext"
import { registerUser } from "../../services/auth"
import { Colors, Spacing, FontSize, BorderRadius } from "../../constants/theme"

export default function RegisterScreen() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Please fill in all fields")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await registerUser(name.trim(), email.trim(), password)
      await login(res.token, res.user)
      router.replace("/(tabs)")
    } catch (e: any) {
      setError(e.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>V</Text>
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Vendora today - it's free!</Text>
        </View>

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
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={Colors.light.textSecondary}
            value={email}
            onChangeText={(t) => { setEmail(t); setError("") }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Password"
              placeholderTextColor={Colors.light.textSecondary}
              value={password}
              onChangeText={(t) => { setPassword(t); setError("") }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.eyeIcon}>{showPassword ? "🙈" : "👁️"}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Confirm Password"
              placeholderTextColor={Colors.light.textSecondary}
              value={confirmPassword}
              onChangeText={(t) => { setConfirmPassword(t); setError("") }}
              secureTextEntry={!showConfirm}
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowConfirm(!showConfirm)}>
              <Text style={styles.eyeIcon}>{showConfirm ? "🙈" : "👁️"}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitBtnText}>Create Account</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Text style={styles.footerLink}>Sign in here</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  content: { flexGrow: 1, justifyContent: "center", padding: Spacing.five },
  header: { alignItems: "center", marginBottom: Spacing.six },
  logoBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.four,
  },
  logoText: { fontSize: 32, fontWeight: "800", color: "#fff" },
  title: { fontSize: FontSize["2xl"], fontWeight: "700", color: Colors.light.text, marginBottom: Spacing.one },
  subtitle: { fontSize: FontSize.sm, color: Colors.light.textSecondary },
  errorBanner: {
    backgroundColor: "#FEF2F2",
    borderRadius: BorderRadius.md,
    padding: Spacing.three,
    marginBottom: Spacing.four,
  },
  errorText: { color: Colors.light.danger, fontSize: FontSize.sm, textAlign: "center" },
  form: { gap: Spacing.three },
  input: {
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: BorderRadius.md,
    padding: Spacing.four,
    fontSize: FontSize.base,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  passwordRow: { position: "relative" },
  passwordInput: { paddingRight: 50 },
  eyeBtn: { position: "absolute", right: 12, top: 14 },
  eyeIcon: { fontSize: 20 },
  submitBtn: {
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.four,
    alignItems: "center",
    marginTop: Spacing.two,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: "#fff", fontSize: FontSize.base, fontWeight: "600" },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Spacing.six,
  },
  footerText: { fontSize: FontSize.sm, color: Colors.light.textSecondary },
  footerLink: { fontSize: FontSize.sm, color: Colors.light.primary, fontWeight: "600" },
})
