const API = "http://localhost:8080";

async function runTests() {
  console.log("=== Testing Backend Product Detail & Enquiry Endpoints ===");

  // 1. Valid Product Detail
  const p1 = await fetch(`${API}/api/storefront/shops/6/products/17`);
  const p1Data = await p1.json();
  console.log("1. Valid Product Detail (Shop 6, Prod 17):", p1.status, p1Data.name === "Belgian Dark Chocolate Truffle" ? "PASS" : "FAIL");

  // 2. Cross-Shop Product Detail Mismatch
  const p2 = await fetch(`${API}/api/storefront/shops/6/products/21`);
  const p2Data = await p2.json();
  console.log("2. Cross-Shop Mismatch (Shop 6, Prod 21):", p2.status, p2Data.error === "Product does not belong to this bakery" ? "PASS" : "FAIL");

  // 3. Inactive Shop Product Detail
  const p3 = await fetch(`${API}/api/storefront/shops/13/products/17`);
  const p3Data = await p3.json();
  console.log("3. Inactive Shop Protection (Shop 13):", p3.status, p3Data.error === "Shop is currently unavailable" ? "PASS" : "FAIL");

  // 4. Valid Enquiry Submission
  const e1 = await fetch(`${API}/api/storefront/enquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      shopId: 6,
      productId: 17,
      customerName: "Kavita Rao",
      customerPhone: "+91 9123456780",
      customerEmail: "kavita@example.com",
      quantity: 1,
      preferredDate: "2026-09-12",
      message: "Can you provide eggless option?"
    })
  });
  const e1Data = await e1.json();
  console.log("4. Valid Enquiry Submission:", e1.status, e1Data.id ? "PASS" : "FAIL");

  // 5. Inactive Shop Enquiry Rejection
  const e2 = await fetch(`${API}/api/storefront/enquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      shopId: 13,
      productId: 17,
      customerName: "Kavita Rao",
      customerPhone: "+91 9123456780",
      customerEmail: "kavita@example.com"
    })
  });
  const e2Data = await e2.json();
  console.log("5. Inactive Shop Enquiry Rejection:", e2.status, e2Data.error === "Shop is currently unavailable" ? "PASS" : "FAIL");

  // 6. Product/Shop Mismatch Enquiry Rejection
  const e3 = await fetch(`${API}/api/storefront/enquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      shopId: 6,
      productId: 21,
      customerName: "Kavita Rao",
      customerPhone: "+91 9123456780",
      customerEmail: "kavita@example.com"
    })
  });
  const e3Data = await e3.json();
  console.log("6. Product/Shop Mismatch Enquiry:", e3.status, e3Data.error === "Product does not belong to this bakery" ? "PASS" : "FAIL");

  // 7. Non-existent Product Enquiry Rejection
  const e4 = await fetch(`${API}/api/storefront/enquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      shopId: 6,
      productId: 9999,
      customerName: "Kavita Rao",
      customerPhone: "+91 9123456780",
      customerEmail: "kavita@example.com"
    })
  });
  const e4Data = await e4.json();
  console.log("7. Non-existent Product Enquiry:", e4.status, e4Data.error === "Product not found" ? "PASS" : "FAIL");

  // 8. Validation Rejection (Missing Phone & Invalid Email)
  const e5 = await fetch(`${API}/api/storefront/enquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      shopId: 6,
      productId: 17,
      customerName: "Kavita Rao",
      customerPhone: "",
      customerEmail: "invalid-email"
    })
  });
  console.log("8. Validation Error Rejection:", e5.status === 400 ? "PASS (Status 400)" : "FAIL");
}

runTests();
