import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Customer from "@/models/Customer";
import Coupon from "@/models/Coupon";
import ShippingZone from "@/models/ShippingZone";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { items, customerInfo, paymentProvider, shippingMethod, couponCode } = body;

    // 1. Basic validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart items are required to process order." },
        { status: 400 }
      );
    }

    if (!customerInfo || !customerInfo.email || !customerInfo.name) {
      return NextResponse.json(
        { error: "Customer details (name & email) are required." },
        { status: 400 }
      );
    }

    // 2. Resolve pricing from Database
    let subtotalUSD = 0;
    const resolvedItems = [];
    
    // Hardcoded fallback prices in case DB is not fully seeded yet
    const fallbackPrices: Record<string, number> = {
      "cocoa-brown": 85,
      "sky-blue": 85,
      "midnight-navy": 85,
      "forest-green": 85,
      "ruby-red": 85,
      "luxury-lip-balm": 85,
      "leather-sleeve-duo": 140,
      "balm-refill-trio": 45,
    };

    for (const item of items) {
      // Find product by id/productId in database
      const product = await Product.findOne({ productId: item.productId });
      const price = product ? product.price : (fallbackPrices[item.productId] || 85);
      
      subtotalUSD += price * item.quantity;
      
      resolvedItems.push({
        productId: item.productId,
        name: product ? product.name : item.name,
        price: price,
        quantity: item.quantity,
        color: item.color || "",
        initials: item.initials || "",
        giftWrap: item.giftWrap || false,
        image: item.image || ""
      });

      // Update product inventory in DB
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
        await product.save();
      }
    }

    // 3. Resolve Shipping Costs
    let shippingCostUSD = 0;
    const country = customerInfo.country || "United Arab Emirates";
    
    // Find shipping zone matching this country
    const zone = await ShippingZone.findOne({
      countries: { $regex: new RegExp(`^${country}$`, "i") }
    });

    const priorityFee = zone ? zone.priorityRate : 15;
    const standardFee = zone ? zone.baseRate : 0;
    const minFreeThreshold = zone ? zone.minFreeShippingSubtotal : 100;

    if (shippingMethod === "priority") {
      shippingCostUSD = priorityFee;
    } else {
      // Check if eligible for free standard shipping
      if (minFreeThreshold !== null && subtotalUSD >= minFreeThreshold) {
        shippingCostUSD = 0;
      } else {
        shippingCostUSD = standardFee;
      }
    }

    // 4. Resolve Coupon Code Discount
    let discountUSD = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.trim().toUpperCase(), active: true });
      if (coupon) {
        // Double check expiration
        const notExpired = !coupon.expirationDate || new Date() <= new Date(coupon.expirationDate);
        // Double check usage limit
        const limitNotReached = coupon.usageLimit === null || coupon.usageLimit === undefined || coupon.usageCount < coupon.usageLimit;

        if (notExpired && limitNotReached) {
          if (coupon.type === "percentage") {
            discountUSD = (subtotalUSD * coupon.value) / 100;
          } else if (coupon.type === "fixed") {
            discountUSD = coupon.value;
          }
          // Clamp discount so it doesn't exceed subtotal
          discountUSD = Math.min(discountUSD, subtotalUSD);
          
          // Increment usage count
          coupon.usageCount += 1;
          await coupon.save();
        }
      }
    }

    const totalUSD = subtotalUSD + shippingCostUSD - discountUSD;
    const orderRef = `FYN-${Math.floor(100000 + Math.random() * 900000)}`;

    // 5. Save Order to Database
    const newOrder = new Order({
      orderReference: orderRef,
      customerInfo: {
        name: customerInfo.name,
        email: customerInfo.email.toLowerCase(),
        phone: customerInfo.phone || "N/A",
        address: customerInfo.address,
        city: customerInfo.city || "N/A",
        country: country,
        zipCode: customerInfo.zipCode || ""
      },
      items: resolvedItems,
      subtotal: subtotalUSD,
      shippingCost: shippingCostUSD,
      discount: discountUSD,
      total: totalUSD,
      currency: "USD",
      paymentProvider: paymentProvider || "mock",
      paymentStatus: "paid", // Set as paid for simulation checkout
      shippingMethod: shippingMethod || "standard",
      status: "pending"
    });

    await newOrder.save();

    // 6. Create or Update Customer Record
    let customer = await Customer.findOne({ email: customerInfo.email.toLowerCase() });
    
    const addressObj = {
      address: customerInfo.address,
      city: customerInfo.city || "N/A",
      country: country,
      zipCode: customerInfo.zipCode || "",
      isDefault: true
    };

    if (customer) {
      // Update customer stats
      customer.name = customerInfo.name;
      if (customerInfo.phone) customer.phone = customerInfo.phone;
      
      // Add address to customer addresses if unique
      const addressExists = customer.addresses.some(
        (a: any) => a.address.toLowerCase() === customerInfo.address.toLowerCase()
      );
      if (!addressExists) {
        // Set previous default addresses to false
        customer.addresses.forEach((a: any) => { a.isDefault = false; });
        customer.addresses.push(addressObj);
      }

      customer.orders.push(newOrder._id);
      customer.orderCount += 1;
      customer.totalSpend += totalUSD;
      customer.activity.push({
        action: `PURCHASE: Placed order ${orderRef}`,
        timestamp: new Date()
      });
      
      await customer.save();
    } else {
      // Create new customer
      customer = new Customer({
        name: customerInfo.name,
        email: customerInfo.email.toLowerCase(),
        phone: customerInfo.phone || "N/A",
        addresses: [addressObj],
        orders: [newOrder._id],
        orderCount: 1,
        totalSpend: totalUSD,
        activity: [
          { action: "ACCOUNT_CREATED", timestamp: new Date() },
          { action: `PURCHASE: Placed order ${orderRef}`, timestamp: new Date() }
        ]
      });
      await customer.save();
    }

    // 7. Format provider-specific mock response
    if (paymentProvider === "stripe") {
      return NextResponse.json({
        success: true,
        provider: "stripe",
        amount: Math.round(totalUSD * 100), // in cents
        currency: "usd",
        clientSecret: `pi_mock_${Math.random().toString(36).substring(2, 12)}_secret_${Math.random().toString(36).substring(2, 10)}`,
        orderReference: orderRef,
        message: "Stripe transaction initialized and written to MongoDB."
      });
    } else if (paymentProvider === "razorpay") {
      return NextResponse.json({
        success: true,
        provider: "razorpay",
        amount: Math.round(totalUSD * 100), // in paise
        currency: "INR",
        orderId: `order_mock_${Math.random().toString(36).substring(2, 12)}`,
        orderReference: orderRef,
        message: "Razorpay transaction initialized and written to MongoDB."
      });
    }

    return NextResponse.json({
      success: true,
      amount: totalUSD,
      currency: "usd",
      orderReference: orderRef,
      message: "Standard order written to MongoDB successfully."
    });

  } catch (err: unknown) {
    console.error("Checkout API error:", err);
    return NextResponse.json(
      { error: "Internal server error occurred while processing checkout." },
      { status: 500 }
    );
  }
}
