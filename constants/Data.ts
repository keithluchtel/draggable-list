const colors = [
  "#FF0000", // red
  "#0000FF", // blue
  "#008000", // green
  "#FFFF00", // yellow
  "#800080", // purple
  "#FFA500", // orange
  "#FFC0CB", // pink
  "#A52A2A", // brown
  "#808080", // gray
  "#000000", // black
];
export const Data = Array.from({ length: 100 }, (_, index) => ({
  id: index,
  title: `Item ${index + 1}`,
  color: colors[index % colors.length],
}));
