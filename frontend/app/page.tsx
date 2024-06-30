"use client";

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Pagination from './pagination';
import Curr_page from './curr_page';
import './styles.css';
import { ThemeContext } from './Theme';

const NOTES_PER_PAGE = 10;
const API_URL_notesCount = 'http://localhost:3001/notesCount';

const App = () => {
    const [numOfPages, setNumOfPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLight, setIsLight] = useState(true);
    const totalNotesCount = useRef(0);

    const theme = isLight ? "light" : "dark";

    const fetchTotalCount = async () => {
        try {
            const response = await axios.get(API_URL_notesCount);
            const totalCount = response.data.totalNotes;
            console.log('Total count:', totalCount);
            setNumOfPages(Math.ceil(parseInt(totalCount)/NOTES_PER_PAGE));
            totalNotesCount.current = totalCount;
        } catch (error) {
            console.error('Error fetching total count:', error);
        }
    };

    useEffect(() => {
        fetchTotalCount();
    }, []);

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

export default App;