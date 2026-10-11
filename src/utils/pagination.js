import {
  APP
} from "../constants/app.js";

export function getPagination(query = {}) {
  const requestedPage = Number.parseInt(query.page, 10);
  const requestedLimit = Number.parseInt(query.limit, 10);

  const page =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : APP.DEFAULT_PAGE;

  const limit =
    Number.isInteger(requestedLimit) && requestedLimit > 0
      ? Math.min(requestedLimit, APP.MAX_PAGE_SIZE)
      : APP.DEFAULT_PAGE_SIZE;

  return {
    page,
    limit,
    offset: (page - 1) * limit
  };
}

export function paginationMetadata(page, limit, totalItems) {
  const totalPages = Math.ceil(totalItems / limit);

  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  };
}