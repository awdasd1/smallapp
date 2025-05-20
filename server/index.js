import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true
}));

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const distPath = join(__dirname, '../dist');
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
  }
}

// Debug route to check server status
app.get('/api/status', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    environment: process.env.NODE_ENV,
    n8nWebhookUrl: process.env.N8N_WEBHOOK_URL || 'not set',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    console.log('Received message:', message);
    
    // Forward the message to n8n webhook
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/chatbot';
    
    console.log('Forwarding to n8n webhook:', n8nWebhookUrl);
    
    const n8nResponse = await axios.post(n8nWebhookUrl, {
      message,
      timestamp: new Date().toISOString(),
      source: 'chatbot-app'
    });
    
    console.log('n8n response:', n8nResponse.data);
    
    // Return the response from n8n
    return res.json({
      reply: n8nResponse.data.reply || 'I received your message, but I\'m not sure how to respond.',
      processed: true
    });
  } catch (error) {
    console.error('Error processing chat message:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    // If n8n is not available, provide a fallback response
    return res.status(200).json({
      reply: "I'm currently unable to process your request through my workflow engine. Please try again later.",
      processed: false
    });
  }
});

// Webhook endpoint to receive responses from external systems
app.post('/api/webhook/receive', (req, res) => {
  const { message, source } = req.body;
  
  console.log(`Received webhook from ${source}:`, message);
  
  // Process the incoming webhook data
  // This could trigger events in your application
  
  return res.json({
    status: 'success',
    message: 'Webhook received successfully'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`CORS origin: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
  console.log(`n8n webhook URL: ${process.env.N8N_WEBHOOK_URL || 'not set'}`);
});
