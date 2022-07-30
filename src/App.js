import { BrowserRouter as Router, Route, Switch, Redirect  } from 'react-router-dom';
import './App.css';
import Login from './components/login';

function App() {
  return (
    <div className='App'>
        <Router>
                <Switch>
                    {/* <AuthProvider> */}
                        <Route exact path="/">
                            <Redirect to="/Login" />
                        </Route>
                        <Route exact path="/Login" component={Login} />
                        {/* <Route exact path="/SignUp" component={SignUp} />
                        <Route exact path="/forgot-password" component={ForgotPassword} />
                        <Route exact path="/simpleswap-affiliate-widget" component={SimpleSwap} />
                        <Route exact path="/robo-advisor-NFA-lol" component={RoboAdvisor} /> */}
                        {/* Private Routes */}
                        {/* <PrivateRoute exact path="/Home" component={Home} />
                        <PrivateRoute exact path="/Friends" component={Friends} />
                        <PrivateRoute exact path="/global-chat" component={Chat} />
                        <PrivateRoute exact path="/Add" component={playerForm} />
                        <PrivateRoute exact path="/Profile" component={Profile} />
                        <PrivateRoute exact path="/update-profile" component={UpdateProfile} />
                        <PrivateRoute exact path="/Scorecard" component={ScoreCard} /> */}
                        
                    {/* </AuthProvider> */}
                </Switch>
        </Router>
    </div>
);
}

export default App;
