# Chatbot with Webhook Integration

A modern chatbot application built with React and Vite that integrates with n8n workflows through webhooks.

## Features

- Real-time chat interface
- Webhook integration with n8n for automated workflows
- Express backend for API handling
- Environment configuration for different deployment scenarios
- Ready for deployment on GitHub and Coolify

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Express.js
- **Workflow Automation**: n8n
- **Deployment**: GitHub, Coolify

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- n8n instance (for webhook integration)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/chatbot-webhook.git
   cd chatbot-webhook
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the environment variables in the `.env` file.

### Development

1. Start the development server:
   ```bash
   npm run dev
   ```

2. In a separate terminal, start the Express server:
   ```bash
   npm run server
   ```

3. Open your browser and navigate to `http://localhost:5173`

## n8n Integration

### Setting Up n8n Workflow

1. Install and run n8n:
   ```bash
   npm install -g n8n
   n8n start
   ```

2. Create a new workflow in n8n:
   - Add a "Webhook" node as a trigger
   - Configure it to receive POST requests
   - Add processing nodes as needed
   - Add a "Respond to Webhook" node to send data back to the chatbot

3. Update your `.env` file with the webhook URL from n8n:
   ```
   VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook/your-webhook-path
   ```

## Deployment

### GitHub

1. Create a new repository on GitHub
2. Push your code to the repository:
   ```bash
   git remote add origin https://github.com/yourusername/chatbot-webhook.git
   git branch -M main
   git push -u origin main
   ```

### Coolify Deployment

1. Set up a Coolify instance
2. Connect your GitHub repository to Coolify
3. Configure the deployment settings:
   - Build command: `npm run build`
   - Start command: `npm run server`
   - Environment variables: Copy from your `.env` file

4. Deploy the application

## Project Structure

```
├── public/              # Static assets
├── server/              # Express server
│   └── index.js         # Server entry point
├── src/                 # React application
│   ├── components/      # UI components
│   ├── context/         # React context
│   ├── types/           # TypeScript types
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── .env                 # Environment variables
├── .env.example         # Example environment variables
├── package.json         # Dependencies and scripts
└── README.md            # Project documentation
```

## License

MIT
