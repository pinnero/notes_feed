"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import bigInt from 'big-integer'

const API_URL = 'http://localhost:3001/notes';

interface AddNoteProps {
    onAdd: () => void; 
    onCancel: () => void;
    nameOfUser: string;
    emailOfUser: string;
    token: string;
}

const uuidToInt = (uuid: string) => {
    const hex = uuid.replace(/-/g, '');
    const bigInteger = bigInt(hex, 16);
    return bigInteger;
  };

const AddNote: React.FC<AddNoteProps> = ({ onAdd, onCancel, nameOfUser, emailOfUser, token}) => {
    const [title, setTitle] = useState('');
    const [name, setName] = useState(nameOfUser);
    const [email, setEmail] = useState(emailOfUser);
    const [content, setContent] = useState('');


    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(API_URL, {
                id: uuidToInt(uuidv4()),
                title,
                author: {
                    name: name,
                    email: email,
                },
                content,
            },  {
                headers: {
                'Authorization': `Bearer ${token}` // Add the token to the headers
            }});
            setName('');
            setContent('');
            setTitle('');
            setEmail('');
            onAdd();
        } catch (error) {
            console.error('The note has not added', error);
        }
    };

    return (
        <div className="addNote" >
            <h2>Add New Note</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                        required
                    />
                </div>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        required
                    />
                </div>
                <div>
                    <label>Content:</label>
                    <textarea
                        name="text_input_new_note"
                        value={content}
                        onChange={handleContentChange}
                        required
                    />
                </div>
                <button type="submit" name="text_input_save_new_note">save</button>
                <button name="text_input_cancel_new_note" onClick={onCancel}>cancel</button>
            </form>
        </div>
    );
};

export default AddNote;