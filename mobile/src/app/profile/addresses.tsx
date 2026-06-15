import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
  Switch,
} from "react-native"
import { getAddresses, addAddress, updateAddress, deleteAddress } from "../../services/auth"
import { Address } from "../../types"
import { Colors, Spacing, FontSize, BorderRadius } from "../../constants/theme"

export default function AddressBookScreen() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  })

  const fetchAddresses = async () => {
    try {
      setLoading(true)
      const res = await getAddresses()
      setAddresses(res.data || [])
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAddresses()
  }, [])

  const resetForm = () => {
    setForm({ fullName: "", phone: "", addressLine: "", city: "", state: "", pincode: "", isDefault: false })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (addr: Address) => {
    setForm({
      fullName: addr.fullName,
      phone: addr.phone,
      addressLine: addr.addressLine,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      isDefault: addr.isDefault,
    })
    setEditingId(addr._id)
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.fullName.trim() || !form.phone.trim() || !form.addressLine.trim() ||
        !form.city.trim() || !form.state.trim() || !form.pincode.trim()) {
      Alert.alert("Missing Fields", "Please fill in all address fields")
      return
    }
    setSaving(true)
    try {
      if (editingId) {
        await updateAddress(editingId, form)
      } else {
        await addAddress(form)
      }
      resetForm()
      await fetchAddresses()
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to save address")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = (id: string) => {
    Alert.alert("Delete Address", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteAddress(id)
            await fetchAddresses()
          } catch {
            Alert.alert("Error", "Failed to delete address")
          }
        },
      },
    ])
  }

  const handleSetDefault = async (addr: Address) => {
    try {
      await updateAddress(addr._id, { isDefault: true })
      await fetchAddresses()
    } catch {
      Alert.alert("Error", "Failed to set default address")
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.light.primary} style={{ marginTop: 100 }} />
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.heading}>Address Book</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => { resetForm(); setShowForm(true) }}
        >
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {addresses.length === 0 && !showForm ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No addresses yet. Add one to get started.</Text>
        </View>
      ) : null}

      {addresses.map((addr) => (
        <View key={addr._id} style={styles.addressCard}>
          <View style={styles.addressHeader}>
            <Text style={styles.addressName}>{addr.fullName}</Text>
            {addr.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultBadgeText}>Default</Text>
              </View>
            )}
          </View>
          <Text style={styles.addressDetail}>{addr.addressLine}</Text>
          <Text style={styles.addressDetail}>
            {addr.city}, {addr.state} - {addr.pincode}
          </Text>
          <Text style={styles.addressDetail}>{addr.phone}</Text>
          <View style={styles.addressActions}>
            {!addr.isDefault && (
              <TouchableOpacity onPress={() => handleSetDefault(addr)}>
                <Text style={styles.actionLink}>Set Default</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => handleEdit(addr)}>
              <Text style={styles.actionLink}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(addr._id)}>
              <Text style={[styles.actionLink, styles.actionDanger]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {showForm && (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>{editingId ? "Edit Address" : "Add Address"}</Text>
          <View style={styles.formGrid}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor={Colors.light.textSecondary}
              value={form.fullName}
              onChangeText={(t) => setForm((f) => ({ ...f, fullName: t }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              placeholderTextColor={Colors.light.textSecondary}
              value={form.phone}
              onChangeText={(t) => setForm((f) => ({ ...f, phone: t }))}
              keyboardType="phone-pad"
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Address"
              placeholderTextColor={Colors.light.textSecondary}
              value={form.addressLine}
              onChangeText={(t) => setForm((f) => ({ ...f, addressLine: t }))}
              multiline
            />
            <TextInput
              style={styles.input}
              placeholder="City"
              placeholderTextColor={Colors.light.textSecondary}
              value={form.city}
              onChangeText={(t) => setForm((f) => ({ ...f, city: t }))}
            />
            <TextInput
              style={styles.input}
              placeholder="State"
              placeholderTextColor={Colors.light.textSecondary}
              value={form.state}
              onChangeText={(t) => setForm((f) => ({ ...f, state: t }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Pincode"
              placeholderTextColor={Colors.light.textSecondary}
              value={form.pincode}
              onChangeText={(t) => setForm((f) => ({ ...f, pincode: t }))}
              keyboardType="number-pad"
            />
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Set as default address</Text>
              <Switch
                value={form.isDefault}
                onValueChange={(v) => setForm((f) => ({ ...f, isDefault: v }))}
                trackColor={{ true: Colors.light.primary }}
              />
            </View>
          </View>
          <View style={styles.formActions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={resetForm}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.saveBtnText}>{editingId ? "Update" : "Add"}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  content: { padding: Spacing.four, paddingBottom: 60 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.five,
  },
  heading: { fontSize: FontSize["2xl"], fontWeight: "700", color: Colors.light.text },
  addBtn: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: BorderRadius.md,
  },
  addBtnText: { color: "#fff", fontSize: FontSize.sm, fontWeight: "600" },
  empty: { alignItems: "center", marginTop: 60 },
  emptyText: { fontSize: FontSize.sm, color: Colors.light.textSecondary },
  addressCard: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.four,
    marginBottom: Spacing.three,
  },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.two,
  },
  addressName: { fontSize: FontSize.base, fontWeight: "600", color: Colors.light.text },
  defaultBadge: {
    backgroundColor: Colors.light.primaryLight,
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  defaultBadgeText: { fontSize: FontSize.xs, fontWeight: "600", color: Colors.light.primary },
  addressDetail: { fontSize: FontSize.sm, color: Colors.light.textSecondary, marginBottom: 2 },
  addressActions: {
    flexDirection: "row",
    gap: Spacing.four,
    marginTop: Spacing.three,
    paddingTop: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.light.border,
  },
  actionLink: { fontSize: FontSize.sm, fontWeight: "600", color: Colors.light.primary },
  actionDanger: { color: Colors.light.danger },
  formCard: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.four,
    marginTop: Spacing.four,
  },
  formTitle: { fontSize: FontSize.base, fontWeight: "600", color: Colors.light.text, marginBottom: Spacing.four },
  formGrid: { gap: Spacing.three },
  input: {
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: BorderRadius.md,
    padding: Spacing.three,
    fontSize: FontSize.sm,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  textArea: { minHeight: 60, textAlignVertical: "top" },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  switchLabel: { fontSize: FontSize.sm, color: Colors.light.text },
  formActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: Spacing.three,
    marginTop: Spacing.four,
  },
  cancelBtn: {
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  cancelBtnText: { fontSize: FontSize.sm, fontWeight: "600", color: Colors.light.textSecondary },
  saveBtn: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.three,
    borderRadius: BorderRadius.md,
    minWidth: 80,
    alignItems: "center",
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: "#fff", fontSize: FontSize.sm, fontWeight: "600" },
})
