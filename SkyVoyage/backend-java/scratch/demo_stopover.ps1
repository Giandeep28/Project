# Stopover Meal Feature Demonstration

Write-Host "--- 1. Starting SkyVoyage Core Engine ---" -ForegroundColor Cyan
# Start the server in the background if not already running
# We assume the user wants us to run it here.

Write-Host "`n--- 2. Pre-ordering a Meal (On-time Flight) ---" -ForegroundColor Cyan
$order1 = Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/stopover/order" -ContentType "application/json" -Body '{
    "bookingId": "BK-ONTIME",
    "flightNumber": "SV102",
    "stopoverAirport": "DXB",
    "deliveryTime": "2026-04-20T12:00:00Z",
    "items": [{"name": "Luxury Salmon", "quantity": 1}]
}'
$order1 | Format-Table

Write-Host "`n--- 3. Tracking the On-time Meal ---" -ForegroundColor Cyan
$track1 = Invoke-RestMethod -Method Get -Uri "http://localhost:8080/api/stopover/track?orderId=$($order1.orderId)"
$track1 | Select-Object orderId, flightNumber, status, createdAt | Format-Table

Write-Host "`n--- 4. Pre-ordering a Meal (Delayed Flight SV007) ---" -ForegroundColor Cyan
$order2 = Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/stopover/order" -ContentType "application/json" -Body '{
    "bookingId": "BK-DELAYED",
    "flightNumber": "SV007",
    "stopoverAirport": "SIN",
    "deliveryTime": "2026-04-20T20:00:00Z",
    "items": [{"name": "Sushi Platter", "quantity": 2}]
}'
$order2 | Format-Table

Write-Host "`n--- 5. Tracking the Delayed Meal (Auto-Cancellation Check) ---" -ForegroundColor Cyan
$track2 = Invoke-RestMethod -Method Get -Uri "http://localhost:8080/api/stopover/track?orderId=$($order2.orderId)"
$track2 | Select-Object orderId, flightNumber, status, cancellationReason | Format-List
