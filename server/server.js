require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(cors({ origin: 'https://semantic-supermind-assignment.netlify.app/' }));


app.use(express.json());

app.post('/chat', async (req, res) => {
    console.log("Server triggered");
    const { input_value } = req.body;
    console.log('APPLICATION_TOKEN:', `${process.env.APPLICATION_TOKEN}`);
    try {
        console.log('Making API request...');
        console.log('Headers:', {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.APPLICATION_TOKEN}`,
        });
        console.log('Payload:', {
            input_value: "Summarize data", input_type: "chat", output_type: "chat", tweaks: {}
        });
    
        const response = await axios.post(
            'https://api.langflow.astra.datastax.com/lf/91954a34-0dae-4efc-b4e5-126a96e680e3/api/v1/run/fa11ba0e-a170-455a-9e0f-468acbe38ec1?stream=false',
            {input_value: "Summarize data", input_type: "chat", output_type: "chat", tweaks: {}},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.APPLICATION_TOKEN}`,
                    // 'X-Org-ID': 'LangFlow',
                }
            }
        );
    
        console.log('Langflow Response:', response.data);
    
        const message = response.data.outputs[0].outputs[0].results.message.text;
        res.json({ message });
    } catch (error) {
        console.error('Error in /chat:', error.message);
        console.error('Error Details:', error.response?.data);
        res.status(500).json({ error: error.response?.data || 'Something went wrong. Please try again later.' });
    }
});    

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
