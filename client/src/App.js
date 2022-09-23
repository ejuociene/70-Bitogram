import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import axios from "axios"
import Alert from './components/Alert/Alert';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Explore from './pages/Explore';
import MyProfile from "./pages/MyProfile"
import Profile from "./pages/Profile"
import NewPost from "./pages/NewPost"
import EditProfile from './pages/EditProfile';
import Comment from "./pages/Comment"
import UserPosts from "./pages/UserPosts"
import MainContext from './context/MainContext';
import NotFound from "./pages/404"

function App() {
	const [ alert, setAlert ] = useState({
		message: '',
		status: ''
	});
	const [userInfo, setUserInfo] = useState({})
	const [refresh, setRefresh] = useState(false)
	const [loggedIn, setLoggedIn] = useState(false)
	const [home, setHome] = useState(true)
	const contextValues = { alert, setAlert, setRefresh, userInfo, home, setHome };
	useEffect(() => {
		axios.get("/api/users/check-auth/")
		.then(resp => {
				setLoggedIn(true);
				setUserInfo(resp.data)
			}).catch(err => {
			console.log(err)
			setLoggedIn(false)
			})}, [refresh])
	return (
		<BrowserRouter>
			<MainContext.Provider value={contextValues}>
				<div className='App'> 
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/register" element={<Register />} />
					{ loggedIn && <>
					<Route path="/explore" element={<><Header/><Explore /><Footer/></>} />
					<Route path="/my-profile" element={<><MyProfile /><Footer/></>} />
					<Route path="/edit-profile" element={<EditProfile />} />
					<Route path="/profile/:id" element={<><Profile /><Footer/></>} />
					<Route path="/new-post" element={<NewPost/>} />
					<Route path="/comments/:postId" element={<Comment/>} />
					<Route path="/userPosts/:userId" element={<><UserPosts/><Footer/></>} />
					</>
					}
					<Route path="*" element={<NotFound/>}/>
				</Routes>
					</div>
			</MainContext.Provider>
		</BrowserRouter>
	);
}

export default App;
