@echo off
echo ==========================================================
echo EXPORTANDO O "SOS SERVICOS" PARA A PLAY STORE
echo ==========================================================
echo.
echo Este script vai mandar todo o seu codigo do aplicativo
echo pronto para a fabrica da Expo para gerar o instalador!
echo.
echo ----------------------------------------------------
echo PASSO 1: Faca o Login! 
echo Digite abaixo o email/usuario e a senha que voce criou
echo no site da Expo (a senha fica invisivel ao digitar):
echo.
call npx eas-cli login

echo.
echo ----------------------------------------------------
echo PASSO 2: Mandando para a Fabrica
echo Quando ele fizer perguntas em ingles, pressione Y e depois Enter!
echo.
call npx eas-cli build -p android

echo.
echo ==========================================================
echo Processo Concluido!
echo Se tudo deu certo, ele gerou um link no final.
echo Basta copiar aquele link, abrir no seu navegador e baixar
echo o seu arquivo do aplicativo quando ele chegar em 100%!
echo ==========================================================
pause
