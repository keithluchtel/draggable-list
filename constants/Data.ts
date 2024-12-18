const colors = [
  "#FF99A8", // pink
  "#90EEA8", // green
  "#99CCFF", // blue  
  "#FFFF8F", // yellow
  "#FFB6C1", // rose
  "#AFEEEE", // cyan
  "#DDA0DD", // purple
  "#F4D03F", // khaki
  "#FFCBA4", // peach
  "#DA70D6"  // plum
];


export const Data = Array.from({ length: 100 }, (_, index) => ({
  id: index,
  title: `Item ${index + 1}`,
  color: colors[index % colors.length],
}));
