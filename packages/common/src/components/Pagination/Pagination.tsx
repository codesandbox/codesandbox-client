import React, { useState } from 'react';
import MdFirstPage from 'react-icons/lib/md/first-page';
import MdChevronLeft from 'react-icons/lib/md/chevron-left';
import MdChevronRight from 'react-icons/lib/md/chevron-right';
import MdLastPage from 'react-icons/lib/md/last-page';
import { clamp, range } from '../../utils';
import { Navigation, Controls, Button as DefaultButton } from './elements';

type NavButton = React.FC<{
  disabled?: boolean;
  onClick: () => void;
}>;

interface IPaginationProps {
  onChange?: (currentPage: number) => void;
  neighbors?: number;
  pages?: number;
  initial?: number;
  Button?: React.ReactType;
  First?: NavButton;
  Previous?: NavButton;
  Next?: NavButton;
  Last?: NavButton;
}

export const Pagination: React.FC<IPaginationProps> = ({
  onChange = () => {},
  neighbors = 2,
  pages = 1,
  initial = 1,
  Button = DefaultButton,
  First = props => (
    <li>
      <Button {...props} aria-label="First">
        <MdFirstPage />
      </Button>
    </li>
  ),
  Previous = props => (
    <li>
      <Button {...props} aria-label="Previous">
        <MdChevronLeft />
      </Button>
    </li>
  ),
  Next = props => (
    <li>
      <Button {...props} aria-label="Next">
        <MdChevronRight />
      </Button>
    </li>
  ),
  Last = props => (
    <li>
      <Button {...props} aria-label="Last">
        <MdLastPage />
      </Button>
    </li>
  ),
}) => {
  const [currentPage, setCurrentPage] = useState(initial);

  const fetchPageNumbers = () => {
    const middle = clamp(currentPage, neighbors + 1, pages - neighbors);
    const start = Math.max(1, middle - neighbors);
    const end = Math.min(pages, middle + neighbors);

    return range(end - start + 1, start);
  };

  const gotoPage = (page: number) => {
    const destination = Math.max(0, Math.min(page, pages));
    setCurrentPage(destination);
    onChange(destination);
  };

  const handleClick = (page: number) => () => {
    gotoPage(page);
  };

  const handleFirst = () => {
    gotoPage(1);
  };

  const handlePrevious = () => {
    gotoPage(currentPage - 1);
  };

  const handleNext = () => {
    gotoPage(currentPage + 1);
  };

  const handleLast = () => {
    gotoPage(pages);
  };

  return (
    <Navigation>
      <Controls>
        <First disabled={currentPage === 1} onClick={handleFirst} />
        <Previous disabled={currentPage === 1} onClick={handlePrevious} />
        {fetchPageNumbers().map((page: number) => (
          <li key={page}>
            <Button
              active={currentPage === page}
              disabled={currentPage === page}
              onClick={handleClick(page)}
            >
              {page}
            </Button>
          </li>
        ))}
        <Next disabled={currentPage === pages} onClick={handleNext} />
        <Last disabled={currentPage === pages} onClick={handleLast} />
      </Controls>
    </Navigation>
  );
};
