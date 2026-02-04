import { Navigate, Routes, Route } from 'react-router-dom';
import Teacher from '../features/Teacher/Teacher';
import Dashboard from '../features/Teacher/Dashboard'; 
import Profile from '../features/Teacher/Profile'; 
import Calendar from '../features/Teacher/Calendar'; 
import NotFound from './NotFound';

export default function TeacherRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Teacher />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="perfil" element={<Profile />} />
        <Route path="agenda" element={<Calendar />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
