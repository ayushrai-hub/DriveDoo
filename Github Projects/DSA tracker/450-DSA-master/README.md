# 450 DSA Cracker

A modern, feature-rich React application for tracking progress through 450 essential Data Structures and Algorithms problems across 15 different topics.

## 🚀 Features

### Core Functionality
- **Progress Tracking**: Track completion status for 450+ DSA problems across 15 topics
- **Smart Progress Analytics**: Real-time statistics including completion percentage, questions done, and topics completed
- **Bookmark System**: Mark important questions for later review
- **Note Taking**: Add personal notes to any question for better organization
- **Data Persistence**: Local database storage with automatic save/load

### Modern UI/UX
- **Dark/Light Theme**: Toggle between themes with persistent settings
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Progress Visualization**: Beautiful progress bars and statistics cards
- **Interactive Interface**: Smooth animations and hover effects

### Data Management
- **Import/Export**: Backup and restore progress with JSON files
- **Reset Progress**: Clean slate option with confirmation
- **Error Handling**: Robust error handling with user-friendly messages

### Analytics & Tracking
- **Google Analytics**: Built-in tracking for usage patterns (optional)
- **Event Tracking**: Track completions, exports, imports, and theme changes
- **Progress Summary**: At-a-glance overview of your DSA journey

## 📊 Topics Covered

1. **Array** - 36 problems
2. **Matrix** - 10 problems  
3. **String** - 36 problems
4. **Search & Sort** - 36 problems
5. **Linked List** - 36 problems
6. **Binary Trees** - 36 problems
7. **BST** - 22 problems
8. **Greedy** - 36 problems
9. **BackTracking** - 19 problems
10. **Stacks & Queues** - 36 problems
11. **Heap** - 18 problems
12. **Graph** - 36 problems
13. **Trie** - 6 problems
14. **Dynamic Programming** - 63 problems
15. **Bit Manipulation** - 10 problems

## 🛠️ Tech Stack

- **Frontend**: React 18 + React Router 6
- **Styling**: CSS-in-JS with CSS Variables
- **State Management**: React Context API
- **Database**: LocalBase (Local Storage)
- **Analytics**: React GA4
- **Build Tool**: Create React App

## 🚀 Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd 450-DSA-master
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

### Production Build

```bash
npm run build
```

This will create an optimized build in the `build` folder.

## 📱 Usage Guide

### Getting Started
1. **Initial Setup**: On first load, the app will automatically populate with all 450+ problems
2. **Theme Selection**: Toggle between dark and light themes using the footer button
3. **Progress Tracking**: Click on any topic card to view and track individual problems

### Tracking Progress
- **Complete Questions**: Check the checkbox next to any question to mark it as completed
- **Add Notes**: Click the note icon to add personal notes to any question
- **Bookmark Questions**: Click the bookmark icon to mark important questions

### Data Management
- **Export Progress**: Go to the About page to export your progress as a JSON file
- **Import Progress**: Restore progress from a previously exported JSON file
- **Reset Progress**: Use the reset button with confirmation to start fresh

### Progress Overview
The main dashboard shows:
- **Completion Percentage**: Overall progress across all topics
- **Questions Done**: Total completed vs total available
- **Topics Complete**: Number of fully completed topics
- **Remaining Questions**: How many questions left to solve

## 🎨 Customization

### Theme Customization
The app uses CSS variables for easy theme customization. Edit the `:root` selector in `src/App.css`:

```css
:root {
  --primary-color: #your-color;
  --bg-color: #your-background;
  --text-color: #your-text-color;
  /* ... other variables */
}
```

### Adding New Topics
To add new topics or modify existing ones:

1. **Update Data**: Modify `src/450DSAFinal.js` with new topic data
2. **Add Route**: Add new route in `src/App.js` if needed
3. **Create Component**: Create topic-specific component if required

### Google Analytics
To enable Google Analytics:

1. Set your tracking ID in environment variables:
   ```
   REACT_APP_GA_TRACKING_ID=your-tracking-id
   ```

2. The app will automatically track:
   - Page views
   - Question completions
   - Progress exports/imports
   - Theme changes

## 📁 Project Structure

```
450-DSA-master/
├── public/                    # Static assets
│   ├── index.html            # Main HTML template
│   └── favicon.ico           # App icon
├── src/                       # Source code
│   ├── App.js                # Main application component
│   ├── App.css               # Global styles
│   ├── index.js              # Application entry point
│   ├── 450DSAFinal.js        # Problem data
│   ├── services/             # Data services
│   │   └── dbServices.js     # Database operations
│   └── components/           # React components
│       ├── TopicCard/        # Topic overview cards
│       ├── Topic/           # Individual topic view
│       ├── About/           # About and data management
│       └── Footer/          # Footer with theme toggle
├── package.json              # Dependencies and scripts
├── README.md                 # This file
└── docs/                    # Documentation
```

## 🔧 Development

### Available Scripts

- `npm start` - Run development server
- `npm run build` - Create production build
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (not recommended)

### Code Style
The project uses ESLint for code quality. Run:
```bash
npm run lint
```

### Testing
Tests are written using Jest and React Testing Library. Add tests in `__tests__` directories.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Love Babbar** - For the original DSA sheet that inspired this project
- **GeeksforGeeks** - For providing problem statements and solutions
- **Coding Ninjas** - For additional problem resources
- **React Community** - For the amazing ecosystem

## 📞 Support

If you encounter any issues or have suggestions:

1. **Check the FAQ** in the About section
2. **Report Bugs** by creating an issue on GitHub
3. **Request Features** through GitHub discussions
4. **Contribute** by submitting pull requests

## 🔄 Version History

### v2.0.0 (Current)
- **Major Rewrite**: Complete modernization with React 18
- **Enhanced UI**: Modern CSS-in-JS styling with dark theme support
- **Progress Analytics**: Real-time statistics and visualizations
- **Bookmark System**: Mark important questions for review
- **Note Taking**: Personal notes for each question
- **Improved Data Management**: Better import/export functionality
- **Error Handling**: Robust error handling with user feedback

### v1.x.x (Legacy)
- Original implementation with React 16
- Basic progress tracking functionality
- Simple UI with Bootstrap styling

## 📈 Performance

The application is optimized for:
- **Fast Loading**: Lazy loading of components and data
- **Smooth Interactions**: Optimized re-renders and state updates
- **Memory Efficiency**: Efficient data structures and cleanup
- **Mobile Performance**: Touch-friendly interface and responsive design

## 🔒 Privacy

- **Local Storage**: All data is stored locally in your browser
- **No Server**: No server-side storage or data transmission
- **Optional Analytics**: Google Analytics is optional and can be disabled
- **Data Export**: You control your data through export functionality

---

**Happy Coding! 🚀**

Remember: Consistency is key in mastering DSA. Use this tool to track your progress and stay motivated on your coding journey!