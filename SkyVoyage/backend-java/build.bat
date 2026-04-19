@echo off
dir /s /b src\*.java > sources.txt
powershell -Command "(Get-Content sources.txt) -apply { '\"' + $_ + '\"' } | Set-Content sources_quoted.txt"
powershell -Command "$content = Get-Content sources.txt; $quoted = foreach ($line in $content) { '\"' + $line + '\"' }; Set-Content sources_quoted.txt $quoted"
javac -d out/production/backend-java @sources_quoted.txt
java -cp out/production/backend-java Main
