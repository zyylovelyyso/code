import os
import subprocess

def extract_all_rar(folder_path):
    # WinRAR可执行文件路径（默认安装路径，若安装位置不同需修改）
    winrar_path = r"E:\WinRAR\WinRAR.exe"
    
    # 支持的压缩文件扩展名（可根据需要添加）
    supported_extensions = ('.rar', '.zip', '.7z', '.tar', '.gz', '.bz2', '.iso')
    
    # 检查WinRAR是否存在
    if not os.path.exists(winrar_path):
        print(f"错误：未找到WinRAR程序，请检查路径是否正确：{winrar_path}")
        return
    
    # 检查目标文件夹是否存在
    if not os.path.isdir(folder_path):
        print(f"错误：目标文件夹不存在：{folder_path}")
        return
    
    # 遍历文件夹内所有文件
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        
        # 跳过子文件夹，只处理文件
        if not os.path.isfile(file_path):
            continue
        
        # 检查文件扩展名是否在支持列表中
        if filename.lower().endswith(supported_extensions):
            print(f"\n开始解压：{filename}")
            
            # {{ 添加独立文件夹解压逻辑 }}
            # 创建与压缩包同名的文件夹（去除扩展名）
            folder_name = os.path.splitext(filename)[0]  # 获取不带扩展名的文件名
            extract_path = os.path.join(folder_path, folder_name)  # 完整解压路径
            
            # 确保解压文件夹存在
            os.makedirs(extract_path, exist_ok=True)
            
            # WinRAR解压命令：x表示保留路径，-y自动确认，-r递归解压子文件夹
            command = [
                winrar_path,
                "x",          # 解压命令（保留原始目录结构）
                "-y",         # 自动确认所有操作
                "-r",         # 递归解压所有子文件夹
                file_path,    # 压缩包路径
                f"{extract_path}\\"  # 解压到独立文件夹
            ]
            
            try:
                # 执行解压命令
                result = subprocess.run(
                    command,
                    check=True,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True
                )
                print(f"解压成功：{filename}")
            except subprocess.CalledProcessError as e:
                print(f"解压失败：{filename}，错误信息：{e.stderr}")
            except Exception as e:
                print(f"处理文件时出错：{filename}，错误：{str(e)}")
    
    print("\n批量解压操作完成！")

# --------------------------
# 用户需要修改的部分
# --------------------------
# 设置包含压缩包的文件夹路径（例如："D:/我的压缩包"）
target_folder = r"D:\BaiduNetdiskDownload\工具包"  # <-- 这里替换为你的文件夹路径
# --------------------------

# 执行解压函数
if __name__ == "__main__":
    extract_all_rar(target_folder)