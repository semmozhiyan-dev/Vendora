import { Tabs } from "expo-router"
import { Text, StyleSheet } from "react-native"
import { Colors } from "../../constants/theme"

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Home: "🏠",
    Cart: "🛒",
    Orders: "📋",
    Profile: "👤",
  }
  return <Text style={[styles.icon, focused && styles.iconFocused]}>{icons[label] || "•"}</Text>
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.light.primary,
        tabBarInactiveTintColor: Colors.light.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => <TabIcon label="Home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ focused }) => <TabIcon label="Cart" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ focused }) => <TabIcon label="Orders" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => <TabIcon label="Profile" focused={focused} />,
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.light.background,
    borderTopColor: Colors.light.border,
    borderTopWidth: 1,
    paddingBottom: 4,
    paddingTop: 4,
    height: 56,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "500",
  },
  icon: {
    fontSize: 22,
    opacity: 0.5,
  },
  iconFocused: {
    opacity: 1,
  },
})
