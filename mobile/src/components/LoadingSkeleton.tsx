import React from "react"
import { View, StyleSheet } from "react-native"
import { Colors, Spacing, BorderRadius } from "../constants/theme"

export function CardSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.imageBlock} />
      <View style={styles.info}>
        <View style={styles.lineWide} />
        <View style={styles.lineShort} />
      </View>
    </View>
  )
}

export function ProductDetailSkeleton() {
  return (
    <View style={styles.detailContainer}>
      <View style={styles.imageBlock} />
      <View style={styles.detailInfo}>
        <View style={styles.lineThin} />
        <View style={[styles.lineWide, { height: 28 }]} />
        <View style={[styles.lineShort, { width: 120 }]} />
        <View style={styles.lineFull} />
        <View style={styles.lineFull} />
        <View style={[styles.lineFull, { width: "60%" }]} />
        <View style={[styles.lineShort, { width: 100, marginTop: Spacing.four }]} />
      </View>
    </View>
  )
}

export function OrderCardSkeleton() {
  return (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={[styles.lineShort, { width: 140 }]} />
        <View style={[styles.lineShort, { width: 80 }]} />
      </View>
      <View style={styles.lineWide} />
      <View style={styles.lineShort} />
    </View>
  )
}

const pulse = { opacity: 0.3 }

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius["2xl"],
    borderWidth: 1,
    borderColor: Colors.light.border,
    overflow: "hidden",
  },
  imageBlock: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: Colors.light.backgroundElement,
  },
  info: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  lineWide: {
    height: 14,
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: 4,
    width: "80%",
    ...pulse,
  },
  lineShort: {
    height: 14,
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: 4,
    width: "50%",
    ...pulse,
  },
  lineThin: {
    height: 10,
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: 4,
    width: "30%",
    ...pulse,
  },
  lineFull: {
    height: 14,
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: 4,
    width: "100%",
    marginTop: 6,
    ...pulse,
  },
  detailContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  detailInfo: {
    padding: Spacing.four,
    gap: Spacing.two,
  },
  orderCard: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius["2xl"],
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: Spacing.four,
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
})
