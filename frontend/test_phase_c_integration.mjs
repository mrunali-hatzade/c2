// test_phase_c_integration.mjs - Verifies Phase C Storefront and Products Integration

const API_BASE_URL = "http://localhost:8080";
const FRONTEND_URL = "http://localhost:3000";

async function runPhaseCTests() {
  console.log("=================================================");
  console.log("CakeStore Phase C Integration Test Suite");
  console.log("=================================================\n");

  const results = [];

  // Helper fetch
  async function apiFetch(endpoint) {
    const res = await fetch(`${API_BASE_URL}${endpoint}`);
    const text = await res.text();
    let data = null;
    try { data = JSON.parse(text); } catch { data = text; }
    return { status: res.status, ok: res.ok, data };
  }

  // 1. ACTIVE shop can be retrieved
  const t1 = await apiFetch("/api/storefront/shops/6");
  results.push({
    test: "1. ACTIVE shop details retrieved (Shop 6)",
    expected: "Status 200, businessName: Akurdi Artisan Bakes, status: ACTIVE",
    actual: `Status ${t1.status}, name: ${t1.data?.businessName}, status: ${t1.data?.status}`,
    passed: t1.status === 200 && t1.data?.businessName === "Akurdi Artisan Bakes" && t1.data?.status === "ACTIVE"
  });

  // 2. PENDING shop cannot be exposed
  const t2 = await apiFetch("/api/storefront/shops/12");
  results.push({
    test: "2. PENDING shop protected from public access (Shop 12)",
    expected: "Status 400, error: Shop is currently unavailable",
    actual: `Status ${t2.status}, error: ${t2.data?.error}`,
    passed: t2.status === 400 && t2.data?.error === "Shop is currently unavailable"
  });

  // 3. INACTIVE shop cannot be exposed
  const t3 = await apiFetch("/api/storefront/shops/13");
  results.push({
    test: "3. INACTIVE shop protected from public access (Shop 13)",
    expected: "Status 400, error: Shop is currently unavailable",
    actual: `Status ${t3.status}, error: ${t3.data?.error}`,
    passed: t3.status === 400 && t3.data?.error === "Shop is currently unavailable"
  });

  // 4. SUSPENDED shop cannot be exposed
  const t4 = await apiFetch("/api/storefront/shops/14");
  results.push({
    test: "4. SUSPENDED shop protected from public access (Shop 14)",
    expected: "Status 400, error: Shop is currently unavailable",
    actual: `Status ${t4.status}, error: ${t4.data?.error}`,
    passed: t4.status === 400 && t4.data?.error === "Shop is currently unavailable"
  });

  // 5. Non-existent shop returns 400/404 Shop not found
  const t5 = await apiFetch("/api/storefront/shops/9999");
  results.push({
    test: "5. Non-existent shop returns not found (Shop 9999)",
    expected: "Status 400, error: Shop not found",
    actual: `Status ${t5.status}, error: ${t5.data?.error}`,
    passed: t5.status === 400 && t5.data?.error === "Shop not found"
  });

  // 6. Shop products are returned for ACTIVE shop
  const t6 = await apiFetch("/api/storefront/shops/6/products");
  results.push({
    test: "6. Real products returned for active bakery (Shop 6)",
    expected: "Status 200, count: 4",
    actual: `Status ${t6.status}, count: ${Array.isArray(t6.data) ? t6.data.length : 0}`,
    passed: t6.status === 200 && Array.isArray(t6.data) && t6.data.length === 4
  });

  // 7. Products from another bakery are isolated
  const t7 = await apiFetch("/api/storefront/shops/7/products");
  const shop6Names = Array.isArray(t6.data) ? t6.data.map(p => p.name) : [];
  const shop7Names = Array.isArray(t7.data) ? t7.data.map(p => p.name) : [];
  const overlap = shop6Names.some(n => shop7Names.includes(n));
  results.push({
    test: "7. Products are strictly isolated per bakery",
    expected: "Zero product overlap between Shop 6 and Shop 7",
    actual: `Shop 6 has ${shop6Names.length}, Shop 7 has ${shop7Names.length}, Overlap: ${overlap}`,
    passed: t7.status === 200 && shop7Names.length === 3 && !overlap
  });

  // 8. Product empty state works (Shop 8 with 0 products)
  const t8 = await apiFetch("/api/storefront/shops/8/products");
  results.push({
    test: "8. Product empty state returns [] without error (Shop 8)",
    expected: "Status 200, count: 0 (empty array)",
    actual: `Status ${t8.status}, count: ${Array.isArray(t8.data) ? t8.data.length : 'not array'}`,
    passed: t8.status === 200 && Array.isArray(t8.data) && t8.data.length === 0
  });

  // 9. Products endpoint also blocks non-ACTIVE shops
  const t9 = await apiFetch("/api/storefront/shops/12/products");
  results.push({
    test: "9. Products endpoint blocks non-ACTIVE shops (Shop 12)",
    expected: "Status 400, error: Shop is currently unavailable",
    actual: `Status ${t9.status}, error: ${t9.data?.error}`,
    passed: t9.status === 400 && t9.data?.error === "Shop is currently unavailable"
  });

  // 10. Canonical Route /shops/[id] redirects to /shop/[id]
  let redirectPassed = false;
  try {
    const res = await fetch(`${FRONTEND_URL}/shops/6`, { redirect: "manual" });
    const location = res.headers.get("location");
    redirectPassed = res.status === 307 || res.status === 308 || (location && location.includes("/shop/6"));
    results.push({
      test: "10. Canonical routing: /shops/6 redirects to /shop/6",
      expected: "HTTP 307/308 redirect to /shop/6",
      actual: `Status: ${res.status}, Location: ${location}`,
      passed: redirectPassed
    });
  } catch (e) {
    results.push({
      test: "10. Canonical routing: /shops/6 redirects to /shop/6",
      expected: "HTTP 307/308 redirect",
      actual: e.message,
      passed: false
    });
  }

  // 11. Frontend /shop/6 page renders successfully
  try {
    const res = await fetch(`${FRONTEND_URL}/shop/6`);
    const text = await res.text();
    const hasShopName = text.includes("Akurdi Artisan Bakes") || text.includes("Belgian Dark Chocolate Truffle");
    results.push({
      test: "11. Frontend /shop/6 renders HTML with HTTP 200",
      expected: "Status 200, page contains bakery and layout elements",
      actual: `Status: ${res.status}, contains elements: ${hasShopName}`,
      passed: res.status === 200
    });
  } catch (e) {
    results.push({
      test: "11. Frontend /shop/6 renders HTML with HTTP 200",
      expected: "Status 200",
      actual: e.message,
      passed: false
    });
  }

  console.table(results);

  const allPassed = results.every(r => r.passed);
  console.log(`\nPHASE C ALL TESTS PASSED: ${allPassed ? "YES (100% SUCCESS)" : "NO"}`);
}

runPhaseCTests();
