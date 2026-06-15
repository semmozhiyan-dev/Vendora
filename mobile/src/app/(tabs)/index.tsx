import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native"
import { useRouter } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { getProducts } from "../../services/products"
import { Product } from "../../types"
import ProductCard from "../../components/ProductCard"
import { CardSkeleton } from "../../components/LoadingSkeleton"
import ErrorState from "../../components/ErrorState"
import EmptyState from "../../components/EmptyState"
import { Colors, Spacing, FontSize } from "../../constants/theme"

const numColumns = 2

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const fetchProducts = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true)
      else setLoading(true)
      setError(null)
      const res = await getProducts(1, 50)
      setProducts(res.items || [])
    } catch (e: any) {
      setError(e.message || "Failed to load products")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.heading}>Vendora</Text>
        <View style={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={i} style={styles.gridItem}>
              <CardSkeleton />
            </View>
          ))}
        </View>
      </View>
    )
  }

  if (error && products.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.heading}>Vendora</Text>
        <ErrorState message={error} onRetry={() => fetchProducts()} />
      </View>
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.heading}>Vendora</Text>
      {products.length === 0 ? (
        <EmptyState icon="🛍️" title="No products yet" subtitle="Check back later for new arrivals" />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          numColumns={numColumns}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <View style={styles.gridItem}>
              <ProductCard product={item} onPress={(p) => router.push(`/product/${p._id}`)} />
            </View>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchProducts(true)} />
          }
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  heading: {
    fontSize: FontSize["2xl"],
    fontWeight: "700",
    color: Colors.light.text,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  list: {
    padding: Spacing.three,
  },
  row: {
    gap: Spacing.three,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: Spacing.three,
    gap: Spacing.three,
  },
  gridItem: {
    flex: 1,
    minWidth: "45%",
  },
})
