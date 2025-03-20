import './App.css'
import { Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import Home from './components/Home';

function App() {

  return (
    <Router>
      <div className=''>
        <div>
          <Routes>
            <Route path='/' element={<Home />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
