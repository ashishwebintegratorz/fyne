import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customerInfo, paymentProvider } = body;

    // 1. Basic validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart items are required to process order." },
        { status: 400 }
      )
    }

    if (!customerInfo || !customerInfo.email || !customerInfo.name) {
      return NextResponse.json(
        { error: "Customer details (name & email) are required." },
        { status: 400 }
      )
    }

    // 2. Server-side totals calculation (Security Best Practice)
    // In production, prices should be resolved from a database rather than trusting client-side pricing.
    let calculatedSubtotal = 0;
    const basePrices: Record<string, number> = {
      "luxury-lip-balm": 85,
      "leather-sleeve-duo": 140,
      "balm-refill-trio": 45,
    };

    for (const item of items) {
      const basePrice = basePrices[item.productId] || 85;
      calculatedSubtotal += basePrice * item.quantity;
    }

    // Apply complimentary shipping
    const calculatedTotal = calculatedSubtotal;

    // 3. Provider-specific response formatting
    if (paymentProvider === "stripe") {
      // Mock generating a Stripe PaymentIntent
      return NextResponse.json({
        success: true,
        provider: "stripe",
        amount: calculatedTotal * 100, // Stripe expects cents
        currency: "usd",
        clientSecret: `pi_mock_${Math.random().toString(36).substring(2, 12)}_secret_${Math.random().toString(36).substring(2, 10)}`,
        publishableKey: "pk_test_fyne_luxury_51Pabcdxyz123",
        message: "Stripe PaymentIntent initialized on server."
      });
    } else if (paymentProvider === "razorpay") {
      // Mock generating a Razorpay Order
      return NextResponse.json({
        success: true,
        provider: "razorpay",
        amount: calculatedTotal * 100, // Razorpay expects paise/cents
        currency: "INR",
        orderId: `order_mock_${Math.random().toString(36).substring(2, 12)}`,
        keyId: "rzp_test_fyne_key_abc123",
        message: "Razorpay Order ID created on server."
      });
    }

    // Default response for simple checkout confirmation
    return NextResponse.json({
      success: true,
      amount: calculatedTotal,
      currency: "usd",
      orderReference: `FYN-${Math.floor(100000 + Math.random() * 900000)}`,
      message: "Standard order transaction processed."
    });

  } catch (err: unknown) {
    console.error("Checkout API error:", err);
    return NextResponse.json(
      { error: "Internal server error occurred while processing checkout." },
      { status: 500 }
    );
  }
}
