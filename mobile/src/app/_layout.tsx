import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { ActivityIndicator, View, StyleSheet } from "react-native"
import { AuthProvider, useAuth } from "../store/AuthContext"
import { Colors } from "../constants/theme"

function RootLayout() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    )
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="product/[id]"
          options={{ presentation: "card", headerShown: true, headerTitle: "Product", headerBackTitle: "Back" }}
        />
        <Stack.Screen
          name="checkout"
          options={{ presentation: "card", headerShown: true, headerTitle: "Checkout", headerBackTitle: "Back" }}
        />
        <Stack.Screen
          name="order/[id]"
          options={{ presentation: "card", headerShown: true, headerTitle: "Order Details", headerBackTitle: "Back" }}
        />
        <Stack.Screen
          name="profile/details"
          options={{ headerShown: true, headerTitle: "My Details", headerBackTitle: "Back" }}
        />
        <Stack.Screen
          name="profile/password"
          options={{ headerShown: true, headerTitle: "Change Password", headerBackTitle: "Back" }}
        />
        <Stack.Screen
          name="profile/addresses"
          options={{ headerShown: true, headerTitle: "Address Book", headerBackTitle: "Back" }}
        />
        <Stack.Screen
          name="profile/preferences"
          options={{ headerShown: true, headerTitle: "Preferences", headerBackTitle: "Back" }}
        />
        <Stack.Screen
          name="admin/dashboard"
          options={{ headerShown: true, headerTitle: "Admin Dashboard", headerBackTitle: "Back" }}
        />
        <Stack.Screen
          name="admin/products"
          options={{ headerShown: true, headerTitle: "Manage Products", headerBackTitle: "Back" }}
        />
        <Stack.Screen
          name="admin/orders"
          options={{ headerShown: true, headerTitle: "Manage Orders", headerBackTitle: "Back" }}
        />
        <Stack.Screen
          name="admin/users"
          options={{ headerShown: true, headerTitle: "Manage Users", headerBackTitle: "Back" }}
        />
        <Stack.Screen
          name="order-success"
          options={{ headerShown: false, presentation: "fullScreenModal" }}
        />
      </Stack>
    </>
  )
}

export default function Root() {
  return (
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  )
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.background,
  },
})
