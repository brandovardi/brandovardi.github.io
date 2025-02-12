def main():
    import subprocess
    import sys
    
    video_url = sys.argv[1]
    command = f"./yt-dlp -f bestaudio[ext=m4a] -o \"./%(title)s.%(ext)s\" {video_url}"

    subprocess.run(command)

if __name__ == "__main__":
    main()
