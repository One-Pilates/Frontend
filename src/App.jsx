import './global.css'
import { Routes, Route } from 'react-router-dom'
import PrivateRoutes from './routes/PrivateRoutes'
import PublicRoutes from './routes/PublicRoutes'
import TeacherRoutes from './routes/TeacherRoutes'
// import SecretaryRoutes from './routes/SecretaryRoutes'

function App() {
  return (
    <Routes>
      <Route element={<PrivateRoutes />}>
        <Route path="/professora/*" element={<TeacherRoutes />} />
        {/* <Route path="/secretaria/*" element={<SecretaryRoutes />} /> */}
      </Route>
      <Route path="/*" element={<PublicRoutes />} />
    </Routes>
  )
}

export default App
