$dir = "C:\Users\Jaoce\OneDrive\Documents\Portfolio contents\landingpage-demo"
$server = Start-Process -FilePath "cmd.exe" -ArgumentList "/c npm run start" -WorkingDirectory $dir -PassThru -NoNewWindow
Start-Sleep -Seconds 8
try {
  & npm run qa:construction
} finally {
  Stop-Process -Id $server.Id -Force -ErrorAction SilentlyContinue
}
Remove-Item $PSCommandPath -Force
