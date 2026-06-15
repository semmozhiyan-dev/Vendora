import React, { useEffect, useState, useCallback } from "react"
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator,
  RefreshControl, TextInput, Modal, Alert, Platform,
} from "react-native"
import { Image } from "expo-image"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { Colors, Spacing, FontSize, BorderRadius } from "../../constants/theme"
import { useAuth } from "../../store/AuthContext"
import { getAdminProducts, createAdminProduct, updateAdminProduct, deleteAdminProduct } from "../../services/admin"
import { Product } from "../../types"
import { formatPrice } from "../../utils/format"
import { getProductImageUrl } from "../../utils/images"

export default function AdminProductsScreen() {
  const { isAdmin } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: "", price: "", stock: "0", description: "", category: "", image: "" })
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const fetch = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true); else setLoading(true)
      const res = await getAdminProducts(1, 100)
      setProducts(res.data)
    } catch { } finally {
      setLoading(false); setRefreshing(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const openAdd = () => {
    setEditing(null)
    setForm({ name: "", price: "", stock: "0", description: "", category: "", image: "" })
    setShowForm(true)
  }

  const openEdit = (p: Product) => {
    setEditing(p)
    setForm({
      name: p.name, price: p.price.toString(), stock: p.stock.toString(),
      description: p.description || "", category: p.category || "", image: p.image || "",
    })
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.price.trim()) {
      Alert.alert("Error", "Name and price are required"); return
    }
    setSaving(true)
    try {
      const data = {
        name: form.name.trim(), price: parseFloat(form.price),
        stock: parseInt(form.stock) || 0, description: form.description.trim(),
        category: form.category.trim(), image: form.image.trim(),
      }
      if (editing) {
        await updateAdminProduct(editing._id, data)
      } else {
        await createAdminProduct(data)
      }
      setShowForm(false)
      fetch()
    } catch (e: any) {
      Alert.alert("Error", e.message)
    } finally { setSaving(false) }
  }

  const handleDelete = (p: Product) => {
    Alert.alert("Delete Product", `Delete "${p.name}"?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
        try { await deleteAdminProduct(p._id); fetch() }
        catch (e: any) { Alert.alert("Error", e.message) }
      }},
    ])
  }

  if (!isAdmin) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>Admin access required</Text>
      </View>
    )
  }

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={Colors.light.primary} style={{ marginTop: 100 }} />
      </View>
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/admin/dashboard")}>
          <Text style={styles.backText}>← Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Products</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetch(true)} />}
      >
        {products.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No products found</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={openAdd}>
              <Text style={styles.emptyBtnText}>Add your first product</Text>
            </TouchableOpacity>
          </View>
        ) : products.map((p) => (
          <View key={p._id} style={styles.productCard}>
            <Image
              source={{ uri: p.image || getProductImageUrl(p._id) }}
              style={styles.productImage}
              contentFit="cover"
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={1}>{p.name}</Text>
              <Text style={styles.productCategory}>{p.category?.toUpperCase() || "GENERAL"}</Text>
              <Text style={styles.productPrice}>{formatPrice(p.price)}</Text>
              <View style={[styles.stockBadge, p.stock > 10 ? styles.stockHigh : p.stock > 0 ? styles.stockLow : styles.stockOut]}>
                <Text style={styles.stockText}>{p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}</Text>
              </View>
            </View>
            <View style={styles.productActions}>
              <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(p)}>
                <Text style={styles.editBtnText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(p)}>
                <Text style={styles.deleteBtnText}>Del</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal visible={showForm} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{editing ? "Edit Product" : "Add Product"}</Text>
            <ScrollView style={styles.modalForm}>
              <TextInput style={styles.input} placeholder="Name *" placeholderTextColor={Colors.light.textSecondary}
                value={form.name} onChangeText={(t) => setForm(f => ({ ...f, name: t }))} />
              <TextInput style={styles.input} placeholder="Price *" placeholderTextColor={Colors.light.textSecondary}
                value={form.price} onChangeText={(t) => setForm(f => ({ ...f, price: t }))} keyboardType="decimal-pad" />
              <TextInput style={styles.input} placeholder="Stock" placeholderTextColor={Colors.light.textSecondary}
                value={form.stock} onChangeText={(t) => setForm(f => ({ ...f, stock: t }))} keyboardType="number-pad" />
              <TextInput style={styles.input} placeholder="Category" placeholderTextColor={Colors.light.textSecondary}
                value={form.category} onChangeText={(t) => setForm(f => ({ ...f, category: t }))} />
              <TextInput style={styles.input} placeholder="Image URL" placeholderTextColor={Colors.light.textSecondary}
                value={form.image} onChangeText={(t) => setForm(f => ({ ...f, image: t }))} />
              <TextInput style={[styles.input, styles.textArea]} placeholder="Description" placeholderTextColor={Colors.light.textSecondary}
                value={form.description} onChangeText={(t) => setForm(f => ({ ...f, description: t }))} multiline numberOfLines={3} />
            </ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowForm(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.saveBtn, saving && { opacity: 0.5 }]} onPress={handleSave} disabled={saving}>
                {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  content: { padding: Spacing.four, paddingBottom: 60 },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: Spacing.four, paddingVertical: Spacing.three,
    borderBottomWidth: 1, borderBottomColor: Colors.light.border,
  },
  backText: { fontSize: FontSize.base, color: Colors.light.primary, fontWeight: "600" },
  heading: { fontSize: FontSize.xl, fontWeight: "800", color: Colors.light.textHeading },
  addBtn: { backgroundColor: Colors.light.accent, borderRadius: BorderRadius.full, paddingHorizontal: Spacing.four, paddingVertical: Spacing.two },
  addBtnText: { color: Colors.light.primary, fontWeight: "700", fontSize: FontSize.sm },
  empty: { alignItems: "center", marginTop: 80 },
  emptyText: { fontSize: FontSize.base, color: Colors.light.textSecondary, marginBottom: Spacing.four },
  emptyBtn: { backgroundColor: Colors.light.accent, borderRadius: BorderRadius.full, paddingHorizontal: Spacing.five, paddingVertical: Spacing.three },
  emptyBtnText: { color: Colors.light.primary, fontWeight: "700" },
  productCard: {
    flexDirection: "row", backgroundColor: Colors.light.card, borderRadius: BorderRadius["2xl"],
    borderWidth: 1, borderColor: Colors.light.border, padding: Spacing.four, marginBottom: Spacing.three,
    alignItems: "center",
  },
  productImage: { width: 56, height: 56, borderRadius: BorderRadius.lg, backgroundColor: Colors.light.backgroundElement },
  productInfo: { flex: 1, marginLeft: Spacing.three },
  productName: { fontSize: FontSize.sm, fontWeight: "600", color: Colors.light.textHeading },
  productCategory: { fontSize: FontSize.xs, color: Colors.light.accent, fontWeight: "600", letterSpacing: 1, marginTop: 1 },
  productPrice: { fontSize: FontSize.sm, fontWeight: "700", color: Colors.light.primary, marginTop: 2, fontFamily: Platform.OS === "web" ? "monospace" : undefined },
  stockBadge: { alignSelf: "flex-start", borderRadius: BorderRadius.full, paddingHorizontal: Spacing.two, paddingVertical: 1, marginTop: Spacing.one },
  stockHigh: { backgroundColor: "#D1FAE5" },
  stockLow: { backgroundColor: "#FEF3C7" },
  stockOut: { backgroundColor: "#FEE2E2" },
  stockText: { fontSize: FontSize.xs, fontWeight: "600" },
  productActions: { gap: Spacing.two, marginLeft: Spacing.two },
  editBtn: { backgroundColor: Colors.light.backgroundElement, borderRadius: BorderRadius.full, paddingHorizontal: Spacing.three, paddingVertical: Spacing.one },
  editBtnText: { fontSize: FontSize.xs, fontWeight: "600", color: Colors.light.primary },
  deleteBtn: { backgroundColor: "#FEE2E2", borderRadius: BorderRadius.full, paddingHorizontal: Spacing.three, paddingVertical: Spacing.one },
  deleteBtnText: { fontSize: FontSize.xs, fontWeight: "600", color: "#DC2626" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modal: {
    backgroundColor: Colors.light.card, borderTopLeftRadius: BorderRadius["3xl"], borderTopRightRadius: BorderRadius["3xl"],
    padding: Spacing.five, maxHeight: "80%",
  },
  modalTitle: { fontSize: FontSize.xl, fontWeight: "800", color: Colors.light.textHeading, marginBottom: Spacing.four },
  modalForm: { gap: Spacing.three },
  input: {
    backgroundColor: Colors.light.background, borderRadius: BorderRadius.xl, padding: Spacing.three,
    fontSize: FontSize.sm, color: Colors.light.text, borderWidth: 1, borderColor: Colors.light.border, marginBottom: Spacing.three,
  },
  textArea: { minHeight: 80, textAlignVertical: "top" },
  modalActions: { flexDirection: "row", gap: Spacing.three, marginTop: Spacing.four },
  cancelBtn: { flex: 1, borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.light.border, paddingVertical: Spacing.three, alignItems: "center" },
  cancelBtnText: { fontSize: FontSize.base, fontWeight: "600", color: Colors.light.text },
  saveBtn: { flex: 1, backgroundColor: Colors.light.accent, borderRadius: BorderRadius.full, paddingVertical: Spacing.three, alignItems: "center" },
  saveBtnText: { fontSize: FontSize.base, fontWeight: "700", color: Colors.light.primary },
  errorText: { fontSize: FontSize.base, color: Colors.light.danger, textAlign: "center", marginTop: 100 },
})
