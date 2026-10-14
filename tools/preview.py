#!/usr/bin/env python3
"""Build the page and open it locally.

The page file has no <!doctype>, <html>, <head> or <body> tags on purpose (the artifact host
adds them at publish time). tools/build.py writes preview/index.html with a proper skeleton.

Usage:  python3 tools/preview.py            -> rebuild preview/index.html
        python3 tools/preview.py --open     -> also open it in your default browser
"""
import pathlib, subprocess, sys, webbrowser

ROOT = pathlib.Path(__file__).resolve().parent.parent

if __name__ == "__main__":
    r = subprocess.run([sys.executable, str(ROOT / "tools" / "build.py")])
    out = ROOT / "preview" / "index.html"
    if r.returncode == 0 and "--open" in sys.argv:
        webbrowser.open(out.as_uri())
    sys.exit(r.returncode)
