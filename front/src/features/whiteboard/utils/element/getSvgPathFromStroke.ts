const average = (a: number, b: number): number => (a + b) / 2;

export const getSvgPathFromStroke = (points: [number, number][], closed = true): string => {
  const len = points.length;

  if (len < 4) {
    return ``;
  }

  let a: [number, number] = points[0];
  let b: [number, number] = points[1];
  const c: [number, number] = points[2];

  let result = `M${a[0].toFixed(2)},${a[1].toFixed(2)} Q${b[0].toFixed(
    2
  )},${b[1].toFixed(2)} ${average(b[0], c[0]).toFixed(2)},${average(
    b[1],
    c[1]
  ).toFixed(2)} T`;

  for (let i = 2, max = len - 1; i < max; i++) {
    a = points[i];
    b = points[i + 1];
    result += `${average(a[0], b[0]).toFixed(2)},${average(a[1], b[1]).toFixed(
      2
    )} `;
  }

  if (closed) {
    result += "Z";
  }

  return result;
};
