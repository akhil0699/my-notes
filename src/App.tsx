import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import CourseDetail from './pages/CourseDetail';
import SubjectDetail from './pages/SubjectDetail';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={
            <Layout>
              <Home />
            </Layout>
          } />
          <Route path="/course/:courseId" element={
            <Layout>
              <CourseDetail />
            </Layout>
          } />
          <Route path="/course/:courseId/subject/:subjectId" element={<SubjectDetail />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
