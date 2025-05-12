import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './components/Home';
import EventDetails from './components/EventDetails';
import Congratulations from './components/Congratulations';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Bookings from './components/Bookings';
import AdminPanel from './components/AdminPanel';
import AdminEventsList from './components/admin/AdminEventsList';
import EventForm from './components/EventForm';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/common/AdminRoute';
import NotFound from './components/common/NotFound';
import AdminUsersList from './components/admin/AdminUsersList';
import CategoryForm from './components/CategoryForm';
function App() {
  return (
   <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/congratulations" element={<Congratulations />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<PrivateRoute />}>
          <Route path="/bookings" element={<Bookings />} />
          
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPanel />}>
              <Route path="events" element={<AdminEventsList />} />
              <Route path="events/new" element={<EventForm />} />
              <Route path="events/:id/edit" element={<EventForm />} />
              <Route path="users" element={<AdminUsersList/>} />
              <Route path="categories/create" element={<CategoryForm />} />
            </Route>
          </Route>
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}

export default App