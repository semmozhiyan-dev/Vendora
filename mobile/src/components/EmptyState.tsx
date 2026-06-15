import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Colors, Spacing, FontSize, BorderRadius } from "../constants/theme"

interface Props {
  icon?: string
  title: string
  subtitle?: string
  actionLabel?: string
  onAction?: () => void
}

export default function EmptyState({ icon = "📦", title, subtitle, actionLabel, onAction }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {actionLabel && onAction && (
        <TouchableOpacity style={styles.button} onPress={onAction} activeOpacity={0.7}>
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.six,
  },
  icon: {
    fontSize: 60,
    marginBottom: Spacing.four,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: Spacing.two,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.light.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.five,
  },
  button: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.three,
    borderRadius: BorderRadius.md,
  },
  buttonText: {
    color: "#fff",
    fontSize: FontSize.base,
    fontWeight: "600",
  },
})
