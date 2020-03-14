import React from 'react';
import { connectPagination } from 'react-instantsearch-dom';
import { Pagination } from '@codesandbox/common/lib/components';

export const Paginate = connectPagination(({ nbPages, refine }) => (
  <Pagination pages={nbPages} onChange={page => refine(page)} />
));
