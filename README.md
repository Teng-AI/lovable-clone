# Lovable Clone - AI Code Generator

A Lovable-inspired code generation platform powered by Claude Code SDK. Generate complete web applications through natural language prompts.

## ✨ Features

- **AI-powered code generation** using Claude Code SDK
- **Beautiful glassmorphism UI** inspired by Lovable
- **Single-file generation** with HTML, CSS, and JavaScript
- **Real-time code preview** and download
- **Responsive design** that works on all devices
- **Example prompts** to get started quickly

## 🚀 Live Demo

Visit the deployed application: [https://lovable-clone-rosy-two.vercel.app](https://lovable-clone-rosy-two.vercel.app)

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: TypeScript, Express.js
- **AI**: Claude Code SDK
- **Deployment**: Vercel
- **Styling**: Glassmorphism effects with CSS backdrop-filter

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- Claude API Key from Anthropic

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Teng-AI/lovable-clone.git
   cd lovable-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```bash
   ANTHROPIC_API_KEY=your_claude_api_key_here
   # or
   CLAUDE_API_KEY_1=your_claude_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🌍 Deployment to Vercel

### Method 1: Deploy via GitHub (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**
   In Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add: `CLAUDE_API_KEY_1` = `your_claude_api_key_here`

4. **Deploy**
   - Vercel will automatically build and deploy
   - Your app will be live at `https://your-project-name.vercel.app`

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Set environment variables**
   ```bash
   vercel env add CLAUDE_API_KEY_1
   ```

## 🏗️ Project Structure

```
lovable-clone/
├── api/
│   └── generate.ts          # Vercel serverless function
├── public/
│   ├── index.html          # Main UI (served by Vercel)
│   └── output/             # Generated files directory
├── src/
│   ├── codeGenerator.ts    # Core AI logic
│   ├── server.ts          # Express server (local dev)
│   └── types.ts           # TypeScript type definitions
├── vercel.json            # Vercel configuration
├── package.json           # Dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `CLAUDE_API_KEY_1` | Claude API key for Vercel | ✅ Yes |
| `ANTHROPIC_API_KEY` | Alternative Claude API key name | ✅ Yes |
| `NODE_ENV` | Environment mode | ❌ Auto-set |

### Vercel Configuration

The `vercel.json` file configures:
- **API routes**: TypeScript functions in `/api`
- **Static files**: Served from `/public`
- **Function settings**: 60s timeout, 1GB memory
- **Route handling**: SPA-style routing

## 🎯 Usage

1. **Enter a prompt** describing what you want to build
2. **Click "Generate Code"** to start the AI generation
3. **View the results** with syntax highlighting
4. **Download or copy** the generated files
5. **Preview** the working application

### Example Prompts

- "Build a simple calculator with basic arithmetic operations"
- "Create a todo list app with local storage persistence"
- "Make a responsive landing page for a coffee shop"
- "Build a memory card game with different difficulty levels"

## 🔍 Troubleshooting

### Common Issues

1. **"Claude API key not found"**
   - Ensure your API key is properly set in environment variables
   - Check the variable name matches `CLAUDE_API_KEY_1` or `ANTHROPIC_API_KEY`

2. **"Authentication failed"**
   - Verify your Claude API key is valid and active
   - Check your Anthropic account has sufficient credits

3. **"Code generation failed"**
   - Try a shorter, more specific prompt
   - Check your internet connection
   - Retry the request after a few seconds

4. **Local server not starting**
   - Ensure all dependencies are installed: `npm install`
   - Check if port 3000 is available
   - Review console logs for specific errors

## 🧪 Development

### Scripts

- `npm start` - Start local development server
- `npm run build` - Build TypeScript files
- `npm run dev` - Development mode (same as start)
- `npm test` - Run test suite

### Making Changes

1. **UI Updates**: Edit `public/index.html`
2. **API Logic**: Modify `api/generate.ts` and `src/codeGenerator.ts`
3. **Local Server**: Update `src/server.ts`

### Testing Locally

1. Start the server: `npm start`
2. Open `http://localhost:3000`
3. Test with various prompts
4. Check browser console and server logs

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Check the troubleshooting section above
- Review Vercel and Claude Code SDK documentation

---

Built with ❤️ using Claude Code SDK and Vercel