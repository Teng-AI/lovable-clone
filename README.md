# Lovable Clone - Claude Code SDK Edition

A Lovable-inspired code generation tool powered by the Claude Code SDK.

## ✨ Features

- Generate complete, working applications using natural language prompts
- Modern glassmorphism UI design inspired by Lovable
- Direct integration with Claude Code SDK for high-quality code generation
- Real-time code generation with progress feedback

## 🚀 Live Demo

Deployed on Render: [Coming Soon - Deploy Instructions Below]

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: TypeScript, Express.js
- **AI**: Claude Code SDK
- **Deployment**: Render
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

## 🌍 Deployment to Render

### Method 1: Deploy via GitHub (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Render**
   - Go to [Render Dashboard](https://render.com/dashboard)
   - Click "New Web Service"
   - Import your GitHub repository

3. **Configure Service**
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node

4. **Configure Environment Variables**
   In Render dashboard:
   - Add: `CLAUDE_API_KEY_1` = `your_claude_api_key_here`
   - Add: `ANTHROPIC_API_KEY` = `your_claude_api_key_here`
   - Add: `NODE_ENV` = `production`

5. **Deploy**
   - Render will automatically build and deploy
   - Your app will be live at `https://your-service-name.onrender.com`

### Why Render over Vercel?

The Claude Code SDK is designed as a CLI tool that needs:
- Longer execution times (up to 5+ minutes)
- Full Node.js environment 
- Shell access for running commands

Render provides a more suitable environment for CLI tools compared to serverless functions.

## 🏗️ Project Structure

```
lovable-clone/
├── public/
│   ├── index.html          # Main UI
│   └── output/             # Generated files directory
├── src/
│   ├── codeGenerator.ts    # Core Claude Code SDK integration
│   ├── server.ts          # Express server
│   └── types.ts           # TypeScript type definitions
├── render.yaml            # Render configuration
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