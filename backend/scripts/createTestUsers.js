require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../src/models/user.model");

const testUsers = [
  {
    name: "Test User",
    email: "user@test.com",
    password: "password123",
    role: "user",
  },
  {
    name: "Admin User",
    email: "admin@test.com",
    password: "admin123",
    role: "admin",
  },
];

async function createTestUsers() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("✅ Connected to MongoDB");

    // Clear existing test users
    await User.deleteMany({ email: { $in: testUsers.map((u) => u.email) } });
    console.log("🗑️  Cleared existing test users");

    // Create new test users
    for (const userData of testUsers) {
      const user = await User.create(userData);
      console.log(`✅ Created ${user.role}: ${user.email}`);
    }

    console.log("\n📋 Test Users Created:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Regular User:");
    console.log("  Email: user@test.com");
    console.log("  Password: password123");
    console.log("\nAdmin User:");
    console.log("  Email: admin@test.com");
    console.log("  Password: admin123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

createTestUsers();
