import { Tabs } from "expo-router"
import { View, StyleSheet } from "react-native"
import Svg, { Path, Circle } from "react-native-svg"
import { Colors } from "../../constants/theme"

function HomeIcon({ focused }: { focused: boolean }) {
  const color = focused ? Colors.light.accent : Colors.light.textSecondary
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

function ProductsIcon({ focused }: { focused: boolean }) {
  const color = focused ? Colors.light.accent : Colors.light.textSecondary
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

function CartIcon({ focused }: { focused: boolean }) {
  const color = focused ? Colors.light.accent : Colors.light.textSecondary
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

function OrdersIcon({ focused }: { focused: boolean }) {
  const color = focused ? Colors.light.accent : Colors.light.textSecondary
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

function ProfileIcon({ focused }: { focused: boolean }) {
  const color = focused ? Colors.light.accent : Colors.light.textSecondary
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.light.accent,
        tabBarInactiveTintColor: Colors.light.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => <HomeIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: "Products",
          tabBarIcon: ({ focused }) => <ProductsIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ focused }) => <CartIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ focused }) => <OrdersIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => <ProfileIcon focused={focused} />,
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.light.card,
    borderTopColor: Colors.light.border,
    borderTopWidth: 1,
    paddingBottom: 4,
    paddingTop: 4,
    height: 56,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
})
