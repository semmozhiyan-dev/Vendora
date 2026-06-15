import { useEffect } from "react"
import { router, useRootNavigationState } from "expo-router"
import { View, ActivityIndicator, StyleSheet } from "react-native"
import { useAuth } from "../store/AuthContext"
import { Colors } from "../constants/theme"

export default function Index() {
  const { isAuthenticated, loading } = useAuth()
  const navState = useRootNavigationState()

  useEffect(() => {
    if (!navState?.key || loading) return
    if (isAuthenticated) {
      router.replace("/(tabs)")
    } else {
      router.replace("/(auth)/login")
    }
  }, [isAuthenticated, loading, navState?.key])

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.light.primary} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.background,
  },
})
