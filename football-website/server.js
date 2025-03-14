const express = require('express');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = 3000;

// Supabase connection
const supabase = createClient(
    'https://tkgfmecgejjqlwlupoea.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZ2ZtZWNnZWpqcWx3bHVwb2VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5MDcwNzMsImV4cCI6MjA1NzQ4MzA3M30.YhYFwbrzJg_c68bp_j8LyvPeC6_AJWDPjvH7FQ-3Qqw'
);

app.use(bodyParser.json());

// Route to get players
app.get('/players', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('players')
            .select('*');
        if (error) {
            throw error;
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
