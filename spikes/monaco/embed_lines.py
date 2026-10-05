#!/usr/bin/env python3
"""Rewrite the iframeHtmlMonaco constant in src/main.jsx as an array of
JSON-escaped lines joined with "\n", sourced from embedded.html.

Usage: python3 embed_lines.py
"""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SOURCE_HTML = ROOT / "embedded.html"
MAIN_JSX = ROOT / "src" / "main.jsx"
CONSTANT = "iframeHtmlMonaco"
START_MARKER = f"const {CONSTANT} = "
END_MARKER = "\n\ncreateRoot"


def to_lines(text: str) -> list[str]:
    lines = text.split("\n")
    had_trailing_newline = bool(lines) and lines[-1] == ""
    if had_trailing_newline:
        lines.pop()
    return lines + [""] if had_trailing_newline else lines


def build_constant(lines: list[str]) -> str:
    elements = "".join(f"  {json.dumps(line, ensure_ascii=False)},\n" for line in lines)
    return f"{START_MARKER}[\n{elements}].join(\"\\n\");"


def main() -> None:
    lines = to_lines(SOURCE_HTML.read_text())
    source = MAIN_JSX.read_text()
    start = source.index(START_MARKER)
    end = source.index(END_MARKER)
    MAIN_JSX.write_text(source[:start] + build_constant(lines) + source[end:])
    print(f"{len(lines)} lines -> {CONSTANT} in {MAIN_JSX}")


if __name__ == "__main__":
    main()
