import React, { useEffect, useState } from "react"
import {
  View, Text, ScrollView, StyleSheet, RefreshControl, TouchableOpacity, Platform,
} from "react-native"
import { Image } from "expo-image"
import { useRouter } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import Svg, { Path } from "react-native-svg"
import { getProducts } from "../../services/products"
import { Product } from "../../types"
import ProductCard from "../../components/ProductCard"
import { CardSkeleton } from "../../components/LoadingSkeleton"
import ErrorState from "../../components/ErrorState"
import { Colors, Spacing, FontSize, BorderRadius } from "../../constants/theme"

const categories = ["New Season", "Premium Picks", "Best Sellers", "Limited Stock"]
const features = [
  { num: "01", title: "Quality Products", desc: "Every item is handpicked for premium quality and lasting durability." },
  { num: "02", title: "Fair Pricing", desc: "Luxury essentials at transparent, fair prices with no hidden costs." },
  { num: "03", title: "Fast Delivery", desc: "Free shipping on all orders with express delivery available." },
]

function SearchIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke={Colors.light.textSecondary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

function CartIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" stroke={Colors.light.primary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

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

  useEffect(() => { fetchProducts() }, [])

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingGrid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <View key={i} style={{ width: "47%" }}><CardSkeleton /></View>
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

  const featured = products.slice(0, 8)

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchProducts(true)} />}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.logoBox}><Text style={styles.logoText}>V</Text></View>
        <TouchableOpacity style={styles.cartBtn} onPress={() => router.push("/(tabs)/cart")}>
          <CartIcon />
        </TouchableOpacity>
      </View>

      {/* Hero Section */}
      <View style={styles.hero}>
        <View style={styles.heroLeft}>
          <View style={styles.heroPill}>
            <Text style={styles.heroPillText}>PREMIUM ESSENTIALS, CURATED DAILY</Text>
          </View>
          <Text style={styles.heroTitle}>
            Elevated style{'\n'}for every{' '}
            <Text style={styles.heroTitleAccent}>modern{'\n'}wardrobe</Text>
          </Text>
          <Text style={styles.heroSub}>
            Discover refined products selected for quality, clarity, and everyday luxury.
          </Text>
          <View style={styles.heroBtns}>
            <TouchableOpacity style={styles.heroBtnPrimary} activeOpacity={0.9}>
              <Text style={styles.heroBtnPrimaryText}>Shop Collection</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.heroBtnSecondary} activeOpacity={0.9}>
              <Text style={styles.heroBtnSecondaryText}>Explore New Arrivals</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.heroPills}>
            {categories.map((c) => (
              <View key={c} style={styles.categoryTag}>
                <Text style={styles.categoryTagText}>{c}</Text>
              </View>
            ))}
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>250+</Text>
              <Text style={styles.statLabel}>Premium products</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4.9/5</Text>
              <Text style={styles.statLabel}>Customer rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>24h</Text>
              <Text style={styles.statLabel}>Fast support</Text>
            </View>
          </View>
        </View>
        <View style={styles.heroRight}>
          <View style={styles.heroImageGrid}>
            <Image source={{ uri: "/images/products/image1.jpg" }} style={styles.heroImgMain} contentFit="cover" />
            <Image source={{ uri: "/images/products/image3.jpg" }} style={styles.heroImgSm} contentFit="cover" />
            <Image source={{ uri: "/images/products/image4.jpg" }} style={styles.heroImgSm} contentFit="cover" />
            <View style={styles.heroFloatCard}>
              <Text style={styles.heroFloatText}>Curated{'\n'}edit</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Showcase Video Section */}
      <View style={styles.videoSection}>
        <View style={styles.videoRow}>
          <View style={styles.videoLeft}>
            {Platform.OS === "web" ? (
              <View style={styles.videoWrap}>
                <video
                  src="/videos/showcase.mp4"
                  autoPlay muted loop playsInline
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  preload="metadata"
                />
                <View style={styles.videoOverlay} />
                <View style={styles.videoContent}>
                  <View style={styles.videoDot} />
                  <Text style={styles.videoLabel}>SHOWCASE</Text>
                  <Text style={styles.videoTitle}>Vendora in motion</Text>
                  <Text style={styles.videoDesc}>
                    Experience the intersection of design and functionality through our carefully curated showcase.
                  </Text>
                </View>
              </View>
            ) : (
              <View style={[styles.videoWrap, { backgroundColor: Colors.light.primary, justifyContent: "center", alignItems: "center" }]}>
                <Text style={{ fontSize: 40, color: Colors.light.accent, fontWeight: "800" }}>▶</Text>
                <Text style={styles.videoFallbackText}>Showcase</Text>
              </View>
            )}
          </View>
          <View style={styles.videoRight}>
            <View style={styles.videoInfoCard}>
              <Text style={styles.videoInfoTitle}>Responsive</Text>
              <Text style={styles.videoInfoDesc}>Built for every screen</Text>
            </View>
            <View style={styles.videoInfoCard}>
              <Text style={styles.videoInfoTitle}>Performance</Text>
              <Text style={styles.videoInfoDesc}>Lightweight and seamless</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Featured Products */}
      <View style={styles.featuredSection}>
        <View style={styles.featuredHeader}>
          <View style={styles.featuredAccent} />
          <Text style={styles.featuredTitle}>Featured products</Text>
        </View>
        {featured.length === 0 ? (
          <Text style={styles.emptyText}>No products available</Text>
        ) : (
          <View style={styles.productGrid}>
            {featured.map((product) => (
              <View key={product._id} style={styles.productGridItem}>
                <ProductCard product={product} onPress={(p) => router.push(`/product/${p._id}`)} />
              </View>
            ))}
          </View>
        )}
        <TouchableOpacity style={styles.viewAllBtn} onPress={() => router.push("/(tabs)/products")} activeOpacity={0.9}>
          <Text style={styles.viewAllText}>View All Products →</Text>
        </TouchableOpacity>
      </View>

      {/* Why Choose Us */}
      <View style={styles.featuresSection}>
        {features.map((f) => (
          <View key={f.num} style={styles.featureCard}>
            <View style={styles.featureNum}>
              <Text style={styles.featureNumText}>{f.num}</Text>
            </View>
            <Text style={styles.featureTitle}>{f.title}</Text>
            <Text style={styles.featureDesc}>{f.desc}</Text>
          </View>
        ))}
      </View>

      {/* CTA Banner */}
      <View style={styles.ctaBanner}>
        <Text style={styles.ctaTitle}>Start shopping{'\n'}today</Text>
        <TouchableOpacity style={styles.ctaBtn} onPress={() => router.push("/(tabs)/products")} activeOpacity={0.9}>
          <Text style={styles.ctaBtnText}>Browse Collection</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  content: { paddingBottom: 40 },
  loadingGrid: { flexDirection: "row", flexWrap: "wrap", padding: Spacing.three, gap: Spacing.three },

  /* Header */
  headerRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: Spacing.four, paddingVertical: Spacing.three,
  },
  logoBox: { width: 40, height: 40, borderRadius: BorderRadius.lg, backgroundColor: Colors.light.primary, justifyContent: "center", alignItems: "center" },
  logoText: { fontSize: 20, fontWeight: "900", color: Colors.light.accent },
  cartBtn: { width: 40, height: 40, borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.light.border, justifyContent: "center", alignItems: "center" },

  /* Hero */
  hero: { padding: Spacing.four },
  heroLeft: {},
  heroPill: { alignSelf: "flex-start", borderWidth: 1, borderColor: Colors.light.accent, borderRadius: BorderRadius.full, paddingHorizontal: Spacing.three, paddingVertical: Spacing.one, marginBottom: Spacing.four },
  heroPillText: { fontSize: 10, fontWeight: "700", color: Colors.light.accent, letterSpacing: 2 },
  heroTitle: { fontSize: 40, fontWeight: "900", color: Colors.light.textHeading, lineHeight: 44, marginBottom: Spacing.four },
  heroTitleAccent: { color: Colors.light.accent },
  heroSub: { fontSize: FontSize.sm, color: Colors.light.text, lineHeight: 22, marginBottom: Spacing.five, maxWidth: 500 },
  heroBtns: { flexDirection: "row", gap: Spacing.three, marginBottom: Spacing.five, flexWrap: "wrap" },
  heroBtnPrimary: { backgroundColor: Colors.light.accent, borderRadius: BorderRadius.full, paddingHorizontal: Spacing.five, paddingVertical: Spacing.three },
  heroBtnPrimaryText: { color: Colors.light.primary, fontWeight: "700", fontSize: FontSize.sm },
  heroBtnSecondary: { borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.light.border, paddingHorizontal: Spacing.five, paddingVertical: Spacing.three },
  heroBtnSecondaryText: { color: Colors.light.text, fontWeight: "600", fontSize: FontSize.sm },
  heroPills: { flexDirection: "row", gap: Spacing.two, marginBottom: Spacing.five, flexWrap: "wrap" },
  categoryTag: { borderRadius: BorderRadius.full, backgroundColor: Colors.light.backgroundElement, paddingHorizontal: Spacing.three, paddingVertical: Spacing.one },
  categoryTagText: { fontSize: FontSize.xs, fontWeight: "600", color: Colors.light.textSecondary },
  statsRow: { flexDirection: "row", alignItems: "center", gap: Spacing.four, paddingVertical: Spacing.four, borderTopWidth: 1, borderTopColor: Colors.light.border },
  statItem: { alignItems: "center" },
  statValue: { fontSize: FontSize.lg, fontWeight: "900", color: Colors.light.primary },
  statLabel: { fontSize: FontSize.xs, color: Colors.light.textSecondary, marginTop: 1 },
  statDivider: { width: 1, height: 30, backgroundColor: Colors.light.border },
  heroRight: { marginTop: Spacing.five },
  heroImageGrid: {
    flexDirection: "row", flexWrap: "wrap", gap: Spacing.two,
    borderRadius: BorderRadius["3xl"], overflow: "hidden",
  },
  heroImgMain: { width: "58%", aspectRatio: 3 / 4, borderRadius: BorderRadius["2xl"] },
  heroImgSm: { width: "38%", aspectRatio: 1, borderRadius: BorderRadius["2xl"] },
  heroFloatCard: {
    position: "absolute", bottom: -10, left: Spacing.four,
    backgroundColor: Colors.light.card, borderRadius: BorderRadius["2xl"],
    padding: Spacing.four, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 16, elevation: 8,
  },
  heroFloatText: { fontSize: FontSize.sm, fontWeight: "800", color: Colors.light.textHeading, textAlign: "center", lineHeight: 20 },

  /* Video Section */
  videoSection: { backgroundColor: Colors.light.primary, padding: Spacing.four, marginTop: Spacing.four },
  videoRow: {},
  videoLeft: {},
  videoWrap: { height: 260, borderRadius: BorderRadius["3xl"], overflow: "hidden", position: "relative" },
  videoOverlay: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(0,0,0,0.4)" },
  videoContent: { position: "absolute", bottom: Spacing.five, left: Spacing.five, right: Spacing.five },
  videoDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.light.accent, marginBottom: Spacing.two },
  videoLabel: { fontSize: FontSize.xs, fontWeight: "700", color: Colors.light.accent, letterSpacing: 3, marginBottom: Spacing.one },
  videoTitle: { fontSize: FontSize["2xl"], fontWeight: "800", color: "#fff", marginBottom: Spacing.two },
  videoDesc: { fontSize: FontSize.sm, color: "rgba(255,255,255,0.7)", lineHeight: 20 },
  videoFallbackText: { fontSize: FontSize.base, fontWeight: "700", color: Colors.light.accent, marginTop: Spacing.two },
  videoRight: { marginTop: Spacing.three, gap: Spacing.three },
  videoInfoCard: { backgroundColor: "rgba(255,255,255,0.05)", borderRadius: BorderRadius["2xl"], padding: Spacing.four, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  videoInfoTitle: { fontSize: FontSize.base, fontWeight: "700", color: "#fff" },
  videoInfoDesc: { fontSize: FontSize.sm, color: "rgba(255,255,255,0.6)", marginTop: Spacing.one },

  /* Featured */
  featuredSection: { padding: Spacing.four, paddingTop: Spacing.six },
  featuredHeader: { flexDirection: "row", alignItems: "center", gap: Spacing.three, marginBottom: Spacing.five },
  featuredAccent: { width: 4, height: 24, backgroundColor: Colors.light.accent, borderRadius: 2 },
  featuredTitle: { fontSize: FontSize["2xl"], fontWeight: "800", color: Colors.light.textHeading },
  emptyText: { fontSize: FontSize.base, color: Colors.light.textSecondary, textAlign: "center", paddingVertical: Spacing.six },
  productGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.three },
  productGridItem: { width: "47%" },
  viewAllBtn: { alignSelf: "center", marginTop: Spacing.five, paddingHorizontal: Spacing.six, paddingVertical: Spacing.three, borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.light.border },
  viewAllText: { fontSize: FontSize.base, fontWeight: "600", color: Colors.light.textHeading },

  /* Features */
  featuresSection: { padding: Spacing.four, gap: Spacing.three },
  featureCard: {
    backgroundColor: Colors.light.card, borderRadius: BorderRadius["3xl"],
    borderWidth: 1, borderColor: Colors.light.border, padding: Spacing.five,
  },
  featureNum: { width: 44, height: 44, borderRadius: BorderRadius.full, backgroundColor: Colors.light.primary, justifyContent: "center", alignItems: "center", marginBottom: Spacing.three },
  featureNumText: { fontSize: FontSize.base, fontWeight: "800", color: Colors.light.accent },
  featureTitle: { fontSize: FontSize.base, fontWeight: "700", color: Colors.light.textHeading, marginBottom: Spacing.two },
  featureDesc: { fontSize: FontSize.sm, color: Colors.light.textSecondary, lineHeight: 20 },

  /* CTA */
  ctaBanner: { backgroundColor: Colors.light.primary, margin: Spacing.four, borderRadius: BorderRadius["3xl"], padding: Spacing.six, alignItems: "center" },
  ctaTitle: { fontSize: FontSize["3xl"], fontWeight: "900", color: Colors.light.card, textAlign: "center", lineHeight: 40, marginBottom: Spacing.five },
  ctaBtn: { backgroundColor: Colors.light.accent, borderRadius: BorderRadius.full, paddingHorizontal: Spacing.six, paddingVertical: Spacing.four },
  ctaBtnText: { color: Colors.light.primary, fontWeight: "700", fontSize: FontSize.base },
})
