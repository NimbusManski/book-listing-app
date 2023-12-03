import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css';
import Books from './pages/Books';
import EditBook from './pages/EditBook';
import CreateBook from './pages/CreateBook';

function App() {
  return (
    <div className="App">
     <BrowserRouter>
      <Routes>
        <Route path={'/'} element={<Books />} /> 
        <Route path={'/create'} element={<CreateBook />} /> 
        <Route path={'/edit/:id'} element={<EditBook />} /> 

      </Routes>
     </BrowserRouter>
    </div>
  );
}

export default App;
