#!/usr/bin/env python3
"""Smoke-test the whole game in a headless browser.

What it does
  1. Builds the page (tools/build.py), including a JS syntax check.
  2. Opens it at desktop (1280 px) and phone (400 px) widths.
  3. Auto-plays every level from start to finish at desktop width (clicks through lines, picks answers,
     closes toys) and fails on any JavaScript error. At phone width it screenshots each level's first scene.
  4. Opens every toy, the textbook, the floor plan, the time machine, the sticker book and settings,
     checks for sideways scrolling, and saves screenshots to shots/.

Requires:  pip install playwright && python3 -m playwright install chromium
Usage:     python3 tools/check.py                -> everything
           python3 tools/check.py 3,4,13         -> only these levels
"""
import asyncio, os, pathlib, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PREVIEW = ROOT / "preview" / "index.html"
SHOTS = ROOT / "shots"

AUTOPLAY = """
window.__errs=[];
window.addEventListener('error',e=>__errs.push(String(e.message)+' @'+(e.filename||'')+':'+e.lineno));
const _ce=console.error;console.error=(...a)=>{__errs.push('console.error: '+a.map(x=>x&&x.message?x.message:String(x)).join(' '));_ce.apply(console,a)};
window.autoplay=async(idx,maxMs=40000)=>{
  G.set.speed='instant';G.name=G.name||'Tester';UI.showGame();VN.start(idx);const t0=performance.now();
  while(performance.now()-t0<maxMs){await sleep(35);
    if(document.querySelector('.lvlcomplete .lvlcard'))return{ok:true,ms:Math.round(performance.now()-t0)};
    if(Win.current){Win.close();continue}
    const qc=document.querySelector('.quizcard');
    if(qc){const nb=[...qc.querySelectorAll('.btn')].find(b=>!b.hidden&&b.textContent.includes('Got it'));if(nb){nb.click();continue}
      const o=[...qc.querySelectorAll('.opt:not([disabled])')];if(o.length)o[0].click();continue}
    const ch=document.querySelector('#choices:not([hidden]) .btn');if(ch){ch.click();continue}
    const hb=document.querySelector('#hots');
    if(hb&&getComputedStyle(hb).pointerEvents!=='none'){const hot=hb.querySelector('.hot:not(.done)');if(hot){hot.click();await sleep(20);continue}}
    if(VN.typing)VN.advance();else if(VN.waiter)VN.advance();
  }
  return{ok:false,at:VN.i};
};
0;
"""

async def run(levels):
    from playwright.async_api import async_playwright
    SHOTS.mkdir(exist_ok=True)
    ok = True
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        for width, height in [(1280, 860), (400, 860)]:
            pg = await browser.new_page(viewport={"width": width, "height": height})
            if not os.environ.get("CHECK_FONTS"):
                # Google Fonts can hang in sandboxes; fall back to system fonts unless CHECK_FONTS=1
                await pg.route("**/*fonts.g*/**", lambda r: r.abort())
            await pg.goto(PREVIEW.as_uri(), wait_until="load")
            await pg.wait_for_timeout(600)
            await pg.evaluate(AUTOPLAY)
            await pg.screenshot(path=str(SHOTS / f"{width}-title.png"))
            n_levels = await pg.evaluate("LEVELS.length")
            for i in (levels or range(n_levels)):
                title = await pg.evaluate(f"LEVELS[{i}].title")
                if width >= 1000:  # play every level start to finish once, at desktop width
                    res = await pg.evaluate(f"autoplay({i})")
                    print(f"{width}px level {i:>2} {title:<22} {'OK' if res['ok'] else 'STUCK at beat ' + str(res.get('at'))}")
                    ok &= res["ok"]
                # a screenshot of the first scene of the level, with the first line showing
                await pg.evaluate(f"(async()=>{{VN.stopAll();G.set.speed='instant';UI.showGame();VN.start({i});await sleep(1200);VN.advance();await sleep(500)}})()")
                await pg.wait_for_timeout(1400)
                await pg.screenshot(path=str(SHOTS / f"{width}-level{i:02d}.png"))
            # every toy, the book and the utility windows
            toys = await pg.evaluate("Object.keys(TOYS)")
            for t in toys:
                await pg.evaluate(f"(()=>{{VN.stopAll();VN.active=false;UI.openToy('{t}')}})()")
                await pg.wait_for_timeout(350)
                sw = await pg.evaluate("document.documentElement.scrollWidth")
                inner = await pg.evaluate("(()=>{const b=document.querySelector('.vwin .wbody');return b?b.scrollWidth-b.clientWidth:0})()")
                bad = sw > width or inner > 2
                ok &= not bad
                print(f"{width}px toy {t:<12} scrollWidth={sw} inner={inner}{'  <-- sideways scroll' if bad else ''}")
                if t in ("attention", "scaling", "cracker", "memo", "run3d"):
                    await pg.screenshot(path=str(SHOTS / f"{width}-toy-{t}.png"))
                await pg.evaluate("Win.close(true)")
            for name, js in [("book", "UI.openBook('attention',2)"), ("hub", "UI.openHub()"), ("time", "UI.openTime()"), ("stickers", "UI.openStickers()"), ("settings", "UI.openSettings()")]:
                await pg.evaluate(js)
                await pg.wait_for_timeout(500)
                sw = await pg.evaluate("document.documentElement.scrollWidth")
                ok &= sw <= width
                print(f"{width}px {name:<9} scrollWidth={sw}{'' if sw <= width else '  <-- sideways scroll'}")
                await pg.screenshot(path=str(SHOTS / f"{width}-{name}.png"))
                await pg.evaluate("Win.close(true)")
            errs = await pg.evaluate("window.__errs")
            errs = [e for e in errs if "Failed to load resource" not in e]
            if errs:
                ok = False
                print(f"{width}px JavaScript errors:", *errs, sep="\n  ")
            await pg.close()
        await browser.close()
    return ok

if __name__ == "__main__":
    sys.stdout.reconfigure(line_buffering=True)
    r = subprocess.run([sys.executable, str(ROOT / "tools" / "build.py")])
    if r.returncode:
        sys.exit("build failed")
    levels = [int(x) for x in sys.argv[1].split(",")] if len(sys.argv) > 1 else None
    good = asyncio.run(run(levels))
    print("ALL GOOD" if good else "PROBLEMS FOUND")
    sys.exit(0 if good else 1)
