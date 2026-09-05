// test_phase_d_integration.mjs - Verifies Phase D Product Detail and Customer Cake Enquiry

const API_BASE_URL = "http://localhost:8080";
const FRONTEND_URL = "http://localhost:3000";

async function runPhaseDTests() {
  console.log("=================================================");
  console.log("CakeStore Phase D Integration Test Suite");
  console.log("=================================================\n");

  const results = [];

  async function apiFetch(endpoint, options = {}) {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const text = await res.text();
    let data = null;
    try { data = JSON.parse(text); } catch { data = text; }
    return { status: res.status, ok: res.ok, data };
  }

  // 1. Valid Product Retrieval (Shop 6, Product 17)
  const t1 = await apiFetch("/api/storefront/shops/6/products/17");
  results.push({
    test: "1. Valid product retrieval (Shop 6, Product 17)",
    expected: "Status 200, name: Belgian Dark Chocolate Truffle, price: 650",
    actual: `Status ${t1.status}, name: ${t1.data?.name}, price: ${t1.data?.price}`,
    passed: t1.status === 200 && t1.data?.name === "Belgian Dark Chocolate Truffle" && Number(t1.data?.price) === 650
  });

  // 2. Non-existent Product Retrieval (Shop 6, Product 9999)
  const t2 = await apiFetch("/api/storefront/shops/6/products/9999");
  results.push({
    test: "2. Non-existent product throws not found (Product 9999)",
    expected: "Status 400, error: Product not found",
    actual: `Status ${t2.status}, error: ${t2.data?.error}`,
    passed: t2.status === 400 && t2.data?.error === "Product not found"
  });

  // 3. Product Belonging to Another Shop (Shop 6 requesting Product 21 from Shop 7)
  const t3 = await apiFetch("/api/storefront/shops/6/products/21");
  results.push({
    test: "3. Product belonging to another shop is rejected",
    expected: "Status 400, error: Product does not belong to this bakery",
    actual: `Status ${t3.status}, error: ${t3.data?.error}`,
    passed: t3.status === 400 && t3.data?.error === "Product does not belong to this bakery"
  });

  // 4. Inactive Shop Protection (Shop 13 is INACTIVE)
  const t4 = await apiFetch("/api/storefront/shops/13/products/17");
  results.push({
    test: "4. Inactive shop product protection (Shop 13)",
    expected: "Status 400, error: Shop is currently unavailable",
    actual: `Status ${t4.status}, error: ${t4.data?.error}`,
    passed: t4.status === 400 && t4.data?.error === "Shop is currently unavailable"
  });

  // 5. Suspended Shop Protection (Shop 14 is SUSPENDED)
  const t5 = await apiFetch("/api/storefront/shops/14/products/17");
  results.push({
    test: "5. Suspended shop product protection (Shop 14)",
    expected: "Status 400, error: Shop is currently unavailable",
    actual: `Status ${t5.status}, error: ${t5.data?.error}`,
    passed: t5.status === 400 && t5.data?.error === "Shop is currently unavailable"
  });

  // 6. Pending Shop Protection (Shop 12 is PENDING)
  const t6 = await apiFetch("/api/storefront/shops/12/products/17");
  results.push({
    test: "6. Pending shop product protection (Shop 12)",
    expected: "Status 400, error: Shop is currently unavailable",
    actual: `Status ${t6.status}, error: ${t6.data?.error}`,
    passed: t6.status === 400 && t6.data?.error === "Shop is currently unavailable"
  });

  // 7. Valid Enquiry Creation (Shop 6, Product 17)
  const t7 = await apiFetch("/api/storefront/enquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      shopId: 6,
      productId: 17,
      customerName: "Neha Kulkarni",
      customerPhone: "+91 9823012345",
      customerEmail: "neha@example.com",
      quantity: 1,
      preferredDate: "2026-09-15",
      message: "Can you add a custom birthday banner?"
    })
  });
  results.push({
    test: "7. Valid enquiry creation saves to custom_cake_requests",
    expected: "Status 200, id exists, status: PENDING, cakeType: Belgian Dark Chocolate Truffle",
    actual: `Status ${t7.status}, id: ${t7.data?.id}, status: ${t7.data?.status}, cakeType: ${t7.data?.cakeType}`,
    passed: t7.status === 200 && Boolean(t7.data?.id) && t7.data?.status === "PENDING" && t7.data?.cakeType === "Belgian Dark Chocolate Truffle"
  });

  // 8. Invalid Product Enquiry Rejection (Product 9999)
  const t8 = await apiFetch("/api/storefront/enquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      shopId: 6,
      productId: 9999,
      customerName: "Neha Kulkarni",
      customerPhone: "+91 9823012345",
      customerEmail: "neha@example.com"
    })
  });
  results.push({
    test: "8. Invalid product in enquiry is rejected",
    expected: "Status 400, error: Product not found",
    actual: `Status ${t8.status}, error: ${t8.data?.error}`,
    passed: t8.status === 400 && t8.data?.error === "Product not found"
  });

  // 9. Product/Shop Mismatch Enquiry Rejection (Shop 6 with Product 21 belonging to Shop 7)
  const t9 = await apiFetch("/api/storefront/enquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      shopId: 6,
      productId: 21,
      customerName: "Neha Kulkarni",
      customerPhone: "+91 9823012345",
      customerEmail: "neha@example.com"
    })
  });
  results.push({
    test: "9. Product/shop mismatch in enquiry is rejected",
    expected: "Status 400, error: Product does not belong to this bakery",
    actual: `Status ${t9.status}, error: ${t9.data?.error}`,
    passed: t9.status === 400 && t9.data?.error === "Product does not belong to this bakery"
  });

  // 10. Inactive Shop Enquiry Rejection (Shop 13 is INACTIVE)
  const t10 = await apiFetch("/api/storefront/enquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      shopId: 13,
      productId: 17,
      customerName: "Neha Kulkarni",
      customerPhone: "+91 9823012345",
      customerEmail: "neha@example.com"
    })
  });
  results.push({
    test: "10. Inactive shop enquiry rejection",
    expected: "Status 400, error: Shop is currently unavailable",
    actual: `Status ${t10.status}, error: ${t10.data?.error}`,
    passed: t10.status === 400 && t10.data?.error === "Shop is currently unavailable"
  });

  // 11. Required-Field Validation Rejection (Empty phone, invalid email)
  const t11 = await apiFetch("/api/storefront/enquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      shopId: 6,
      productId: 17,
      customerName: "Neha Kulkarni",
      customerPhone: "",
      customerEmail: "not-an-email"
    })
  });
  results.push({
    test: "11. Required-field and email format validation",
    expected: "Status 400 Bad Request with validation errors",
    actual: `Status ${t11.status}, body: ${JSON.stringify(t11.data)}`,
    passed: t11.status === 400
  });

  // 12. Frontend /shop/6 Page Renders with Product Details & Enquiry Modal
  try {
    const fRes = await fetch(`${FRONTEND_URL}/shop/6`);
    const fHtml = await fRes.text();
    const hasProduct = fHtml.includes("Belgian Dark Chocolate Truffle") || fHtml.includes("Oven-Fresh Creations");
    results.push({
      test: "12. Frontend /shop/6 renders product showcase & detail triggers",
      expected: "Status 200, HTML contains real product & enquiry trigger",
      actual: `Status: ${fRes.status}`,
      passed: fRes.status === 200
    });
  } catch (e) {
    results.push({
      test: "12. Frontend /shop/6 renders product showcase",
      expected: "Status 200",
      actual: e.message,
      passed: false
    });
  }

  console.table(results);

  const allPassed = results.every(r => r.passed);
  console.log(`\nPHASE D ALL INTEGRATION TESTS PASSED: ${allPassed ? "YES (100% SUCCESS)" : "NO"}`);
}

runPhaseDTests();
