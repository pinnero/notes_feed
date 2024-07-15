"use client";

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Pagination from '../app/pagination';
import Curr_page from '../app/curr_page';
import '../app/styles.css';
import { ThemeContext } from '../app/Theme';

interface PageProps {
    totalCount: number;
}

const NOTES_PER_PAGE = 10;
const API_URL_notesCount = 'http://localhost:3001/countNotes';

const App: React.FC<PageProps> = ({ totalCount }) => {
    const [numOfPages, setNumOfPages] = useState(Math.ceil(totalCount/NOTES_PER_PAGE));
    const [currentPage, setCurrentPage] = useState(1);
    const [isLight, setIsLight] = useState(true);
    const totalNotesCount = useRef(totalCount);

    const theme = isLight ? "light" : "dark";

    // const fetchTotalCount = async () => {
    //     try {
    //         const response = await axios.get(API_URL_notesCount);
    //         const totalCount = response.data.totalNotes;
    //         console.log('Total count:', totalCount);
    //         setNumOfPages(Math.ceil(parseInt(totalCount)/NOTES_PER_PAGE));
    //         totalNotesCount.current = totalCount;
    //     } catch (error) {
    //         console.error('Error fetching total count:', error);
    //     }
    // };

    // useEffect(() => {
    //     fetchTotalCount();
    // }, []);

    const addNoteCount = () => {
        totalNotesCount.current++;
        setNumOfPages(Math.ceil(totalNotesCount.current / NOTES_PER_PAGE));
    }

    const handleRemoveNote = () => {
        totalNotesCount.current--;
        setNumOfPages(Math.ceil(totalNotesCount.current / NOTES_PER_PAGE));
    }


    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const checkboxTheme = () => {
        return (
            <label>
                    <input
                        name = "change_theme"
                        type = "checkbox"
                        checked = {isLight}
                        onChange = { e => 
                            {setIsLight(e.target.checked)}
                        }
                    /> change theme
                </label>
        )
    }

    return (
        <ThemeContext.Provider value={theme} >
            <div>
                <div>
                    {checkboxTheme()}
                </div>
                <Curr_page 
                    currentPage= {currentPage}
                    handleDelete = {handleRemoveNote} 
                    addNoteCount = {addNoteCount}
                    totalPages={numOfPages}
                />
                <Pagination
                    currentPage={currentPage}
                    totalPages={numOfPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </ThemeContext.Provider>
    );
};

export async function getStaticProps() {
    const response = await axios.get(API_URL_notesCount);
    const totalCount = response.data.totalNotes;
    return {
        props: {
            totalCount,
        },
    };
};

export default App;