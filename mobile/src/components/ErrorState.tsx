import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Colors, Spacing, FontSize, BorderRadius } from "../constants/theme"

interface Props {
  message: string
  onRetry?: () => void
}

export default function ErrorState({ message, onRetry }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.button} onPress={onRetry} activeOpacity={0.7}>
          <Text style={styles.buttonText}>Retry</Text>
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
    fontSize: 48,
    marginBottom: Spacing.four,
  },
  message: {
    fontSize: FontSize.base,
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
