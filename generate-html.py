
import glob
import os
import requests

URL = 'http://localhost/dev/html-scaffold/'

def main():
    files = glob.glob('*.php', recursive=False)
    for file in files:
        url = URL + file
        data = requests.get(url)
        filename = file.replace('.php', '.html')
        with open(filename, 'w') as f:
            f.write(data.text)
            print(f'{filename} generated')

if __name__ == '__main__':
    main()
