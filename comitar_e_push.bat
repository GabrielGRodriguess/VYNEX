@echo off
color 0b
echo ========================================================
2: echo ATUALIZANDO VYNEX NO GITHUB
3: echo ========================================================
4: echo.
5: 
6: echo Adicionando arquivos...
7: git add .
8: 
9: echo Fazendo commit...
10: git commit -m "feat: centralizacao de categorias, limites de excecao e melhorias no Nex"
11: 
12: echo Enviando para o GitHub...
13: git push origin main
14: 
15: echo.
16: echo ========================================================
17: echo PRONTO! Seu app foi atualizado no GitHub.
18: echo ========================================================
19: pause
