"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from './Pagination';
import HomePage from './page';

const POSTS_PER_PAGE = 10;
const API_URL = 'http://localhost:3001/posts';

const App = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const calculatePagesNum = async () => {
        try {
            const response = await axios.get(`${API_URL}`);
            return response.data.length
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };
    const TotalPages = calculatePagesNum();


    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div>
            
                <button name="first" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>First  </button>
                <button name="previous" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous  </button>
                <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
                <button name="next" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next  </button>
                <button name="last" onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>Last  </button>
            </div>
            <h3>{currentPage}</h3>
            <h3>{totalPages}</h3>
        </div>
    );
};

export default App;
