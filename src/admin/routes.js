import Dashboard from './pages/Dashboard';
import Branch from './pages/Branch';
import RoomManagementPage from './pages/Room';
import BookingManagementPage from './pages/Bookings';
// Import các page khác nếu cần

export const adminRoutes = [
  {
    path: '/admin/dashboard',
    component: Dashboard,
    roles: ['admin'],
  },
  {
    path: '/admin/branch',
    component: Branch,
    roles: ['admin'],
  },
  {
    path: '/admin/room',
    component: RoomManagementPage,
    roles: ['admin'],
  },
  {
    path: '/admin/booking',
    component: BookingManagementPage,
    roles: ['admin', 'receptionist'],
  }

];
