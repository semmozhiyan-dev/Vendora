import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Colors, Spacing, FontSize, BorderRadius } from "../constants/theme"

export default function OrderSuccessScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>()
  const router = useRouter()
  const insets = useSafeAreaInsets()

  if (!orderId) {
    router.replace("/(tabs)")
    return null
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconCheck}>✓</Text>
          </View>
        </View>
        <Text style={styles.heading}>Order Placed Successfully!</Text>
        <Text style={styles.subtext}>Thank you for your purchase. Your order has been placed and is being processed.</Text>
        <View style={styles.orderIdCard}>
          <Text style={styles.orderIdLabel}>Order ID</Text>
          <Text style={styles.orderIdValue}>{orderId.slice(-8)}</Text>
        </View>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.replace("/(tabs)")}
          activeOpacity={0.9}
        >
          <Text style={styles.primaryBtnText}>Continue Shopping</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.replace("/(tabs)/orders")}
          activeOpacity={0.9}
        >
          <Text style={styles.secondaryBtnText}>View Orders</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.five,
  },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius["3xl"],
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: Spacing.six,
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  iconWrap: { marginBottom: Spacing.five },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
  },
  iconCheck: { fontSize: 36, color: "#fff", fontWeight: "800" },
  heading: {
    fontSize: FontSize["2xl"],
    fontWeight: "800",
    color: Colors.light.textHeading,
    textAlign: "center",
    marginBottom: Spacing.three,
  },
  subtext: {
    fontSize: FontSize.sm,
    color: Colors.light.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: Spacing.five,
  },
  orderIdCard: {
    backgroundColor: Colors.light.background,
    borderRadius: BorderRadius["2xl"],
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.five,
    marginBottom: Spacing.six,
    alignItems: "center",
    width: "100%",
  },
  orderIdLabel: {
    fontSize: FontSize.xs,
    color: Colors.light.textSecondary,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: Spacing.one,
  },
  orderIdValue: {
    fontSize: FontSize.base,
    fontWeight: "700",
    color: Colors.light.primary,
    fontFamily: "monospace",
  },
  primaryBtn: {
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.four,
    alignItems: "center",
    width: "100%",
    marginBottom: Spacing.three,
  },
  primaryBtnText: { color: "#fff", fontSize: FontSize.base, fontWeight: "700" },
  secondaryBtn: {
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingVertical: Spacing.four,
    alignItems: "center",
    width: "100%",
  },
  secondaryBtnText: { color: Colors.light.text, fontSize: FontSize.base, fontWeight: "600" },
})
