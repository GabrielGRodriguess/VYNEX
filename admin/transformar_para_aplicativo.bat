@echo off
echo ========================================================
echo PREPARANDO O SEU APLICATIVO PARA TRANSFORMAR EM ANDROID
echo ========================================================
echo.
echo 1. Instalando o Capacitor (isso pode demorar uns minutos)...
call npm install @capacitor/core
call npm install -D @capacitor/cli

echo.
echo 2. Inicializando as configuracoes do Capacitor...
call npx cap init "SOS servicos" com.sosservicos.app --web-dir dist

echo.
echo 3. Gerando a versao final do site...
call npm run build

echo.
echo 4. Instalando a base do Android...
call npm install @capacitor/android
call npx cap add android

echo.
echo 5. Sincronizando o projeto...
call npx cap sync

echo.
echo ========================================================
echo PRONTO! AS CONFIGURACOES INICIAIS FORAM CONCLUIDAS!
echo Agora voce tem uma pasta 'android' no seu projeto.
echo.
echo O PROXIMO PASSO E ABRIR ESTA PASTA NO 'ANDROID STUDIO',
echo DE ACORDO COM O PASSO A PASSO NA TELA.
echo ========================================================
pause
