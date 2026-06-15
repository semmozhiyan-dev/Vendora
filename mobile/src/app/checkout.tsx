import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native"
import { useRouter } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { getCart } from "../services/cart"
import { createOrder } from "../services/orders"
import { createRazorpayOrder, verifyPayment } from "../services/payments"
import { CartItem } from "../types"
import { formatPrice, calcSubtotal, calcGst, calcTotal } from "../utils/format"
import { Colors, Spacing, FontSize, BorderRadius } from "../constants/theme"
import { API_BASE_URL } from "../constants/api"

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function CheckoutScreen() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  })
  const router = useRouter()
  const insets = useSafeAreaInsets()

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getCart()
        if (!res.cart?.items?.length) {
          router.replace("/(tabs)/cart")
          return
        }
        setItems(res.cart.items)
      } catch {
        router.replace("/(tabs)/cart")
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const subtotal = calcSubtotal(
    items.map((i) => ({ price: i.product.price, quantity: i.quantity }))
  )
  const total = calcTotal(subtotal)

  const handlePlaceOrder = async () => {
    if (!form.fullName.trim() || !form.address.trim() || !form.city.trim() ||
        !form.state.trim() || !form.pincode.trim()) {
      Alert.alert("Missing Fields", "Please fill in all shipping address fields")
      return
    }

    setSubmitting(true)
    try {
      const orderItems = items.map((i) => ({
        productId: i.product._id,
        quantity: i.quantity,
      }))

      const shippingAddress = {
        street: form.address,
        city: form.city,
        state: form.state,
        zip: form.pincode,
        country: "India",
      }

      const orderRes = await createOrder({ items: orderItems, shippingAddress })
      const order = orderRes.order

      const payRes = await createRazorpayOrder(order._id)

      if (Platform.OS === "web") {
        await handleWebPayment(payRes, order._id)
      } else {
        Alert.alert(
          "Order Created",
          `Order placed successfully! Order ID: ${order._id.slice(-8)}`,
          [{ text: "OK", onPress: () => router.replace("/(tabs)/orders") }]
        )
      }
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to place order")
    } finally {
      setSubmitting(false)
    }
  }

  const handleWebPayment = async (payRes: any, orderId: string) => {
    return new Promise<void>((resolve, reject) => {
      if (typeof window === "undefined" || !window.Razorpay) {
        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.onload = () => openRazorpay(payRes, orderId, resolve, reject)
        document.body.appendChild(script)
      } else {
        openRazorpay(payRes, orderId, resolve, reject)
      }
    })
  }

  const openRazorpay = (
    payRes: any,
    orderId: string,
    resolve: () => void,
    reject: (e: Error) => void
  ) => {
    const options = {
      key: payRes.key,
      amount: payRes.amount,
      currency: "INR",
      name: "Vendora",
      order_id: payRes.razorpayOrderId,
      prefill: {
        name: form.fullName,
        email: form.email,
        contact: form.phone,
      },
      theme: { color: Colors.light.primary },
      handler: async (response: any) => {
        try {
          await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          })
          Alert.alert(
            "Payment Successful",
            "Your order has been placed!",
            [{ text: "OK", onPress: () => router.replace("/(tabs)/orders") }]
          )
          resolve()
        } catch (e: any) {
          Alert.alert("Payment Error", e.message || "Verification failed")
          reject(e)
        }
      },
      modal: {
        ondismiss: () => {
          reject(new Error("Payment cancelled"))
        },
      },
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={Colors.light.primary} style={{ marginTop: 100 }} />
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        <View style={styles.formGrid}>
          <TextInput
            style={styles.input}
            placeholder="Full Name *"
            placeholderTextColor={Colors.light.textSecondary}
            value={form.fullName}
            onChangeText={(t) => setForm((f) => ({ ...f, fullName: t }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={Colors.light.textSecondary}
            value={form.email}
            onChangeText={(t) => setForm((f) => ({ ...f, email: t }))}
            keyboardType="email-address"
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
            placeholder="Address *"
            placeholderTextColor={Colors.light.textSecondary}
            value={form.address}
            onChangeText={(t) => setForm((f) => ({ ...f, address: t }))}
            multiline
            numberOfLines={3}
          />
          <TextInput
            style={styles.input}
            placeholder="City *"
            placeholderTextColor={Colors.light.textSecondary}
            value={form.city}
            onChangeText={(t) => setForm((f) => ({ ...f, city: t }))}
          />
          <TextInput
            style={styles.input}
            placeholder="State *"
            placeholderTextColor={Colors.light.textSecondary}
            value={form.state}
            onChangeText={(t) => setForm((f) => ({ ...f, state: t }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Pincode *"
            placeholderTextColor={Colors.light.textSecondary}
            value={form.pincode}
            onChangeText={(t) => setForm((f) => ({ ...f, pincode: t }))}
            keyboardType="number-pad"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        {items.map((item) => (
          <View key={item.product._id} style={styles.summaryItem}>
            <Text style={styles.summaryItemName} numberOfLines={1}>
              {item.product.name} × {item.quantity}
            </Text>
            <Text style={styles.summaryItemPrice}>
              {formatPrice(item.product.price * item.quantity)}
            </Text>
          </View>
        ))}
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryValue}>Free</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>GST (18%)</Text>
          <Text style={styles.summaryValue}>{formatPrice(calcGst(subtotal))}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatPrice(total)}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.placeBtn, submitting && styles.placeBtnDisabled]}
        onPress={handlePlaceOrder}
        disabled={submitting}
        activeOpacity={0.8}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.placeBtnText}>Place Order — {formatPrice(total)}</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  content: { padding: Spacing.four, paddingBottom: 60 },
  section: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.four,
    marginBottom: Spacing.four,
  },
  sectionTitle: {
    fontSize: FontSize.base,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: Spacing.four,
  },
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
  textArea: { minHeight: 70, textAlignVertical: "top" },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.two,
  },
  summaryItemName: { fontSize: FontSize.sm, color: Colors.light.text, flex: 1 },
  summaryItemPrice: { fontSize: FontSize.sm, fontWeight: "600", color: Colors.light.text },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: Spacing.three,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.two,
  },
  summaryLabel: { fontSize: FontSize.sm, color: Colors.light.textSecondary },
  summaryValue: { fontSize: FontSize.sm, fontWeight: "600", color: Colors.light.text },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: Spacing.three,
    marginTop: Spacing.one,
  },
  totalLabel: { fontSize: FontSize.base, fontWeight: "700", color: Colors.light.text },
  totalValue: { fontSize: FontSize.base, fontWeight: "700", color: Colors.light.primary },
  placeBtn: {
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.four,
    alignItems: "center",
  },
  placeBtnDisabled: { opacity: 0.6 },
  placeBtnText: { color: "#fff", fontSize: FontSize.base, fontWeight: "600" },
})
