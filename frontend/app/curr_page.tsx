"use client";

import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Note from './note';
import AddNote from './AddNote';
import { ThemeContext } from './Theme';

interface PageProps {
  currentPage: number;
  handleDelete: () => void;
  addNoteCount: () => void;
  totalPages: number;
}

const NOTES_PER_PAGE = 10;
const API_URL = 'http://localhost:3001/notes';

interface Author {
    name: string;
    email: string;
}

interface Note {
    id: number;
    title: string;
    author: Author;
    content: string;
}

const Curr_page: React.FC<PageProps>  = ({currentPage, handleDelete, addNoteCount, totalPages}) => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [showAddNote, setShowAddNote] = useState(false)
    const theme = useContext(ThemeContext); 
    const [token, setToken] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [activeName, setActiveName] = useState('');
    const [activeEmail, setActiveEmail] = useState('');
    const [userNameLogin, setUserNameLogin] = useState('');
    const [passwordLogin, setPasswordLogin] = useState('');
    const [cache, setCache] = useState<{[page: number]: Note[]}>({});


    useEffect(() => {
        fetchNotes();
    }, [currentPage]);
    
    const fetchNotes = async () => {
        if (cache[currentPage]) {
            setNotes(cache[currentPage]);
        } else {
            fetchNotesFromServer();
        }
    };

    const fetchNotesOnePage = async (page : number) => {
        const start_index = (page-1)*NOTES_PER_PAGE
        try {
            const response = await axios.get(`${API_URL}?_start=${start_index}`);
            setCache(prevCache => ({...prevCache, [page]: response.data}));
            if (page === currentPage)
            {
                setNotes(response.data);
            }
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    const fetchNotesFromServer = () => {
        let pagesToFetch: number[] = [];
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, index) => index + 1);
        } else if (currentPage < 3) {
            pagesToFetch = [1, 2, 3, 4, 5];
        } else if (currentPage <= totalPages - 2) {
            pagesToFetch = [
                currentPage - 2,
                currentPage - 1,
                currentPage,
                currentPage + 1,
                currentPage + 2
            ];
        } else if (currentPage == totalPages - 1){
            pagesToFetch = [
                currentPage - 3,
                currentPage - 2,
                currentPage - 1,
                currentPage,
                currentPage + 1
            ];
        }
        pagesToFetch = [
            currentPage - 4,
            currentPage - 3,
            currentPage - 2,
            currentPage - 1,
            currentPage
        ]; 

        pagesToFetch.forEach(async pageNum => {
            if (!cache[pageNum]) {
                fetchNotesOnePage(pageNum);
            }
        });

        setCache(prevCache => {
            const updatedCache = { ...prevCache };
            for (const key in updatedCache) {
                if (!pagesToFetch.includes(Number(key))) {
                    delete updatedCache[key];
                }
            }
            return updatedCache;
        });
    };

    const handleNoteUpdate = () => {
        fetchNotesFromServer();
    };
    
    const handleAddNote = () => {
        addNoteCount();
        fetchNotesFromServer();
        setShowAddNote(false)
    }

    const handleCancelNote = () => {
        setShowAddNote(false)
    }

    const handleDeleteNote = () => {
        handleDelete();
        fetchNotesFromServer();
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserName(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleUserNameChangeLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserNameLogin(e.target.value);
    };

    const handlePasswordChangeLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordLogin(e.target.value);
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log('Sent data:', { name, email, userName, password });

            await axios.post('http://localhost:3001/users', {
                name,
                email,
                userName,
                password,
            });
            setName('');
            setEmail('');
            setUserName('');
            setPassword('');
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/login', {
                userName: userNameLogin,
                password: passwordLogin,
            });
            setToken(response.data.token);
            setActiveName(response.data.name);
            console.log(response.data.name);
            setActiveEmail(response.data.email);
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    const handleLogout = () => {
        setToken(null);
        setActiveName('');
        setActiveEmail('');
    };

    return (
        <div>
            <div>
            <h1>User registration</h1>
            {!token ? (
                <>
                    <form name="create_user_form" onSubmit={handleCreateUser}>
                        <div>
                            <label>Name:</label>
                            <input
                                name = "create_user_form_name"
                                type="text"
                                value={name}
                                onChange={handleNameChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Email:</label>
                            <input
                                name = "create_user_form_email"
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                required
                            />
                        </div>
                        <div>
                            <label>User Name:</label>
                            <input
                                name = "create_user_form_username"
                                type="text"
                                value={userName}
                                onChange={handleUserNameChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Password:</label>
                            <input
                                name = "create_user_form_password"
                                type = "password"
                                value={password}
                                onChange={handlePasswordChange}
                                required
                            />
                        </div>
                        <button type="submit" name="create_user_form_create_user">Create User</button>
                    </form>

                    <form name="login_form" onSubmit={handleLogin}>
                    <div>
                        <label>User Name:</label>
                            <input
                                name = "login_form_username"
                                type="text"
                                value={userNameLogin}
                                onChange={handleUserNameChangeLogin}
                                required
                            />
                        </div>
                        <div>
                            <label>Password:</label>
                            <input
                                name = "login_form_password"
                                type = "password"
                                value={passwordLogin}
                                onChange={handlePasswordChangeLogin}
                                required
                            />
                        </div>
                        <button type="submit">Login</button>
                    </form>
                </>
            ) : (
                <div>
                    <button name="logout" onClick={handleLogout}>Logout</button>
                </div>
            )}
        </div>
            <div className={`allNotes ${theme}`}>
                <h1>Notes</h1>
                <div>
                    {notes.map((note, index) => (
                        <Note 
                            key={note.id} 
                            note={note} 
                            onUpdate={handleNoteUpdate} 
                            onDelete = {handleDeleteNote}
                            dbIndex = {(index + (currentPage-1)*10) + 1}
                            nameOfUser={activeName}
                            token = {token}
                        />
                    ))}
                </div>
                <div className={`showAddNote ${theme}`}>
                    {!token ? null : (showAddNote ? <AddNote 
                            onAdd = {handleAddNote} 
                            onCancel = {handleCancelNote}
                            nameOfUser = {activeName}
                            emailOfUser = {activeEmail}
                            token = {token}/>  :  <button  onClick={()=>setShowAddNote(!showAddNote)} 
                            name="add_new_note">Add Note</button>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default Curr_page;