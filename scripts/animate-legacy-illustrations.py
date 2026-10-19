"""
Prepares the illustrations carried over from the old axonarbor.in site for the
new one: maps their colours onto the brand palette and embeds CSS animations
(which run even when the SVG is loaded through an <img> tag).

    python scripts/animate-legacy-illustrations.py <source-dir> public/illustrations
"""
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

SVG = "http://www.w3.org/2000/svg"
ET.register_namespace("", SVG)
Q = lambda tag: f"{{{SVG}}}{tag}"

COLOURS = {"#FAB803": "#FFC107", "#1A1423": "#000000", "#A1483A": "#000000", "#C9C9C9": "#DEDEDE"}

BASE_CSS = """
.a{transform-box:fill-box}
@keyframes breathe{50%{transform:scale(1.06) rotate(-2deg)}}
@keyframes sway{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
@keyframes bob{50%{transform:translateY(-26px)}}
@keyframes float{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-36px) rotate(4deg)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes wobble{0%,100%{transform:rotate(-14deg) scale(1)}50%{transform:rotate(14deg) scale(1.08)}}
@keyframes flash{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.25;transform:scale(.8)}}
@keyframes drift{0%{transform:translateY(-10px);opacity:0}30%,70%{opacity:1}100%{transform:translateY(16px);opacity:0}}
@keyframes kick{0%,100%{transform:rotate(-7deg)}50%{transform:rotate(7deg)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes dot{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-18px)}}
@keyframes pop{0%{transform:scale(0)}100%{transform:scale(1)}}
.breathe{transform-origin:50% 50%;animation:breathe 9s ease-in-out infinite}
.sway{transform-origin:50% 100%;animation:sway 4.5s ease-in-out infinite}
.sway-b{transform-origin:50% 100%;animation:sway 5.2s ease-in-out -2s infinite}
.bob{animation:bob 2.6s ease-in-out infinite}
.float{transform-origin:50% 50%;animation:float 6s ease-in-out infinite}
.float-b{transform-origin:50% 50%;animation:float 7s ease-in-out -3s infinite}
.wobble{transform-origin:50% 50%;animation:wobble 5s ease-in-out infinite}
.flash{transform-origin:50% 50%;animation:flash 1.8s ease-in-out infinite}
.drift{animation:drift 3.2s ease-in-out infinite}
.kick{transform-origin:20% 0%;animation:kick 2.6s ease-in-out infinite}
.blink{animation:blink 1.4s steps(2,jump-none) infinite}
.dot{animation:dot 1.4s ease-in-out infinite}
.dot:nth-child(2){animation-delay:.18s}.dot:nth-child(3){animation-delay:.36s}
.bubble{transform-origin:0% 100%;animation:pop .6s cubic-bezier(.34,1.56,.64,1) 1s both}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
"""

# For each file: (path of ids from the root, occurrence among same-id siblings, class).
PLANS = {
    "coffee-date": [
        (["Background", "Background/Blob 2"], 0, "breathe"),
        (["Window"], 0, "sway-b"),
        (["Decoration", "Decoration/Scribbles", "Fill-1"], 0, "wobble"),
        (["Decoration", "Decoration/Scribbles", "Combined-Shape"], 0, "flash"),
        (["Decoration", "Decoration/Scribbles", "Combined-Shape"], 1, "drift"),
        (["Master/Character/Sitting On Chair@0", "Master/Character/Sitting On Chair"], 0, "sway"),
        (["Master/Character/Sitting On Chair@1", "Master/Character/Sitting On Chair"], 0, "sway-b"),
    ],
    "designing": [
        (["Background", "Background/Blob 2"], 0, "breathe"),
        (["Decoration", "Decoration/Scribbles", "Fill-1"], 0, "wobble"),
        (["Decoration", "Decoration/Scribbles", "Combined-Shape"], 0, "flash"),
        (["Decoration", "Decoration/Scribbles", "Combined-Shape"], 1, "drift"),
        (["Drawings"], 0, "float"),
        (["Master/Character/Standing", "Master/Character/Standing"], 0, "bob"),
        (["Master/Character/Standing", "Master/Character/Standing", "Bottom/Standing", "Bottom/Standing/Leg up"], 0, "kick"),
    ],
    "presenting": [
        (["Background", "Background/Blob 4"], 0, "breathe"),
        (["Decoration", "Decoration/Nature 2", "Fill-1"], 0, "sway"),
        (["Decoration", "Decoration/Nature 2", "Fill-1"], 1, "sway-b"),
        (["Master/Character/Standing", "Master/Character/Standing"], 0, "sway"),
        (["Coding"], 0, "float-b"),
    ],
}

SOURCES = {"coffee-date": "cover.svg", "designing": "cta.svg", "presenting": "programs.svg"}


def find(root, ids, occurrence):
    """Walks down from the root <g>, matching ids level by level.

    An id may carry an "@n" suffix to pick the nth sibling with that id at that
    level; otherwise `occurrence` applies to the last level.
    """
    node = list(root)[0]  # the scene's top-level <g>
    for depth, ident in enumerate(ids):
        ident, _, nth = ident.partition("@")
        matches = [c for c in node if c.get("id") == ident]
        if not matches:
            raise LookupError(f"{ids} not found at {ident}")
        index = int(nth) if nth else (occurrence if depth == len(ids) - 1 else 0)
        node = matches[index]
    return node


def wrap(root, element, cls):
    parent = next(p for p in root.iter() if element in list(p))
    index = list(parent).index(element)
    wrapper = ET.Element(Q("g"), {"class": f"a {cls}"})
    parent.remove(element)
    wrapper.append(element)
    parent.insert(index, wrapper)


def speech_bubble(root):
    """Three bouncing dots between the two people: a conversation in progress."""
    bubble = ET.SubElement(root, Q("g"), {"class": "a bubble"})
    ET.SubElement(bubble, Q("path"), {
        "d": "M800 400 h180 a40 40 0 0 1 40 40 v20 a40 40 0 0 1 -40 40 h-120 l-40 34 v-34 h-20 a40 40 0 0 1 -40 -40 v-20 a40 40 0 0 1 40 -40 z",
        "fill": "#FFFFFF", "stroke": "#000000", "stroke-width": "6", "stroke-linejoin": "round",
    })
    dots = ET.SubElement(bubble, Q("g"))
    for x in (850, 890, 930):
        ET.SubElement(dots, Q("circle"), {"class": "a dot", "cx": str(x), "cy": "452", "r": "11", "fill": "#FFC107"})


def process(name, source, out_dir):
    text = source.read_text(encoding="utf8")
    for old, new in COLOURS.items():
        text = re.sub(old, new, text, flags=re.IGNORECASE)
    root = ET.fromstring(text)
    targets = [(find(root, ids, occ), cls) for ids, occ, cls in PLANS[name]]
    for element, cls in targets:
        wrap(root, element, cls)
    if name == "coffee-date":
        speech_bubble(root)
    style = ET.Element(Q("style"))
    style.text = BASE_CSS
    root.insert(0, style)
    root.attrib.pop("overflow", None)
    out = out_dir / f"{name}.svg"
    out.write_text(ET.tostring(root, encoding="unicode"), encoding="utf8")
    print(f"{out} {out.stat().st_size // 1024} KB")


if __name__ == "__main__":
    src, dst = Path(sys.argv[1]), Path(sys.argv[2])
    dst.mkdir(parents=True, exist_ok=True)
    for name, file in SOURCES.items():
        process(name, src / file, dst)
