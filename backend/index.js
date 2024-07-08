const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const keyPath = 'key.key';
const notesPath = 'notes.txt';
const algorithm = 'aes-256-ctr';

// Generate and save a key
function generateKey() {
    const key = crypto.randomBytes(32);
    fs.writeFileSync(keyPath, key);
}

// Load the key from the file
function loadKey() {
    if (!fs.existsSync(keyPath)) {
        generateKey();
    }
    return fs.readFileSync(keyPath);
}

// Encrypt a message
function encryptMessage(message, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([cipher.update(message), cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

// Decrypt a message
function decryptMessage(encryptedMessage, key) {
    const [ivHex, encryptedHex] = encryptedMessage.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString();
}

// Load the encryption key
const key = loadKey();

// API endpoint to add a new note
app.post('/addNote', (req, res) => {
    const { note } = req.body;
    const encryptedNote = encryptMessage(note, key);
    fs.appendFileSync(notesPath, encryptedNote + '\n');
    res.json({ message: 'Note added and encrypted successfully!' });
});

// API endpoint to get all notes
app.get('/getNotes', (req, res) => {
    if (fs.existsSync(notesPath)) {
        const encryptedNotes = fs.readFileSync(notesPath, 'utf-8').trim().split('\n');
        const notes = encryptedNotes.map((encryptedNote) => decryptMessage(encryptedNote, key));
        res.json({ notes });
    } else {
        res.json({ notes: [] });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
