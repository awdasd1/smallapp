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
  origin: process.env.CORS_ORIGIN || '*', // Allow any origin if CORS_ORIGIN is not set
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
    timestamp: new Date().toISOString(),
    apiUrl: process.env.VITE_API_URL || 'not set',
    corsOrigin: process.env.CORS_ORIGIN || '*'
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
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    
    if (!n8nWebhookUrl) {
      console.error('N8N_WEBHOOK_URL is not set');
      return res.status(200).json({
        reply: "لم يتم تكوين عنوان webhook بشكل صحيح. يرجى التحقق من إعدادات البيئة.",
        processed: false
      });
    }
    
    console.log('Forwarding to n8n webhook:', n8nWebhookUrl);
    
    const n8nResponse = await axios.post(n8nWebhookUrl, {
      message,
      timestamp: new Date().toISOString(),
      source: 'chatbot-app'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000 // 10 seconds timeout
    });
    
    console.log('n8n response:', n8nResponse.data);
    
    // Return the response from n8n
    return res.json({
      reply: n8nResponse.data.reply || 'لقد استلمت رسالتك، ولكنني غير متأكد من كيفية الرد.',
      processed: true
    });
  } catch (error) {
    console.error('Error processing chat message:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    
    // If n8n is not available, provide a fallback response
    return res.status(200).json({
      reply: "لا يمكنني معالجة طلبك حاليًا. يرجى التحقق من اتصال الخادم بـ n8n والمحاولة مرة أخرى لاحقًا.",
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

// Catch-all route for SPA in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    const distPath = join(__dirname, '../dist/index.html');
    if (fs.existsSync(distPath)) {
      res.sendFile(distPath);
    } else {
      res.status(404).send('Application not built yet');
    }
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`CORS origin: ${process.env.CORS_ORIGIN || '*'}`);
  console.log(`n8n webhook URL: ${process.env.N8N_WEBHOOK_URL || 'not set'}`);
});
