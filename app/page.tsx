"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from './Pagination';
import Posts from './curr_page';
import './styles.css';

const POSTS_PER_PAGE = 10;
const API_URL = 'http://localhost:3001/posts';

const App = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [numOfPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchTotalCount = async () => {
            try {
                const response = await axios.get(`${API_URL}?_limit=${POSTS_PER_PAGE}`);
                const totalCount = response.headers["x-total-count"];
                setTotalPages(Math.ceil(parseInt(totalCount)/POSTS_PER_PAGE));
            } catch (error) {
                console.error('Error fetching total count:', error);
            }
        };

        fetchTotalCount();
    }, []);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <Posts currentPage={currentPage} postsPerPage ={POSTS_PER_PAGE}/>
            <Pagination
                currentPage={currentPage}
                totalPages={numOfPages}
                onPageChange={handlePageChange}
            />
       
        </div>
    );
};

export default App;
