export const mapCategoryName = (
  categoryName: string,
  transWithFallback: (key: string, fallback: string) => string
): string => {
  const categoryMapping: Record<string, string> = {
    "music": transWithFallback("music","Âm nhạc"),
    "other": transWithFallback("others","Thể loại khác"),
    "theatersandart": transWithFallback("theatersandart","Sân khấu & Nghệ thuật"),
    "sport": transWithFallback("sport","Thể thao")
  };

  return categoryMapping[categoryName] || categoryName;
};
