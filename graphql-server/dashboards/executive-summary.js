const executiveSummary = {
  id: 'executive-summary',
  name: 'Executive Summary 📊',
  favourite: false,
  widgets: [...Array(50)].map((a, i) => ({ id: `db-ex-sum-widget-${i + 1}`, name: `Ex Sum Widget ${i + 1}` })),
};

module.exports = executiveSummary;
