"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
interface PageProps {
  currentPage: number;
}

const POSTS_PER_PAGE = 10;
const API_URL = 'http://localhost:3001/posts';

interface Post {
    id: number;
    title: string;
    author: string;
    email: string;
    content: string;
}

const Posts: React.FC<PageProps>  = ({currentPage}) => {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const start_index = (currentPage-1)*POSTS_PER_PAGE
        const end_index = (currentPage)*POSTS_PER_PAGE
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${API_URL}?_start=${start_index}&_end=${end_index}}`);
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };
        fetchPosts();
    }, [currentPage]);

    return (
        <div>
            <h1>Posts {currentPage}</h1>
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
           
        </div>
    );
};

export default Posts;
