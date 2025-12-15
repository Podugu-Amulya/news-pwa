import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BookmarkButton from './BookmarkButton';
import './App.css'; 

// A placeholder list of articles
const articles = [
  { id: 'a1', title: 'PWA Best Practices', content: 'Details about caching and sync...' },
  { id: 'a2', title: 'Offline-First Design', content: 'Why designing for no network is key.' },
  { id: 'a3', title: 'The Lighthouse Audit', content: 'How to score 90+ on the PWA check.' },
];

// Home Page component: Displays the list of articles
const HomePage = () => (
  <div className="container">
    <h2>Latest News Articles</h2>
    {articles.map(article => (
      <div key={article.id} className="article-preview">
        <Link to={`/article/${article.id}`}><h3>{article.title}</h3></Link>
        <p>{article.content.substring(0, 50)}...</p>
        <BookmarkButton articleId={article.id} />
      </div>
    ))}
    {/* Placeholder for the main news fetch logic here */}
  </div>
);

// Article Detail component
const ArticlePage = () => {
    // In a real app, you would fetch the full article content here
    return (
        <div className="container">
            <Link to="/">← Back to Home</Link>
            <h1>Detailed Article View</h1>
            <p>This page should be cached by the Service Worker after the first visit.</p>
            <BookmarkButton articleId="a-detail-001" />
        </div>
    );
}

// Main App with routing
function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>📰 Resilient News Reader PWA</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/article/:id" element={<ArticlePage />} />
            {/* You need to add a dedicated route for your Offline Fallback UI later */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
