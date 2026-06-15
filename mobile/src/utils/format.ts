export const formatPrice = (price?: number | null): string => {
  if (price == null || isNaN(price)) return "₹0"
  return `₹${price.toLocaleString("en-IN")}`
}

export const formatDate = (dateStr?: string): string => {
  if (!dateStr) return ""
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return ""
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export const formatDateTime = (dateStr?: string): string => {
  if (!dateStr) return ""
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return ""
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const statusColor = (status?: string): string => {
  const map: Record<string, string> = {
    PENDING: "#F59E0B",
    PAID: "#3B82F6",
    SHIPPED: "#8B5CF6",
    DELIVERED: "#10B981",
    CANCELLED: "#EF4444",
    FAILED: "#EF4444",
  }
  return map[status || ""] || "#6B7280"
}

export const statusLabel = (status?: string): string => {
  if (!status) return "Unknown"
  return status.charAt(0) + status.slice(1).toLowerCase()
}

export const calcSubtotal = (items?: { price?: number; quantity?: number }[]): number => {
  if (!items || items.length === 0) return 0
  return items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0)
}

export const calcGst = (subtotal: number): number => {
  return subtotal * 0.18
}

export const calcTotal = (subtotal: number): number => {
  return subtotal + calcGst(subtotal)
}
