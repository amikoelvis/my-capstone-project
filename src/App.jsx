import './App.css'
import { Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import Home from './components/Home';
import Quiz from './components/Quiz';

function App() {

  return (
    <Router>
      <div className=''>
        <div>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/quiz' element={<Quiz />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
