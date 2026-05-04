#!/usr/bin/env node
/**
 * Create Admin User Script
 * 
 * This script creates an admin user in the database.
 * Run this once to create your first admin account.
 * 
 * Usage:
 *   node create-admin.js
 * 
 * Or with custom values:
 *   ADMIN_NAME="John Doe" ADMIN_EMAIL="john@example.com" ADMIN_PASSWORD="SecurePass123!" node create-admin.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const readline = require("readline");

// Import User model
const User = require("./src/models/user.model");

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Promisify readline question
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`),
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
const isValidPassword = (password) => {
  return password.length >= 6;
};

// Main function
async function createAdmin() {
  try {
    log.title("🔐 Admin User Creation Script");

    // Check if DB_URL is configured
    if (!process.env.DB_URL) {
      log.error("DB_URL not found in environment variables");
      log.info("Please create a .env file with DB_URL");
      process.exit(1);
    }

    // Connect to MongoDB
    log.info("Connecting to MongoDB...");
    await mongoose.connect(process.env.DB_URL);
    log.success("Connected to MongoDB");

    // Get admin details from environment or prompt user
    let name = process.env.ADMIN_NAME;
    let email = process.env.ADMIN_EMAIL;
    let password = process.env.ADMIN_PASSWORD;

    // If not provided via environment, prompt user
    if (!name || !email || !password) {
      log.info("Please provide admin user details:\n");

      if (!name) {
        name = await question("Admin Name: ");
        if (!name.trim()) {
          log.error("Name cannot be empty");
          process.exit(1);
        }
      }

      if (!email) {
        email = await question("Admin Email: ");
        if (!isValidEmail(email)) {
          log.error("Invalid email format");
          process.exit(1);
        }
      }

      if (!password) {
        password = await question("Admin Password (min 6 characters): ");
        if (!isValidPassword(password)) {
          log.error("Password must be at least 6 characters long");
          process.exit(1);
        }
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      if (existingUser.role === "admin") {
        log.warn(`User ${email} already exists and is already an admin`);
        const update = await question("\nUpdate to admin role anyway? (y/n): ");
        if (update.toLowerCase() !== "y") {
          log.info("Operation cancelled");
          process.exit(0);
        }
      } else {
        log.warn(`User ${email} already exists with role: ${existingUser.role}`);
        const update = await question("\nUpdate to admin role? (y/n): ");
        if (update.toLowerCase() === "y") {
          existingUser.role = "admin";
          await existingUser.save();
          log.success(`User ${email} updated to admin role`);
          log.info(`\nAdmin Details:`);
          log.info(`  Name: ${existingUser.name}`);
          log.info(`  Email: ${existingUser.email}`);
          log.info(`  Role: ${existingUser.role}`);
          process.exit(0);
        } else {
          log.info("Operation cancelled");
          process.exit(0);
        }
      }
    }

    // Create new admin user
    log.info("\nCreating admin user...");
    const admin = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password,
      role: "admin",
    });

    log.success("Admin user created successfully!");
    log.info(`\nAdmin Details:`);
    log.info(`  ID: ${admin._id}`);
    log.info(`  Name: ${admin.name}`);
    log.info(`  Email: ${admin.email}`);
    log.info(`  Role: ${admin.role}`);
    log.info(`  Created: ${admin.createdAt}`);

    log.title("✨ Next Steps:");
    log.info("1. Login with the admin credentials");
    log.info("2. Access admin endpoints at /api/v1/admin/*");
    log.info("3. Keep your admin credentials secure!");

  } catch (error) {
    log.error(`Error creating admin user: ${error.message}`);
    if (error.code === 11000) {
      log.error("Email already exists in database");
    }
    process.exit(1);
  } finally {
    rl.close();
    await mongoose.connection.close();
    log.info("\nDatabase connection closed");
  }
}

// Run the script
createAdmin();
