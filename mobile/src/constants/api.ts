import { Platform } from "react-native"

const getBaseUrl = () => {
  if (Platform.OS === "android") {
    return "http://10.0.2.2:5000/api/v1"
  }
  return "http://localhost:5000/api/v1"
}

export const API_BASE_URL = getBaseUrl()
