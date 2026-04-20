$body = '{"email":"admin@skyvoyage.com","password":"skyvoyage2026"}'
$r = Invoke-WebRequest -Uri 'http://localhost:8080/api/auth/login' -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing
Write-Host "Status: $($r.StatusCode)"
Write-Host "Body: $($r.Content)"
