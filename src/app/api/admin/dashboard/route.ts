import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import Customer from "@/models/Customer";
import Product from "@/models/Product";
import { authenticateAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const decoded = await authenticateAdmin(request);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // 1. Auto-seed mock data if DB has no orders
    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      console.log("No orders found. Seeding mock orders for analytical dashboard displays...");
      await seedMockAnalytics();
    }

    // 2. Fetch Aggregated Metrics
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    
    // Total Sales (only paid or non-cancelled orders)
    const salesStats = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, totalSales: { $sum: "$total" } } }
    ]);
    const totalSales = salesStats[0]?.totalSales || 0;

    // 3. Monthly Sales Reports
    const monthlyStats = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          revenue: { $sum: "$total" },
          ordersCount: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Format monthly stats for chart consumption
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlySalesData = monthlyStats.map((item) => ({
      label: `${months[item._id.month - 1]} ${item._id.year}`,
      revenue: Math.round(item.revenue),
      orders: item.ordersCount
    }));

    // 4. Best Selling Products
    const bestSellers = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          name: { $first: "$items.name" },
          salesCount: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      { $sort: { salesCount: -1 } },
      { $limit: 5 }
    ]);

    // 5. Recent Orders
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    // 6. Category Performance
    const categoryStats = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId", // Group by product ID and map to category
          salesCount: { $sum: "$items.quantity" },
        }
      }
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalSales: Math.round(totalSales),
        totalOrders,
        totalCustomers,
        averageOrderValue: totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0,
      },
      monthlySales: monthlySalesData,
      bestSellers: bestSellers.map((item) => ({
        id: item._id,
        name: item.name,
        sales: item.salesCount,
        revenue: Math.round(item.revenue)
      })),
      recentOrders: recentOrders.map((o) => ({
        id: o._id.toString(),
        orderReference: o.orderReference,
        customerName: o.customerInfo.name,
        total: o.total,
        status: o.status,
        createdAt: o.createdAt
      }))
    });

  } catch (err: any) {
    console.error("Dashboard Analytics API error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Seeding helper to create beautiful chart records
async function seedMockAnalytics() {
  // Ensure default products exist in the DB first
  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    const productsToSeed = [
      {
        productId: "cocoa-brown",
        name: "Cocoa Brown Crocodile Set",
        price: 85,
        description: "A luxurious vanilla-scented lip balm housed in Fyné’s signature leather case.",
        benefits: ["Scent: Warm Vanilla", "Texture: Smooth and non-sticky"],
        category: "Lip Balm",
        stock: 120,
        status: "active"
      },
      {
        productId: "sky-blue",
        name: "Celeste Sky Blue Crocodile Set",
        price: 85,
        description: "A luxurious vanilla-scented lip balm housed in Fyné’s signature leather case.",
        benefits: ["Scent: Warm Vanilla", "Texture: Smooth and non-sticky"],
        category: "Lip Balm",
        stock: 95,
        status: "active"
      },
      {
        productId: "midnight-navy",
        name: "Midnight Navy Crocodile Set",
        price: 85,
        description: "A luxurious vanilla-scented lip balm housed in Fyné’s signature leather case.",
        benefits: ["Scent: Warm Vanilla", "Texture: Smooth and non-sticky"],
        category: "Lip Balm",
        stock: 80,
        status: "active"
      },
      {
        productId: "ruby-red",
        name: "Ruby Red Crocodile Set",
        price: 85,
        description: "A luxurious vanilla-scented lip balm housed in Fyné’s signature leather case.",
        benefits: ["Scent: Warm Vanilla", "Texture: Smooth and non-sticky"],
        category: "Lip Balm",
        stock: 45,
        status: "active"
      }
    ];
    await Product.insertMany(productsToSeed);
  }

  // Seed Customers
  const mockCustomers = [
    { name: "Sophia Loren", email: "sophia@example.com", phone: "+971 50 111 2222", totalSpend: 255, orderCount: 3 },
    { name: "Julian Vance", email: "julian@example.com", phone: "+1 415 888 9999", totalSpend: 170, orderCount: 2 },
    { name: "Elena Rostova", email: "elena@example.com", phone: "+44 20 7946 0958", totalSpend: 85, orderCount: 1 },
    { name: "Marcus Aurelius", email: "marcus@example.com", phone: "+39 06 1234567", totalSpend: 340, orderCount: 2 }
  ];

  const seededCustomers = [];
  for (const c of mockCustomers) {
    let customer = await Customer.findOne({ email: c.email });
    if (!customer) {
      customer = new Customer({
        name: c.name,
        email: c.email,
        phone: c.phone,
        addresses: [{ address: "12 atelier Blvd", city: "Dubai Marina", country: "United Arab Emirates", isDefault: true }],
        totalSpend: c.totalSpend,
        orderCount: c.orderCount,
        activity: [{ action: "ACCOUNT_CREATED", timestamp: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) }]
      });
      await customer.save();
    }
    seededCustomers.push(customer);
  }

  // Generate historical orders over past 4 months (March, April, May, June 2026)
  const now = new Date();
  const baseDate = new Date(now.getFullYear(), now.getMonth() - 3, 1); // 3 months ago

  const mockOrders = [
    // Month 1: March
    {
      orderReference: "FYN-283940",
      customerInfo: { name: "Sophia Loren", email: "sophia@example.com", phone: "+971 50 111 2222", address: "12 atelier Blvd", city: "Dubai", country: "United Arab Emirates" },
      items: [{ productId: "cocoa-brown", name: "Cocoa Brown Crocodile Set", price: 85, quantity: 1, color: "Cocoa Brown", initials: "SL" }],
      subtotal: 85, shippingCost: 0, discount: 0, total: 85, paymentProvider: "stripe", paymentStatus: "paid", status: "delivered",
      dateOffsetDays: 5
    },
    {
      orderReference: "FYN-472019",
      customerInfo: { name: "Julian Vance", email: "julian@example.com", phone: "+1 415 888 9999", address: "88 Golden Gate St", city: "San Francisco", country: "United States" },
      items: [{ productId: "midnight-navy", name: "Midnight Navy Crocodile Set", price: 85, quantity: 1, color: "Midnight Navy", initials: "JV" }],
      subtotal: 85, shippingCost: 15, discount: 0, total: 100, paymentProvider: "stripe", paymentStatus: "paid", status: "delivered",
      dateOffsetDays: 15
    },

    // Month 2: April
    {
      orderReference: "FYN-881920",
      customerInfo: { name: "Marcus Aurelius", email: "marcus@example.com", phone: "+39 06 1234567", address: "Palace Hill", city: "Rome", country: "Italy" },
      items: [
        { productId: "ruby-red", name: "Ruby Red Crocodile Set", price: 85, quantity: 1, color: "Ruby Red", initials: "MA" },
        { productId: "cocoa-brown", name: "Cocoa Brown Crocodile Set", price: 85, quantity: 1, color: "Cocoa Brown", initials: "MA" }
      ],
      subtotal: 170, shippingCost: 0, discount: 20, total: 150, paymentProvider: "stripe", paymentStatus: "paid", status: "delivered",
      dateOffsetDays: 35
    },
    {
      orderReference: "FYN-930491",
      customerInfo: { name: "Sophia Loren", email: "sophia@example.com", phone: "+971 50 111 2222", address: "12 atelier Blvd", city: "Dubai", country: "United Arab Emirates" },
      items: [{ productId: "sky-blue", name: "Celeste Sky Blue Crocodile Set", price: 85, quantity: 1, color: "Celeste Blue", initials: "SL" }],
      subtotal: 85, shippingCost: 0, discount: 0, total: 85, paymentProvider: "stripe", paymentStatus: "paid", status: "delivered",
      dateOffsetDays: 45
    },

    // Month 3: May
    {
      orderReference: "FYN-110293",
      customerInfo: { name: "Elena Rostova", email: "elena@example.com", phone: "+44 20 7946 0958", address: "44 Westminster St", city: "London", country: "United Kingdom" },
      items: [{ productId: "ruby-red", name: "Ruby Red Crocodile Set", price: 85, quantity: 1, color: "Ruby Red", initials: "ER" }],
      subtotal: 85, shippingCost: 0, discount: 0, total: 85, paymentProvider: "stripe", paymentStatus: "paid", status: "delivered",
      dateOffsetDays: 68
    },
    {
      orderReference: "FYN-551029",
      customerInfo: { name: "Marcus Aurelius", email: "marcus@example.com", phone: "+39 06 1234567", address: "Palace Hill", city: "Rome", country: "Italy" },
      items: [
        { productId: "midnight-navy", name: "Midnight Navy Crocodile Set", price: 85, quantity: 2, color: "Midnight Navy", initials: "ROM" }
      ],
      subtotal: 170, shippingCost: 15, discount: 0, total: 185, paymentProvider: "stripe", paymentStatus: "paid", status: "delivered",
      dateOffsetDays: 78
    },

    // Month 4: June (Current month)
    {
      orderReference: "FYN-660192",
      customerInfo: { name: "Sophia Loren", email: "sophia@example.com", phone: "+971 50 111 2222", address: "12 atelier Blvd", city: "Dubai", country: "United Arab Emirates" },
      items: [{ productId: "cocoa-brown", name: "Cocoa Brown Crocodile Set", price: 85, quantity: 1, color: "Cocoa Brown", initials: "SL" }],
      subtotal: 85, shippingCost: 0, discount: 0, total: 85, paymentProvider: "stripe", paymentStatus: "paid", status: "processing",
      dateOffsetDays: 92
    },
    {
      orderReference: "FYN-771029",
      customerInfo: { name: "Julian Vance", email: "julian@example.com", phone: "+1 415 888 9999", address: "88 Golden Gate St", city: "San Francisco", country: "United States" },
      items: [{ productId: "sky-blue", name: "Celeste Sky Blue Crocodile Set", price: 85, quantity: 1, color: "Celeste Blue", initials: "JV" }],
      subtotal: 85, shippingCost: 0, discount: 15, total: 70, paymentProvider: "stripe", paymentStatus: "paid", status: "pending",
      dateOffsetDays: 97
    }
  ];

  for (const item of mockOrders) {
    const orderDate = new Date(baseDate.getTime() + item.dateOffsetDays * 24 * 60 * 60 * 1000);
    const order = new Order({
      orderReference: item.orderReference,
      customerInfo: item.customerInfo,
      items: item.items,
      subtotal: item.subtotal,
      shippingCost: item.shippingCost,
      discount: item.discount,
      total: item.total,
      paymentProvider: item.paymentProvider,
      paymentStatus: item.paymentStatus,
      status: item.status,
      createdAt: orderDate,
      updatedAt: orderDate
    });
    await order.save();

    // Link order to Customer
    const customer = seededCustomers.find((c) => c.email === item.customerInfo.email);
    if (customer) {
      customer.orders.push(order._id);
      customer.activity.push({
        action: `ORDER_PLACED: ${item.orderReference}`,
        timestamp: orderDate
      });
      await customer.save();
    }
  }

  console.log("Mock analytics seeding complete.");
}
