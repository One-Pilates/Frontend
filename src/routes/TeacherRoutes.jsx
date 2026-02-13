import { Navigate, Routes, Route } from 'react-router-dom';
import Teacher from '../pages/Teacher/Teacher';
import Dashboard from '../pages/Teacher/Dashboard';
import Profile from '../pages/Teacher/Profile';
import Calendar from '../pages/Teacher/Calendar';
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
