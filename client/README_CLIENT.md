# GitHub Repo Explorer - Frontend

A modern, responsive React application for exploring GitHub users and their repositories with advanced filtering, sorting, and analytics.

## 🌟 Features

- **User Search**: Search for any GitHub user by username
- **Repository Display**: View all repositories with detailed information
- **Sorting Options**: Sort by stars, name, or last updated
- **Language Analytics**: Visual pie chart showing language distribution
- **Pagination**: Load repositories page by page
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Real-time Statistics**: View follower count, following, and repository stats

## 🛠️ Tech Stack

- **React 19.2** - UI Library
- **Vite 8** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Recharts** - Data visualization (charts)
- **PostCSS** - CSS processing

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm lint

# Preview production build
npm preview
```

## 🚀 Getting Started

1. Navigate to `http://localhost:5173` (or the port shown in terminal)
2. Enter a GitHub username in the search box
3. Click "Search" to fetch user data and repositories
4. Use sorting options to organize repositories
5. Click "Load Next 30 Repositories" to see more repos

## 📱 Responsive Design

- **Desktop (1024px+)**: Full table layout with sidebar
- **Tablet (768px - 1023px)**: Optimized grid layout
- **Mobile (< 768px)**: Stack layout with touch-friendly buttons

## 🎨 Styling

The project uses **Tailwind CSS** for styling. Configuration can be found in:
- `tailwind.config.js` - Tailwind configuration
- `postcss.config.js` - PostCSS configuration
- `src/index.css` - Global styles and Tailwind directives
- `src/App.css` - Component-specific animations and styles

## 🔌 API Integration

The app connects to a backend API at `https://git-hub-repo-explorer-inky.vercel.app/`

### Available Endpoints:
- `GET /api/github/user/{username}` - Fetch user profile
- `GET /api/github/user/{username}/repos?page={page}` - Fetch repositories

## 📊 Data Visualization

- **Pie Chart**: Shows distribution of programming languages across repositories
- **Statistics Cards**: Displays followers, following, and repository counts
- **Repository Table**: Shows stars, forks, issues, and last updated date

## 🔍 Features Explained

### Search
- Enter any GitHub username to fetch their profile and repositories
- Real-time error handling for invalid usernames

### Sorting
- **Stars**: Sort by most starred repositories
- **Name**: Sort alphabetically by repository name
- **Updated**: Sort by most recently updated repositories

### Pagination
- Automatically loads repositories in batches of 30
- Shows current page and remaining repositories
- "Load Next 30" button for pagination

### Analytics
- Language distribution pie chart
- Visual statistics cards
- Debug info showing loaded repositories count

## 📝 Notes for Interview

- Clean, modern UI with professional styling
- Responsive across all device sizes
- Error handling and loading states
- Proper component structure
- Follows React best practices
- Uses modern hooks (useState)
- Environment-independent API calls
- SEO-friendly HTML meta tags

## 🐛 Troubleshooting

If you encounter issues:

1. **Port already in use**: Vite will use the next available port
2. **API errors**: Check your internet connection and backend availability
3. **Styling issues**: Clear browser cache and rebuild (`npm run build`)
4. **Node version**: Ensure you're using Node.js 18+ (check with `node -v`)

## 📄 License

This project is part of an interview assignment.
