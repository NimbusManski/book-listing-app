import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css';
import Books from './pages/Books';
import UpdateBook from './pages/UpdateBook';
import CreateBook from './pages/CreateBook';

function App() {
  return (
    <div className="App">
     <BrowserRouter>
      <Routes>
        <Route path={'/'} element={<Books />} /> 
        <Route path={'/create'} element={<CreateBook />} /> 
        <Route path={'/update/:id'} element={<UpdateBook />} /> 
      </Routes>
     </BrowserRouter>
    </div>
  );
}

export default App;
