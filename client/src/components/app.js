import React from 'react';
import { HashRouter as Router, Redirect, Route } from 'react-router-dom';
import { Navbar } from './navbar';
import { Home } from './pages/home';
import { About } from './pages/about';
import { Search } from './pages/search';
import { Downloads } from './pages/downloads';

function App() {
  return (
    <Router >
      <Navbar />
      <div className="my-4">
        <Route path="/" exact={true} component={Home} />
        <Route path="/about" component={About} />
        <Route path="/search/:searchType" component={Search} />
        <Route path="/downloads" component={Downloads} />
        <Redirect to="/search/gwas" />
      </div>
    </Router>
  );
}

export default App;
