"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from './Pagination';

const POSTS_PER_PAGE = 10;
const API_URL = 'http://localhost:3001/posts';
//const totalPages = 9;

interface Post {
    id: number;
    title: string;
    author: string;
    email: string;
    content: string;
}

const HomePage = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const start_index = (currentPage-1)*POSTS_PER_PAGE
        const end_index = (currentPage)*POSTS_PER_PAGE
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${API_URL}?_start=${start_index}&_end=${end_index}}`);
                setPosts(response.data);
                setTotalPages(Math.ceil(parseInt(response.headers['x-total-count']) / POSTS_PER_PAGE));
                console.log("number of posts"+response.headers['x-total-count']);
                console.log(parseInt(response.headers['x-total-count']));

            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <h1>Posts</h1>
            <div>
                {posts.map(post => (
                    <div key={post.id} className="post" id={`${post.id}`}>
                        <h2>{post.title}</h2>
                        <small>By {post.author}</small>
                        <br />
                        {post.content}
                    </div>
                ))}
            </div>
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

export default HomePage;
