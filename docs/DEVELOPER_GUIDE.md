# Developer Guide

Welcome to the DriveDoo Developer Guide! This document provides comprehensive information for developers working with the projects in this repository.

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Git** - Version control system
- **Node.js** (v16+) - For JavaScript/React projects
- **Python** (v3.8+) - For Python projects
- **npm** or **yarn** - Package managers
- **Git LFS** - For large files (optional)

### Setting Up the Repository

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ayushrai-hub/DriveDoo.git
   cd DriveDooWindows
   ```

2. **Install dependencies for specific projects:**
   ```bash
   # For React projects
   cd egrahok-web
   npm install
   
   # For Python projects
   cd Agents
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

## 📁 Project Structure

```
DriveDooWindows/
├── 🌐 Web Applications/          # 12 projects
│   ├── egrahok-web/             # React TypeScript application
│   ├── react-portfolio/         # Modern portfolio site
│   ├── portfolio/               # Static HTML/CSS portfolio
│   └── ...
├── 📊 Data Analysis/            # 4 projects
│   ├── Stock-Market-Analysis/   # ML-based stock analysis
│   └── ...
├── 🤖 Machine Learning/         # 3 projects
│   ├── resume project/          # Python chatbot
│   └── ...
├── 🔧 System Utilities/         # 4 projects
│   ├── voicer/                  # Voice recognition
│   └── ...
├── 📚 Documentation/            # 5 projects
│   ├── College project SRS/     # Banking system docs
│   └── ...
└── docs/                        # Main documentation
    ├── DEVELOPER_GUIDE.md       # This file
    ├── project-index.md         # Complete project overview
    └── ...
```

## 🛠️ Development Environment Setup

### Web Development Projects

#### React Projects
For React-based projects (egrahok-web, react-portfolio):

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

#### HTML/CSS Projects
For static websites:

```bash
# Serve locally (requires live-server)
npm install -g live-server
live-server

# Or use Python's built-in server
python -m http.server 8000
```

### Python Projects

#### Virtual Environment Setup
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the application
python main.py
```

#### Jupyter Notebooks
For data analysis projects:

```bash
# Install Jupyter
pip install jupyter

# Start Jupyter notebook
jupyter notebook

# Or start JupyterLab
jupyter lab
```

## 📋 Project-Specific Instructions

### Web Applications

#### egrahok-web (React TypeScript)
- **Description**: Modern React web application with TypeScript
- **Tech Stack**: React, TypeScript, ESLint, Prettier
- **Setup**:
  ```bash
  cd egrahok-web
  npm install
  npm start
  ```
- **Build**: `npm run build`
- **Lint**: `npm run lint`

#### react-portfolio (React Vite)
- **Description**: Modern portfolio with advanced features
- **Tech Stack**: React, Vite, CSS Modules
- **Setup**:
  ```bash
  cd react-portfolio/react-portfolio
  npm install
  npm run dev
  ```
- **Build**: `npm run build`
- **Test**: `npm test`

### Machine Learning Projects

#### resume project/chatbot-main
- **Description**: Flask-based chatbot application
- **Tech Stack**: Python, Flask, HTML/CSS/JavaScript
- **Setup**:
  ```bash
  cd resume project/chatbot-main/chatbot-main/chatbot-master
  python -m venv venv
  source venv/bin/activate
  pip install -r requirements.txt
  python app.py
  ```
- **Access**: http://localhost:5000

#### Agents
- **Description**: Python agent system with comprehensive features
- **Tech Stack**: Python
- **Setup**:
  ```bash
  cd Agents
  python -m venv venv
  source venv/bin/activate
  pip install -r requirements.txt
  python agent.py
  ```

### Data Analysis Projects

#### Stock-Market-Analysis
- **Description**: ML-based stock market forecasting
- **Tech Stack**: Python, Jupyter, TensorFlow, scikit-learn
- **Setup**:
  ```bash
  cd Github Projects/Stock-Market-Analysis-And-Forecasting-Using-Deep-Learning/Stock-Market-Analysis-And-Forecasting-Using-Deep-Learning-master
  jupyter notebook Stock_market.ipynb
  ```

### System Utilities

#### Voice Recognition Projects
- **Description**: Speech-to-text applications
- **Tech Stack**: Python, speech_recognition library
- **Setup**:
  ```bash
  cd Voice Rcognition
  python -m venv venv
  source venv/bin/activate
  pip install SpeechRecognition pyaudio
  python main.py
  ```

## 🔧 Development Tools

### Code Quality Tools

#### ESLint (JavaScript/TypeScript)
```bash
# Install ESLint
npm install eslint --save-dev

# Run linting
npx eslint src/

# Fix auto-fixable issues
npx eslint src/ --fix
```

#### Prettier (Code Formatting)
```bash
# Install Prettier
npm install prettier --save-dev

# Format code
npx prettier --write src/

# Check formatting
npx prettier --check src/
```

#### Python Code Quality
```bash
# Install tools
pip install flake8 black isort

# Run linting
flake8 .

# Format code
black .

# Sort imports
isort .
```

### Testing

#### JavaScript Testing (Jest)
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Update snapshots
npm run test -- -u
```

#### Python Testing (pytest)
```bash
# Install pytest
pip install pytest

# Run tests
pytest

# Run tests with coverage
pytest --cov=src
```

## 🚀 Deployment

### Web Applications

#### Netlify Deployment
1. Push to GitHub
2. Connect repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `build/`

#### Vercel Deployment
1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel`
3. Follow prompts to deploy

#### GitHub Pages
1. Push to GitHub
2. Go to repository settings
3. Enable GitHub Pages from the desired branch
4. Set source to `/docs` folder or root

### Python Applications

#### Heroku Deployment
1. Install Heroku CLI
2. Create `Procfile`:
   ```
   web: python app.py
   ```
3. Deploy:
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

#### Docker Deployment
1. Create `Dockerfile`:
   ```dockerfile
   FROM python:3.9
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   COPY . .
   CMD ["python", "app.py"]
   ```
2. Build and run:
   ```bash
   docker build -t your-app .
   docker run -p 5000:5000 your-app
   ```

## 📝 Contributing

### Code Style Guidelines

#### JavaScript/TypeScript
- Use ESLint configuration provided
- Follow Prettier formatting rules
- Use TypeScript for type safety
- Write meaningful variable names

#### Python
- Follow PEP 8 style guide
- Use type hints where appropriate
- Write docstrings for functions and classes
- Use meaningful variable names

### Git Workflow

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and commit:**
   ```bash
   git add .
   git commit -m "Add your descriptive commit message"
   ```

3. **Push to remote:**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request** on GitHub

### Commit Message Guidelines

- Use present tense ("add" not "added")
- Use imperative mood ("move cursor to..." not "moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line
- Examples:
  - `Add feature to handle user authentication`
  - `Fix bug in data processing pipeline`
  - `Update documentation for API endpoints`

## 🔍 Debugging

### Common Issues

#### Port Already in Use
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

#### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# For Python
pip install -r requirements.txt
```

#### Permission Errors
```bash
# On macOS/Linux
chmod +x script.py

# On Windows
# Run as administrator or check file permissions
```

### Debugging Tools

#### Browser Developer Tools
- Use Chrome DevTools for web applications
- Check Console for JavaScript errors
- Use Network tab to monitor API calls

#### Python Debugging
```python
import pdb
pdb.set_trace()  # Set breakpoint

# Or use logging
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 📚 Additional Resources

### Documentation
- [Project Index](./project-index.md) - Complete project overview
- [Tech Stack Summary](./tech-stack-summary.md) - Technology breakdown
- [Roadmap](./roadmap.md) - Development plans

### External Resources
- [React Documentation](https://reactjs.org/docs)
- [Python Documentation](https://docs.python.org/3/)
- [Git Documentation](https://git-scm.com/doc)
- [Jupyter Documentation](https://jupyter-notebook.readthedocs.io/)

## 🤝 Getting Help

If you encounter issues or have questions:

1. **Check existing documentation** in the `docs/` folder
2. **Search for similar issues** in the repository
3. **Create a new issue** with detailed information:
   - Describe the problem
   - Include error messages
   - Provide steps to reproduce
   - Mention your environment (OS, versions)

## 📄 License

This project is licensed under the MIT License. See individual project README files for specific licensing information.

---

**Happy Coding!** 🎉