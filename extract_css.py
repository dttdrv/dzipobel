from bs4 import BeautifulSoup
import urllib.request
import os

def extract_css(html_file, prefix):
    with open(html_file, "r", encoding="utf-8") as f:
        html = f.read()

    soup = BeautifulSoup(html, "html.parser")
    for i, link in enumerate(soup.find_all("link", rel="stylesheet")):
        href = link.get("href")
        if href:
            url = "https://dzipobel.wiki" + href
            filename = f"scratch/{prefix}_{href.split('/')[-1]}"
            print(f"Downloading {url} to {filename}")
            try:
                urllib.request.urlretrieve(url, filename)
            except Exception as e:
                print(e)

    with open(f"scratch/{prefix}_inline.css", "w", encoding="utf-8") as f:
        for style in soup.find_all("style"):
            if style.string:
                f.write(style.string + "\n")

if not os.path.exists("scratch"):
    os.makedirs("scratch")

extract_css("home_raw.html", "home")
extract_css("vyara_raw.html", "vyara")
