// src/components/Notes.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notes: React.FC = () => {
    const [note, setNote] = useState('');
    const [notes, setNotes] = useState<string[]>([]);

    const fetchNotes = async () => {
        const response = await axios.get('http://localhost:3001/getNotes');
        setNotes(response.data.notes);
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const handleAddNote = async () => {
        await axios.post('http://localhost:3001/addNote', { note });
        setNote('');
        fetchNotes();
    };

    return (
        <div>
            <h1>Secure Notes</h1>
            <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write your note here"
            ></textarea>
            <button onClick={handleAddNote}>Add Note</button>
            <h2>Notes</h2>
            <ul>
                {notes.map((note, index) => (
                    <li key={index}>{note}</li>
                ))}
            </ul>
        </div>
    );
};

export default Notes;
