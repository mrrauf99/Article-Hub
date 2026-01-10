/**
 * Calculate pagination for articles list
 * @param {Array} articles - Array of articles to paginate
 * @param {string} statusFilter - Status filter value ('all', 'pending', 'approved', 'rejected')
 * @param {boolean} showStatusFilter - Whether status filtering is enabled
 * @param {number} page - Current page number
 * @returns {Object} Object containing paginatedArticles, totalPages, safePage, filteredByStatus
 */
export function calculatePagination(articles, statusFilter, showStatusFilter, page) {
  const PER_PAGE = 9;
  
  const filteredByStatus = showStatusFilter && statusFilter !== "all"
    ? articles.filter((a) => a.status === statusFilter)
    : articles;
  
  const totalPages = Math.ceil(filteredByStatus.length / PER_PAGE);
  const safePage = Math.min(Math.max(page, 1), totalPages || 1);
  
  const paginatedArticles = (() => {
    const start = (safePage - 1) * PER_PAGE;
    return filteredByStatus.slice(start, start + PER_PAGE);
  })();
  
  return { paginatedArticles, totalPages, safePage, filteredByStatus };
}
