// test_frontend_fetch.mjs - Verifies frontend fetchShops and backend integration

const API_BASE_URL = "http://localhost:8080";

function isAllFilterOption(value) {
  if (!value) return true;
  const lower = value.trim().toLowerCase();
  return lower === "all" || lower.startsWith("all ");
}

async function apiClient(endpoint) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    throw new Error(`API Error (${response.status})`);
  }
  return await response.json();
}

async function fetchShops(filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.state && !isAllFilterOption(filters.state)) params.append("state", filters.state.trim());
    if (filters.district && !isAllFilterOption(filters.district)) params.append("district", filters.district.trim());
    if (filters.city && !isAllFilterOption(filters.city)) params.append("city", filters.city.trim());
    if (filters.area && !isAllFilterOption(filters.area)) params.append("area", filters.area.trim());
    if (filters.businessType && !isAllFilterOption(filters.businessType)) params.append("businessType", filters.businessType.trim());
    if (filters.search && filters.search.trim()) params.append("search", filters.search.trim());
    if (filters.location && filters.location.trim()) params.append("location", filters.location.trim());

    const queryString = params.toString();
    const endpoint = `/api/storefront/shops/search${queryString ? `?${queryString}` : ""}`;
    const liveShops = await apiClient(endpoint);

    if (Array.isArray(liveShops)) {
      return {
        data: liveShops,
        isFromBackend: true,
      };
    }
  } catch (err) {
    return {
      data: [{ mock: true, businessName: "Mock Bakery" }],
      isFromBackend: false,
      error: err.message,
    };
  }
}

async function runTests() {
  console.log("==========================================");
  console.log("CakeStore Frontend Integration Verification");
  console.log("==========================================\n");

  const results = [];

  // Test 1: Fetch without filters
  const t1 = await fetchShops({});
  const isUsingMock1 = t1.data.some(d => d.mock === true);
  results.push({
    test: "1. Real Backend Call (No Mock)",
    expected: "isFromBackend: true, mock: false, count >= 8",
    actual: `isFromBackend: ${t1.isFromBackend}, mock: ${isUsingMock1}, count: ${t1.data.length}`,
    passed: t1.isFromBackend === true && !isUsingMock1 && t1.data.length >= 8
  });

  // Test 2: Valid query with 0 results
  const t2 = await fetchShops({ city: "NonExistentCity99" });
  results.push({
    test: "2. Zero-result Query returns empty array (not mock)",
    expected: "isFromBackend: true, count: 0",
    actual: `isFromBackend: ${t2.isFromBackend}, count: ${t2.data.length}`,
    passed: t2.isFromBackend === true && t2.data.length === 0
  });

  // Test 3: Cascading State -> District -> City -> Area
  const t3 = await fetchShops({
    state: "Maharashtra",
    district: "Pune",
    city: "Pimpri-Chinchwad",
    area: "Akurdi"
  });
  const allMatch3 = t3.data.every(s => s.state === "Maharashtra" && s.city === "Pimpri-Chinchwad" && s.area === "Akurdi");
  results.push({
    test: "3. Cascading Location: MH -> Pune -> Pimpri-Chinchwad -> Akurdi",
    expected: "All shops in Akurdi, Pimpri-Chinchwad",
    actual: `count: ${t3.data.length}, matches: ${allMatch3}`,
    passed: t3.data.length >= 1 && allMatch3
  });

  // Test 4: Business Type Filtering - HOME_BAKERY
  const t4 = await fetchShops({ businessType: "HOME_BAKERY" });
  const allHome = t4.data.every(s => s.businessType === "HOME_BAKERY");
  results.push({
    test: "4. Business Type: HOME_BAKERY",
    expected: "Only HOME_BAKERY",
    actual: `count: ${t4.data.length}, all HOME_BAKERY: ${allHome}`,
    passed: t4.data.length >= 1 && allHome
  });

  // Test 5: Business Type Filtering - CAKE_STUDIO
  const t5 = await fetchShops({ businessType: "CAKE_STUDIO" });
  const allStudio = t5.data.every(s => s.businessType === "CAKE_STUDIO");
  results.push({
    test: "5. Business Type: CAKE_STUDIO",
    expected: "Only CAKE_STUDIO",
    actual: `count: ${t5.data.length}, all CAKE_STUDIO: ${allStudio}`,
    passed: t5.data.length >= 1 && allStudio
  });

  // Test 6: Business Type Filtering - BAKERY_SHOP
  const t6 = await fetchShops({ businessType: "BAKERY_SHOP" });
  const allShop = t6.data.every(s => s.businessType === "BAKERY_SHOP");
  results.push({
    test: "6. Business Type: BAKERY_SHOP",
    expected: "Only BAKERY_SHOP",
    actual: `count: ${t6.data.length}, all BAKERY_SHOP: ${allShop}`,
    passed: t6.data.length >= 1 && allShop
  });

  // Test 7: Business Type Filtering - ONLINE_CAKE_BUSINESS
  const t7 = await fetchShops({ businessType: "ONLINE_CAKE_BUSINESS" });
  const allOnline = t7.data.every(s => s.businessType === "ONLINE_CAKE_BUSINESS");
  results.push({
    test: "7. Business Type: ONLINE_CAKE_BUSINESS",
    expected: "Only ONLINE_CAKE_BUSINESS",
    actual: `count: ${t7.data.length}, all ONLINE: ${allOnline}`,
    passed: t7.data.length >= 1 && allOnline
  });

  // Test 8: Keyword search
  const t8 = await fetchShops({ search: "chocolate" });
  const hasMatch8 = t8.data.some(s => s.description.toLowerCase().includes("chocolate") || s.businessName.toLowerCase().includes("chocolate"));
  results.push({
    test: "8. Keyword Search: 'chocolate'",
    expected: "Shops matching 'chocolate'",
    actual: `count: ${t8.data.length}, matchFound: ${hasMatch8}`,
    passed: t8.data.length >= 1 && hasMatch8
  });

  // Test 9: Active-only enforcement (verify no non-active shops returned)
  const t9 = await fetchShops({});
  const hasExcludedShops = t9.data.some(s => 
    s.businessName.includes("Pending") || 
    s.businessName.includes("Inactive") || 
    s.businessName.includes("Suspended")
  );
  results.push({
    test: "9. Exclusion of Non-Active Shops (PENDING, INACTIVE, SUSPENDED)",
    expected: "Excluded shops NOT present",
    actual: `hasExcludedShops: ${hasExcludedShops}`,
    passed: !hasExcludedShops
  });

  console.table(results);

  const allPassed = results.every(r => r.passed);
  console.log("\nALL TESTS PASSED:", allPassed ? "YES (100% SUCCESS)" : "NO");
}

runTests();
