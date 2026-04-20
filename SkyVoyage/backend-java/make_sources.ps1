$files = Get-ChildItem -Path "src" -Recurse -Filter "*.java" | Select-Object -ExpandProperty FullName
$lines = $files | ForEach-Object { '"' + $_.Replace('\', '/') + '"' }
$content = $lines -join "`n"
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText("$PWD\sources_lf.txt", ($content + "`n"), $utf8NoBom)
Write-Host "Done. sources_lf.txt written."
