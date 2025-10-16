// scripts/auth.js

// Check if user already signed in
export function getCurrentUser() {
  return JSON.parse(localStorage.getItem("hitravellerUser")) || null;
}

// Register new user
export function registerUser(email, password) {
  const users = JSON.parse(localStorage.getItem("hitravellerUsers")) || [];
  if (users.find(u => u.email === email)) {
    alert("⚠️ User already exists. Try signing in.");
    return false;
  }
  users.push({ email, password });
  localStorage.setItem("hitravellerUsers", JSON.stringify(users));
  localStorage.setItem("hitravellerUser", JSON.stringify({ email }));
  alert("✅ Registration successful!");
  return true;
}

// Sign in existing user
export function signIn(email, password) {
  const users = JSON.parse(localStorage.getItem("hitravellerUsers")) || [];
  const found = users.find(u => u.email === email && u.password === password);
  if (!found) {
    alert("❌ Invalid email or password.");
    return false;
  }
  localStorage.setItem("hitravellerUser", JSON.stringify({ email }));
  alert(`👋 Welcome back, ${email}`);
  return true;
}

// Sign out user
export function signOut() {
  localStorage.removeItem("hitravellerUser");
  alert("👋 You’ve been signed out.");
  window.location.href = "index.html";
}
