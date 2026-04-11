# Script de Ajuda - SOS Guararapes
# Execute este script no PowerShell para gerenciar seu projeto.

function Show-Menu {
    Clear-Host
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "   SISTEMA GUIA DA CIDADE - MANAGEMENT" -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "1. Instalar Dependências (npm install)"
    Write-Host "2. Iniciar Projeto (npm run dev)"
    Write-Host "3. Gerar ZIP para ChatGPT (Projeto Limpo)"
    Write-Host "4. Sair"
    Write-Host "=========================================="
}

while ($true) {
    Show-Menu
    $choice = Read-Host "Escolha uma opção"

    switch ($choice) {
        "1" {
            Write-Host "Instalando dependências na pasta admin..." -ForegroundColor Yellow
            cd admin
            npm install
            cd ..
            Write-Host "Instalação concluída!" -ForegroundColor Green
            Pause
        }
        "2" {
            Write-Host "Iniciando servidor Vite..." -ForegroundColor Yellow
            cd admin
            npm run dev
        }
        "3" {
            Write-Host "Gerando ZIP comprimido..." -ForegroundColor Yellow
            $dest = "guia-da-cidade-completo.zip"
            if (Test-Path $dest) { Remove-Item $dest }
            
            # Comprime ignorando node_modules para ficar leve
            Compress-Archive -Path "admin", "supabase", "README.md" -DestinationPath $dest -Force
            
            Write-Host "Pronto! O arquivo $dest foi criado na raiz." -ForegroundColor Green
            Write-Host "Agora você pode enviar este arquivo para o ChatGPT." -ForegroundColor Cyan
            Pause
        }
        "4" { exit }
        Default { Write-Host "Opção inválida!" -ForegroundColor Red; Pause }
    }
}
