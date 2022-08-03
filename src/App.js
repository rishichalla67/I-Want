import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext' 
import EditProfile from './components/EditProfile';
import Profile from './components/Profile';
import ForgotPassword from './components/ForgotPassword';

function App() {
    return (
        <div className='App'>
            <Router>
                <AuthProvider>
                    <Routes>
                        {/* Protected Routes */}
                        <Route exact path='/' element={<PrivateRoute><Home/></PrivateRoute>}/>
                        <Route path='/profile' element={<PrivateRoute><Profile/></PrivateRoute>} />
                        <Route path='/edit-profile' element={<PrivateRoute><EditProfile/></PrivateRoute>} />
                        {/* Public Routes */}
                        <Route path='/login' element={<Login/>} />
                        <Route path='/signup' element={<Signup/>} />
                        <Route path='/forgot-password' element={<ForgotPassword/>} />
                    </Routes>
                </AuthProvider>
            </Router>
        </div>
    );
}

export default App;
