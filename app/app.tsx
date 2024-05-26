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
    const totalPages = calculatePagesNum();


    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <HomePage currentPage={currentPage}/>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
       
        </div>
    );
};

export default App;
