import './App.css'
import { Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Score from './components/Score';
import Search from './components/Search';

function App() {

  return (
    <Router>
      <div className=''>
        <div>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/quiz' element={<Quiz />} />
            <Route path='/score' element={<Score />} />
            <Route path='/search' element={<Search />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
