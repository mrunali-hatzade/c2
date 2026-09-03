$base = 'http://localhost:8080/api/storefront/shops/search'

function Test-Query($name, $url, [scriptblock]$validate) {
    $raw = curl.exe -s "$url"
    $res = $raw | ConvertFrom-Json
    $count = if ($res -is [array]) { $res.Count } elseif ($res) { 1 } else { 0 }
    $ok = & $validate $res
    [PSCustomObject]@{
        Test = $name
        Count = $count
        Passed = $ok
    }
}

$tests = @(
    (Test-Query 'All Active (No filters)' $base { param($r) $r.Count -ge 6 }),
    (Test-Query 'State=Maharashtra' "$base`?state=Maharashtra" { param($r) ($r | Where-Object { $_.state -ne 'Maharashtra' }).Count -eq 0 }),
    (Test-Query 'District=Pune' "$base`?district=Pune" { param($r) ($r | Where-Object { $_.district -ne 'Pune' }).Count -eq 0 }),
    (Test-Query 'City=Pimpri-Chinchwad' "$base`?city=Pimpri-Chinchwad" { param($r) ($r | Where-Object { $_.city -ne 'Pimpri-Chinchwad' }).Count -eq 0 }),
    (Test-Query 'Area=Akurdi' "$base`?area=Akurdi" { param($r) ($r | Where-Object { $_.area -ne 'Akurdi' }).Count -eq 0 }),
    (Test-Query 'BusinessType=HOME_BAKERY' "$base`?businessType=HOME_BAKERY" { param($r) ($r | Where-Object { $_.businessType -ne 'HOME_BAKERY' }).Count -eq 0 }),
    (Test-Query 'BusinessType=CAKE_STUDIO' "$base`?businessType=CAKE_STUDIO" { param($r) ($r | Where-Object { $_.businessType -ne 'CAKE_STUDIO' }).Count -eq 0 }),
    (Test-Query 'BusinessType=BAKERY_SHOP' "$base`?businessType=BAKERY_SHOP" { param($r) ($r | Where-Object { $_.businessType -ne 'BAKERY_SHOP' }).Count -eq 0 }),
    (Test-Query 'BusinessType=ONLINE_CAKE_BUSINESS' "$base`?businessType=ONLINE_CAKE_BUSINESS" { param($r) ($r | Where-Object { $_.businessType -ne 'ONLINE_CAKE_BUSINESS' }).Count -eq 0 }),
    (Test-Query 'Combined Maharashtra/Pune/Pimpri-Chinchwad/Akurdi/HOME_BAKERY' "$base`?state=Maharashtra&district=Pune&city=Pimpri-Chinchwad&area=Akurdi&businessType=HOME_BAKERY" { param($r) $r.Count -ge 1 -and $r[0].businessName -eq 'Akurdi Artisan Bakes' }),
    (Test-Query 'Case-insensitive: maHaRasHtra & akURdi' "$base`?state=maHaRasHtra&area=akURdi" { param($r) $r.Count -ge 1 }),
    (Test-Query 'Search=chocolate' "$base`?search=chocolate" { param($r) $r.Count -ge 1 -and $r[0].description -match 'chocolate' }),
    (Test-Query 'Legacy location=Akurdi' "$base`?location=Akurdi" { param($r) $r.Count -ge 1 }),
    (Test-Query 'Zero results (city=NonExistent)' "$base`?city=NonExistent" { param($r) $r.Count -eq 0 }),
    (Test-Query 'Non-ACTIVE exclusion (Pending Baker Akurdi)' "$base`?area=Akurdi" { param($r) ($r | Where-Object { $_.businessName -eq 'Pending Baker Akurdi' }).Count -eq 0 }),
    (Test-Query 'Non-ACTIVE exclusion (Inactive Studio Baner)' "$base`?area=Baner" { param($r) ($r | Where-Object { $_.businessName -eq 'Inactive Studio Baner' }).Count -eq 0 }),
    (Test-Query 'Non-ACTIVE exclusion (Suspended Cakes Wakad)' "$base`?area=Wakad" { param($r) ($r | Where-Object { $_.businessName -eq 'Suspended Cakes Wakad' }).Count -eq 0 })
)

$tests | Format-Table -AutoSize
