import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext' 
import Profile from './components/Profile';

function App() {
    return (
        <div className='App'>
            <Router>
                <AuthProvider>
                    <Routes>
                        <Route exact path='/' element={<PrivateRoute><Home/></PrivateRoute>}/>
                        <Route path='/login' element={<Login/>} />
                        <Route path='/signup' element={<Signup/>} />
                        <Route path='/profile' element={<Profile/>} />
                    </Routes>
                </AuthProvider>
            </Router>
        </div>
    );
}

export default App;
