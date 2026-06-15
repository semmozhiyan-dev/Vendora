import React, { useEffect, useState, useCallback } from "react"
import {
  View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity, ActivityIndicator,
} from "react-native"
import { useRouter } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import Svg, { Path } from "react-native-svg"
import { getProducts } from "../../services/products"
import { Product } from "../../types"
import ProductCard from "../../components/ProductCard"
import { CardSkeleton } from "../../components/LoadingSkeleton"
import ErrorState from "../../components/ErrorState"
import EmptyState from "../../components/EmptyState"
import { Colors, Spacing, FontSize, BorderRadius } from "../../constants/theme"

function SearchIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke={Colors.light.textSecondary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const fetchProducts = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true)
      else setLoading(true)
      setError(null)
      const res = await getProducts(1, 100)
      setProducts(res.items || [])
    } catch (e: any) {
      setError(e.message || "Failed to load products")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.grid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <View key={i} style={styles.gridItem}><CardSkeleton /></View>
          ))}
        </View>
      </View>
    )
  }

  if (error && products.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ErrorState message={error} onRetry={() => fetchProducts()} />
      </View>
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={
          <View style={styles.headerCard}>
            <TouchableOpacity style={styles.searchBar} activeOpacity={0.7}>
              <SearchIcon />
              <Text style={styles.searchPlaceholder}>Search products...</Text>
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text style={styles.headerLabel}>COLLECTION</Text>
              <Text style={styles.headerTitle}>All products</Text>
              <Text style={styles.headerDesc}>A refined catalog of essentials and statement pieces.</Text>
              <View style={styles.headerStats}>
                <View style={styles.headerStat}>
                  <Text style={styles.headerStatText}>Clean layout</Text>
                </View>
                <View style={styles.headerStat}>
                  <Text style={styles.headerStatText}>Premium finish</Text>
                </View>
                <View style={styles.headerStat}>
                  <Text style={styles.headerStatText}>Fast browsing</Text>
                </View>
              </View>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <ProductCard product={item} onPress={(p) => router.push(`/product/${p._id}`)} />
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => fetchProducts(true)} />
        }
        ListEmptyComponent={
          <EmptyState icon="🛍️" title="No products yet" subtitle="Check back later for new arrivals" />
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  list: { padding: Spacing.three },
  row: { gap: Spacing.three },
  grid: {
    flexDirection: "row", flexWrap: "wrap", padding: Spacing.three, gap: Spacing.three,
  },
  gridItem: { flex: 1, minWidth: "45%" },

  headerCard: {
    backgroundColor: Colors.light.card, borderRadius: BorderRadius["3xl"],
    borderWidth: 1, borderColor: Colors.light.border, padding: Spacing.five,
    marginBottom: Spacing.five, overflow: "hidden",
  },
  searchBar: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: Colors.light.background, borderRadius: BorderRadius.full,
    borderWidth: 1, borderColor: Colors.light.border,
    paddingHorizontal: Spacing.four, paddingVertical: 12, gap: Spacing.three, marginBottom: Spacing.four,
  },
  searchPlaceholder: { fontSize: FontSize.sm, color: Colors.light.textSecondary },
  headerContent: {},
  headerLabel: {
    fontSize: FontSize.xs, fontWeight: "700", color: Colors.light.accent,
    letterSpacing: 3, marginBottom: Spacing.one,
  },
  headerTitle: { fontSize: FontSize["3xl"], fontWeight: "900", color: Colors.light.textHeading, marginBottom: Spacing.two },
  headerDesc: { fontSize: FontSize.sm, color: Colors.light.textSecondary, lineHeight: 20, marginBottom: Spacing.four },
  headerStats: { flexDirection: "row", gap: Spacing.two, flexWrap: "wrap" },
  headerStat: { backgroundColor: Colors.light.backgroundElement, borderRadius: BorderRadius.full, paddingHorizontal: Spacing.three, paddingVertical: Spacing.one },
  headerStatText: { fontSize: FontSize.xs, fontWeight: "600", color: Colors.light.textSecondary },
})
