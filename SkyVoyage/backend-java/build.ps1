$sources = Get-ChildItem -Recurse -Filter *.java src | Select-Object -ExpandProperty FullName
javac -d out/production/backend-java $sources
java -cp out/production/backend-java Main
