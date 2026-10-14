#!/usr/bin/env python3
"""Build the single-file page the artifact host serves.

Sources live in src/. This inlines every CSS and JS file into src/template.html and writes
ai-pix-explorer.html (no <!doctype>, <html>, <head> or <body> tags: the host adds those).
It also writes preview/index.html, the same page wrapped in a skeleton for local viewing.

Usage:  python3 tools/build.py            -> build both files, run a JS syntax check if jsc exists
"""
import pathlib, re, subprocess, shutil, sys, tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
OUT = ROOT / "ai-pix-explorer.html"
PREVIEW = ROOT / "preview" / "index.html"
JSC = "/System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc"

SKELETON_HEAD = """<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<style>
:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
body{margin:0;font:14px system-ui,sans-serif;background:#fafaf7}
img{max-width:100%}
[hidden]{display:none!important}
</style>
</head><body>
"""

def cat(sub, pattern):
    files = sorted((SRC / sub).rglob(pattern))
    return "\n".join(f"/* ---- {f.relative_to(SRC)} ---- */\n{f.read_text(encoding='utf-8')}" for f in files), files

def syntax_check(js: str) -> bool:
    if not pathlib.Path(JSC).exists():
        print("jsc not found; skipping JS syntax check")
        return True
    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as f:
        f.write(js)
    harness = f'try{{new Function(read("{f.name}"));print("JS syntax: OK")}}catch(e){{print("JS syntax: FAILED "+e+" (line "+e.line+")")}}'
    r = subprocess.run([JSC, "-e", harness], capture_output=True, text=True)
    out = (r.stdout + r.stderr).strip()
    print(out)
    return "OK" in out

def main() -> int:
    css, cssf = cat("css", "*.css")
    js, jsf = cat("js", "*.js")
    tpl = (SRC / "template.html").read_text(encoding="utf-8")
    page = tpl.replace("/*{{CSS}}*/", css).replace("/*{{JS}}*/", js)
    if re.search(r"<(!doctype|html|head|body)\b", page, re.I):
        print("ERROR: the page must not contain <!doctype>, <html>, <head> or <body>")
        return 1
    OUT.write_text(page, encoding="utf-8")
    PREVIEW.parent.mkdir(exist_ok=True)
    PREVIEW.write_text(SKELETON_HEAD + page + "\n</body></html>\n", encoding="utf-8")
    print(f"built {OUT.name}: {len(page)/1024:.0f} KB, {len(cssf)} css + {len(jsf)} js files")
    return 0 if syntax_check(js) else 1

if __name__ == "__main__":
    sys.exit(main())
