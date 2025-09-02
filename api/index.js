const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Endpoint untuk menghasilkan RPP
app.post('/generate-rpp', async (req, res) => {
    const { prompt } = req.body;
    // Mengambil kunci API dari variabel lingkungan yang aman
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    // PENTING: Jika kunci API tidak ada, kirim pesan error
    if (!GROQ_API_KEY) {
        return res.status(500).json({ error: 'Groq API key is not configured.' });
    }

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                // Menggunakan kunci API yang diambil dari .env
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "mixtral-8x7b-32768",
                messages: [{
                    role: "user",
                    content: prompt
                }],
                temperature: 0.7
            })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error calling Groq API:', error);
        res.status(500).json({ error: 'Failed to generate RPP' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));