const brandAwareness = {
  id: 'brand-awareness',
  name: 'Brand Awareness 👀',
  favourite: true,
  widgets: [...Array(100)].map((a, i) => ({
    id: `db-brand-aware-widget-${i + 1}`,
    name: `Brand Aware Widget ${i + 1}`,
  })),
};

module.exports = brandAwareness;
