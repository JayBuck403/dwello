import { auth } from "../lib/firebase";

export async function getAuthToken() {
  if (auth.currentUser) {
    try {
      const token = await auth.currentUser.getIdToken();
      return token;
    } catch (error) {
      console.error("Error getting ID token:", error);
      return null;
    }
  }
  return null;
}
