const colors = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
  "pink",
  "brown",
  "gray",
  "black",
];
export const Data = Array.from({ length: 100 }, (_, index) => ({
  id: index,
  title: `Item ${index + 1}`,
  color: colors[index % colors.length],
}));
