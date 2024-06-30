"use client";

import React ,{ useContext } from 'react';
import { ThemeContext } from './Theme';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const theme = useContext(ThemeContext); 
    const getPageNumbers = () => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, index) => index + 1);
        } else if (currentPage < 3) {
            return [1, 2, 3, 4, 5];
        } else if (currentPage <= totalPages - 2) {
            return [
                currentPage - 2,
                currentPage - 1,
                currentPage,
                currentPage + 1,
                currentPage + 2
            ];
        } else if (currentPage == totalPages - 1){
            return [
                currentPage - 3,
                currentPage - 2,
                currentPage - 1,
                currentPage,
                currentPage + 1
            ];
        }
        return [
            currentPage - 4,
            currentPage - 3,
            currentPage - 2,
            currentPage - 1,
            currentPage
        ];

    };
    console.log('Current page:', currentPage);
    console.log('Total pages:', totalPages);
    const pageNumbers = getPageNumbers();

    return (
        <div className={`pagination ${theme}` }>
            <button name="first" onClick={() => onPageChange(1)} disabled={currentPage === 1}>First  </button>
            <button name="previous" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>Previous  </button>
            {pageNumbers.map(page => (
                <button
                    key={page}
                    name={`page-${page}`}
                    onClick={() => onPageChange(page)}
                    disabled={page === currentPage}
                >
                    {page}
                </button>
            ))}
            <button name="next" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next  </button>
            <button name="last" onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}>Last  </button>
        </div>
    );
};

export default Pagination;
