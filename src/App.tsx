import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Track from './pages/Track';
import SubmitIssue from './pages/SubmitIssue';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/submit" element={<SubmitIssue />} />
        <Route path="/dashboard" element={<Dashboard view="priority" />} />
        <Route path="/dashboard/submissions" element={<Dashboard view="submissions" />} />
        <Route path="/track" element={<Track />} />
      </Routes>
    </Router>
  );
}

export default App;
