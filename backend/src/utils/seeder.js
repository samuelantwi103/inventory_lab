import dotenv from 'dotenv';
import DatabaseConfig from '../config/database.js';
import User from '../models/User.js';
import InventoryItem from '../models/InventoryItem.js';

// Load env vars
dotenv.config();

/**
 * Database Seeder
 * Seeds the database with sample data for testing
 */

const users = [
  {
    name: 'Admin User',
    email: 'admin@stockwise.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
  },
];

const inventory = [
  {
    name: 'MacBook Pro 16"',
    description: 'High-performance laptop with M2 chip',
    category: 'Electronics',
    quantity: 25,
    price: 2499.99,
    lowStockThreshold: 5,
  },
  {
    name: 'Office Desk',
    description: 'Adjustable standing desk',
    category: 'Furniture',
    quantity: 15,
    price: 599.99,
    lowStockThreshold: 3,
  },
  {
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse',
    category: 'Electronics',
    quantity: 100,
    price: 49.99,
    lowStockThreshold: 20,
  },
  {
    name: 'Office Chair',
    description: 'Ergonomic office chair with lumbar support',
    category: 'Furniture',
    quantity: 8,
    price: 299.99,
    lowStockThreshold: 5,
  },
  {
    name: 'Business Shirt',
    description: 'Professional cotton shirt',
    category: 'Clothing',
    quantity: 50,
    price: 39.99,
    lowStockThreshold: 10,
  },
  {
    name: 'Python Programming Book',
    description: 'Learn Python in 30 days',
    category: 'Books',
    quantity: 30,
    price: 29.99,
    lowStockThreshold: 10,
  },
  {
    name: 'USB-C Cable',
    description: '2m USB-C charging cable',
    category: 'Electronics',
    quantity: 5,
    price: 19.99,
    lowStockThreshold: 15,
  },
  {
    name: 'Notebook',
    description: 'A5 lined notebook - 200 pages',
    category: 'Other',
    quantity: 75,
    price: 9.99,
    lowStockThreshold: 20,
  },
];

// Seed data
const seedData = async () => {
  try {
    await DatabaseConfig.connect();

    // Clear existing data
    await User.deleteMany();
    await InventoryItem.deleteMany();

    console.log('📦 Cleared existing data...');

    // Create users
    const createdUsers = await User.create(users);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Add createdBy to inventory items
    const inventoryWithUser = inventory.map(item => ({
      ...item,
      createdBy: createdUsers[0]._id, // Assign to admin user
    }));

    // Create inventory items
    const createdItems = await InventoryItem.create(inventoryWithUser);
    console.log(`✅ Created ${createdItems.length} inventory items`);

    console.log('🎉 Database seeded successfully!');
    console.log('\n📝 Test credentials:');
    console.log('Admin: admin@stockwise.com / admin123');
    console.log('User: john@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error(`❌ Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedData();
