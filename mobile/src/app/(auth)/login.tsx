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
import { loginUser } from "../../services/auth"
import { Colors, Spacing, FontSize, BorderRadius } from "../../constants/theme"

export default function LoginScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields")
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await loginUser(email.trim(), password)
      await login(res.token, res.user)
      router.replace("/(tabs)")
    } catch (e: any) {
      setError(e.message || "Login failed. Please try again.")
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
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your Vendora account</Text>
        </View>

        {error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={Colors.light.textSecondary}
            value={email}
            onChangeText={(t) => { setEmail(t); setError("") }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
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
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eyeIcon}>{showPassword ? "🙈" : "👁️"}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitBtnText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
            <Text style={styles.footerLink}>Sign up for free</Text>
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
    width: 72,
    height: 72,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.four,
  },
  logoText: { fontSize: 36, fontWeight: "900", color: Colors.light.accent },
  title: { fontSize: FontSize["2xl"], fontWeight: "800", color: Colors.light.textHeading, marginBottom: Spacing.one },
  subtitle: { fontSize: FontSize.sm, color: Colors.light.textSecondary },
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
  passwordRow: { position: "relative" },
  passwordInput: { paddingRight: 50 },
  eyeBtn: { position: "absolute", right: 12, top: 14 },
  eyeIcon: { fontSize: 20 },
  submitBtn: {
    backgroundColor: Colors.light.accent,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.four,
    alignItems: "center",
    marginTop: Spacing.two,
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { color: Colors.light.primary, fontSize: FontSize.base, fontWeight: "700" },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Spacing.six,
  },
  footerText: { fontSize: FontSize.sm, color: Colors.light.textSecondary },
  footerLink: { fontSize: FontSize.sm, color: Colors.light.accent, fontWeight: "700" },
})
