# Ejecutar como Administrador en PowerShell de Windows
# Configura el reenvio de puertos WSL -> Windows para Expo (Metro Bundler)

$wslIp = (wsl hostname -I).Trim().Split(" ")[0]
$port = 8081

Write-Host "IP de WSL detectada: $wslIp" -ForegroundColor Cyan

# Eliminar regla anterior si existe
netsh interface portproxy delete v4tov4 listenport=$port listenaddress=0.0.0.0 2>$null

# Crear reenvio de puertos: cualquier IP de Windows -> IP interna WSL
netsh interface portproxy add v4tov4 listenport=$port listenaddress=0.0.0.0 connectport=$port connectaddress=$wslIp

Write-Host "Reenvio de puertos configurado: 0.0.0.0:$port -> ${wslIp}:$port" -ForegroundColor Green

# Eliminar regla de firewall anterior si existe
Remove-NetFirewallRule -DisplayName "Expo Metro WSL" -ErrorAction SilentlyContinue

# Abrir puerto en el firewall de Windows
New-NetFirewallRule -DisplayName "Expo Metro WSL" -Direction Inbound -Action Allow -Protocol TCP -LocalPort $port

Write-Host "Firewall abierto para el puerto $port" -ForegroundColor Green
Write-Host ""
Write-Host "Ahora en WSL ejecuta: npm start" -ForegroundColor Yellow
Write-Host "Y conectate desde el movil a: exp://192.168.1.236:8081" -ForegroundColor Yellow
