#!/usr/bin/env python3
"""Print the bracket-highlighting class -> color-index cycle.

Mirrors monaco's two stacked modulo operations:
  class      = level % 30                       (getInlineClassNameOfLevel)
  colorIndex = class % pool                     (the emitted CSS rules)

Usage:
  python3 print_bracket_cycle.py            # pool 3 (monaco default)
  python3 print_bracket_cycle.py 4          # pool size 4
  python3 print_bracket_cycle.py 4 "#ff00ff" "#da70d6" "#179fff" "#123456"
  python3 print_bracket_cycle.py 4 --depth 60   # also show the wrap seam
"""

import sys

LEVEL_COUNT = 30  # monaco emits .bracket-highlighting-0..29


def main(argv):
    pool = 4
    colors = None
    depth = LEVEL_COUNT
    for level in range(depth):
        cls = level % pool
        print(f"  depth {level:>2}  class {cls:>2}")


if __name__ == "__main__":
    main(sys.argv[1:])
