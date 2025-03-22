import './App.css'
import { Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Score from './components/Score';

function App() {

  return (
    <Router>
      <div className=''>
        <div>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/quiz' element={<Quiz />} />
            <Route path='/score' element={<Score />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
