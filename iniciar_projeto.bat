@echo off
color 0e
echo ========================================================
echo INICIANDO O SISTEMA SOS SERVICOS
echo ========================================================
echo.
echo As telas pretas vao instalar os requisitos e iniciar os sites.
echo IMPORTANTE: Nao feche as duas telas pretas que vao se abrir!
echo.

echo Iniciando Painel Admin (Aguarde alguns segundos)...
start cmd /k "color 0a && echo INICIANDO PAINEL ADMIN... && cd admin && echo Instalando dependencias do ADMIN... && call npm install && echo Ligando servidor ADMIN... && call npm run dev && color 0c && echo ======================================== && echo  [!] O SERVIDOR CAIU OU DEU ERRO! && echo  [!] TIRE UM PRINT DESTA TELA PRETA. && echo ======================================== && pause"

echo Iniciando App do Usuario (Aguarde alguns segundos)...
start cmd /k "color 0b && echo INICIANDO APP DO USUARIO... && cd mobile && echo Instalando dependencias do MOBILE... && call npm install && echo Ligando servidor MOBILE... && call npx expo start --web && color 0c && echo ======================================== && echo  [!] O SERVIDOR CAIU OU DEU ERRO! && echo  [!] TIRE UM PRINT DESTA TELA PRETA. && echo ======================================== && pause"

echo.
echo Pronto! Os comandos foram enviados.
echo Fique de olho nas DUAS TELAS PRETAS que abriram.
echo Se aparecer texto vermelho ou alguma delas disser "O SERVIDOR CAIU OU DEU ERRO", tire um print dela e me mande aqui!
echo.
pause
