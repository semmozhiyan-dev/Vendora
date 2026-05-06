// Check for duplicate orders in database
const mongoose = require('mongoose');
require('dotenv').config();

const Order = require('./src/models/order.model');
const User = require('./src/models/user.model');
const Product = require('./src/models/product.model');

async function checkDuplicates() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log('Connected to MongoDB');

    // Get all orders
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    console.log(`\nTotal Orders: ${orders.length}`);
    console.log('\n=== Recent Orders ===');
    
    orders.slice(0, 10).forEach((order, index) => {
      console.log(`\n${index + 1}. Order ID: ${order._id}`);
      console.log(`   Customer: ${order.user?.name || 'N/A'}`);
      console.log(`   Total: $${order.totalAmount}`);
      console.log(`   Status: ${order.status}`);
      console.log(`   Created: ${order.createdAt}`);
    });

    // Check for duplicate order IDs
    const orderIds = orders.map(o => o._id.toString());
    const duplicateIds = orderIds.filter((id, index) => orderIds.indexOf(id) !== index);
    
    if (duplicateIds.length > 0) {
      console.log('\n⚠️  DUPLICATE ORDER IDs FOUND:');
      console.log(duplicateIds);
    } else {
      console.log('\n✅ No duplicate order IDs found');
    }

    // Check for orders with same user and amount created at same time
    const potentialDuplicates = [];
    for (let i = 0; i < orders.length; i++) {
      for (let j = i + 1; j < orders.length; j++) {
        if (
          orders[i].user?._id?.toString() === orders[j].user?._id?.toString() &&
          orders[i].totalAmount === orders[j].totalAmount &&
          Math.abs(new Date(orders[i].createdAt) - new Date(orders[j].createdAt)) < 1000
        ) {
          potentialDuplicates.push({
            order1: orders[i]._id,
            order2: orders[j]._id,
            user: orders[i].user?.name,
            amount: orders[i].totalAmount
          });
        }
      }
    }

    if (potentialDuplicates.length > 0) {
      console.log('\n⚠️  POTENTIAL DUPLICATE ORDERS (same user, amount, time):');
      potentialDuplicates.forEach(dup => {
        console.log(`   ${dup.order1} & ${dup.order2} - ${dup.user} - $${dup.amount}`);
      });
    } else {
      console.log('\n✅ No potential duplicate orders found');
    }

    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkDuplicates();
