@echo off

:: 护眼小助手启动器

echo 正在启动护眼小助手...

echo 建议使用现代浏览器(Chrome, Firefox, Edge)打开

:: 检查是否安装了Chrome
where chrome >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    start chrome index.html
    goto end
)

:: 检查是否安装了Edge
where msedge >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    start msedge index.html
    goto end
)

:: 检查是否安装了Firefox
where firefox >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    start firefox index.html
    goto end
)

:: 如果没有找到以上浏览器，使用默认浏览器
start index.html

:end
echo 护眼小助手已启动
pause