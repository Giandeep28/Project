@echo off
setlocal
echo [SkyVoyage] Preparing build environment...
if not exist "out\production\backend-java" mkdir "out\production\backend-java"

echo [SkyVoyage] Scanning source files...
dir /s /b src\*.java > sources.txt

echo [SkyVoyage] Processing paths...
powershell -Command "(Get-Content sources.txt) | ForEach-Object { '\"' + $_.Replace('\', '/') + '\"' } | Set-Content sources_quoted.txt"

echo [SkyVoyage] Compiling Java sources...
javac -d out/production/backend-java @sources_quoted.txt

if %errorlevel% neq 0 (
    echo [ERROR] Compilation failed.
    pause
    exit /b %errorlevel%
)

echo [SkyVoyage] Starting Core Engine...
java -cp out/production/backend-java Main
pause
