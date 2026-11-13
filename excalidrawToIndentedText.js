/**
 * Convert Excalidraw clipboard text elements into aligned plain text,
 * laid out as a grid table (columns padded to equal width).
 *
 * @param {Array | { elements: Array }} clipboard
 *   Either the full excalidraw clipboard object (`{ type, elements, ... }`)
 *   or just its `elements` array.
 * @param {{ lineTolerance?: number, tablePad?: number }} [options]
 *   - lineTolerance: max |y - rowY| for an element to count as same row (default 1)
 *   - tablePad: spaces appended after each cell (default 2)
 * @returns {string} plain text, one line per row, trailing spaces trimmed
 */
function excalidrawToIndentedText(clipboard, options = {}) {
  const { lineTolerance = 1, tablePad = 2 } = options;

  const elements = Array.isArray(clipboard) ? clipboard : clipboard?.elements ?? [];

  // filter: text objects only (same as `texts` in the C++ version)
  const texts = elements
    .filter((el) => el && el.type === "text" && !el.isDeleted && typeof el.text === "string")
    .map((el) => ({ x: el.x, y: el.y, text: el.originalText ?? el.text }));

  if (texts.length === 0) {
    return "";
  }

  // unique y values, sorted ascending (like `set<int> ys`)
  const ys = [...new Set(texts.map((el) => el.y))].sort((a, b) => a - b);

  // grid dimensions
  let colCount = 0;
  const rowsOfY = ys.map((y) => {
    const row = texts
      .filter((el) => Math.abs(el.y - y) <= lineTolerance)
      .sort((a, b) => a.x - b.x); // left → right
    if (row.length > colCount) {
      colCount = row.length;
    }
    return row;
  });

  // fill the grid (empty cells where a row has fewer columns)
  const grid = rowsOfY.map((row) => {
    const cells = Array.from({ length: colCount }, () => "");
    row.forEach((el, idx) => {
      cells[idx] = el.text;
    });
    return cells;
  });

  // per-column max width
  const colWidths = Array.from({ length: colCount }, () => 0);
  for (let j = 0; j < colCount; j++) {
    for (let i = 0; i < grid.length; i++) {
      colWidths[j] = Math.max(colWidths[j], grid[i][j].length);
    }
  }

  // pad cells and join
  return grid
    .map((cells) =>
      cells
        .map((text, j) => text.padEnd(colWidths[j] + tablePad, " "))
        .join("")
        .replace(/\s+$/, ""), // trim trailing pad so lines don't carry whitespace
    )
    .join("\n");
}

module.exports = { excalidrawToIndentedText };

// --- demo with the sample clipboard -----------------------------------------
if (require.main === module) {
  const clipboard = {
    type: "excalidraw/clipboard",
    elements: [
      { id: "boPNwO0LW0NuiDE8xeVHO", type: "text", x: 7240, y: 760, text: "<div", isDeleted: false },
      { id: "EqoBWmA3PeZLWhpsSbvqq", type: "text", x: 7160, y: 720, text: "When", isDeleted: false },
      { id: "q_T8vq7-OuQ8kvjonrU0J", type: "text", x: 7320, y: 760, text: "<div></div>", isDeleted: false },
    ],
    files: {},
  };

  const result = excalidrawToIndentedText(clipboard);
  console.log("---- output ----");
  console.log(result);
  console.log("---- end ------");
  console.log(JSON.stringify(result));
}
