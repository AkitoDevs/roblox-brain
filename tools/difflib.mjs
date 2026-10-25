// Minimal unified line diff (LCS), so the draft and sync tools need no external diff program.
export function unifiedDiff(a, b, nameA, nameB) {
  const A = a.replace(/\r\n/g, "\n").split("\n"), B = b.replace(/\r\n/g, "\n").split("\n");
  const n = A.length, m = B.length;
  const L = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = A[i] === B[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const ops = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (A[i] === B[j]) { ops.push([" ", A[i]]); i++; j++; }
    else if (L[i + 1][j] >= L[i][j + 1]) ops.push(["-", A[i++]]);
    else ops.push(["+", B[j++]]);
  }
  while (i < n) ops.push(["-", A[i++]]);
  while (j < m) ops.push(["+", B[j++]]);
  if (!ops.some(([t]) => t !== " ")) return "";
  const lines = [`--- ${nameA}`, `+++ ${nameB}`];
  ops.forEach(([t, s], k) => {
    const near = ops.slice(Math.max(0, k - 3), k + 4).some(([u]) => u !== " ");
    if (t !== " " || near) lines.push(t + s);
    else if (lines.at(-1) !== "...") lines.push("...");
  });
  return lines.join("\n") + "\n";
}
