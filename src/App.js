import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import Login from './components/Authentication/Login';
import Signup from './components/Authentication/Signup';
import Home from './components/Home';
import PrivateRoute from './components/Authentication/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext' 
import { FirestoreProvider } from './contexts/FirestoreContext';
import Profile from './components/Profile';
import ForgotPassword from './components/Authentication/ForgotPassword';
import Friends from './components/Friends';
import CryptoPortfolio from './components/CryptoPortfolio';
import { CryptoProvider } from './contexts/CryptoContext';

function App() {
    return (
        <div className='App'>
            <Router>
                <AuthProvider>
                    <FirestoreProvider>
                        <CryptoProvider>
                            <Routes>
                                {/* Protected Routes */}
                                <Route exact path='/' element={<PrivateRoute><Home/></PrivateRoute>}/>
                                <Route path='/profile' element={<PrivateRoute><Profile/></PrivateRoute>} />
                                <Route path='/friends' element={<PrivateRoute><Friends/></PrivateRoute>} />
                                {/* Public Routes */}
                                <Route path='/login' element={<Login/>} />
                                <Route path='/signup' element={<Signup/>} />
                                <Route path='/forgot-password' element={<ForgotPassword/>} />
                                <Route path='rishi-crypto-portfolio' element={<CryptoPortfolio/>}/>
                            </Routes>
                        </CryptoProvider>
                    </FirestoreProvider>
                </AuthProvider>
            </Router>
        </div>
    );
}

export default App;
