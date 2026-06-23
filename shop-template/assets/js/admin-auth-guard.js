// admin-auth-guard.js

import { auth, db } from "./firebase-config.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export function requireAdmin() {
  return new Promise((resolve, reject) => {

    const unsubscribe = onAuthStateChanged(auth, async (user) => {

      if (!user) {
        console.log("❌ User not logged in");
        window.location.href = "login.html";
        return;
      }

      try {
        console.log("🔍 Checking admin...");
        console.log("UID:", user.uid);
        console.log("Email:", user.email);

        const adminRef = doc(db, "admins", user.uid);
        const adminSnap = await getDoc(adminRef);

        console.log("Admin doc exists:", adminSnap.exists());

        if (adminSnap.exists()) {
          console.log("Admin data:", adminSnap.data());

          unsubscribe();
          resolve(user);
          return;
        }

        console.log("❌ User is not admin");

        await signOut(auth);
        window.location.href = "login.html";

      } catch (error) {

        console.error("❌ Admin check failed:", error);

        reject(error);

        alert(
          "Admin verification failed.\n\n" +
          error.message
        );
      }
    });
  });
}

export async function adminLogout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
  }

  window.location.href = "login.html";
}
