import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'
import Layout from './components/layout/Layout'
import LoadingSpinner from './components/ui/LoadingSpinner'
import Notifications from './components/ui/Notifications'
import ErrorBoundary from './components/error/ErrorBoundary'
import { EventsProvider } from './context/EventsContext'
import { AuthProvider } from './context/AuthContext'
import { BlogProvider } from './context/BlogContext'
import { ContentProvider } from './context/ContentContext'
import { UserProvider } from './context/UserContext'
import { ResourceProvider } from './context/ResourceContext'
import { StartupProvider } from './context/StartupContext'
import { NotificationProvider } from './context/NotificationContext'

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const EventsPage = lazy(() => import('./pages/EventsPage'))
const EventDetailPage = lazy(() => import('./pages/EventDetailPage'))
const StartupsPage = lazy(() => import('./pages/StartupsPage'))
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'))
const GalleryPage = lazy(() => import('./pages/GalleryPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'))
const GetInvolvedPage = lazy(() => import('./pages/GetInvolvedPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

// Admin pages
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'))
const AdminLogin = lazy(() => import('./pages/admin/Login'))
const AdminRegister = lazy(() => import('./pages/admin/Register'))
const AdminForgotPassword = lazy(() => import('./pages/admin/ForgotPassword'))
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminEvents = lazy(() => import('./pages/admin/Events'))
const AdminStartups = lazy(() => import('./pages/admin/Startups'))
const AdminBlog = lazy(() => import('./pages/admin/Blog'))
const AdminGallery = lazy(() => import('./pages/admin/Gallery'))
const AdminUsers = lazy(() => import('./pages/admin/Users'))
const AdminSettings = lazy(() => import('./pages/admin/Settings'))
const AdminResources = lazy(() => import('./pages/admin/Resources'))
const AdminContentManager = lazy(() => import('./pages/admin/ContentManager'))
const TestLogin = lazy(() => import('./pages/admin/TestLogin'))

// Auth components
const ProtectedRoute = lazy(() => import('./components/auth/ProtectedRoute'))

function App() {
  // Add debugging to check if App is rendering
  useEffect(() => {
    console.log('App component rendered');
  }, []);

  return (
    <NotificationProvider>
      <AuthProvider>
        <UserProvider>
          <ResourceProvider>
            <ContentProvider>
              <EventsProvider>
                <StartupProvider>
                  <BlogProvider>
                    <Suspense fallback={<div className="flex items-center justify-center h-screen"><LoadingSpinner /></div>}>
                      {/* Global Notifications Component */}
                      <Notifications />
                      
                      <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<Layout />}>
                          <Route index element={<HomePage />} />
                          <Route path="about" element={<AboutPage />} />
                          <Route path="events" element={<EventsPage />} />
                          <Route path="events/:id" element={<EventDetailPage />} />
                          <Route path="startups" element={<StartupsPage />} />
                          <Route path="resources" element={<ResourcesPage />} />
                          <Route path="gallery" element={<GalleryPage />} />
                          <Route path="contact" element={<ContactPage />} />
                          <Route path="blog" element={<BlogPage />} />
                          <Route path="blog/:slug" element={<BlogPostPage />} />
                          <Route path="get-involved" element={<GetInvolvedPage />} />
                          <Route path="*" element={<NotFoundPage />} />
                        </Route>
                        
                        {/* Admin auth routes */}
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="/admin/register" element={<AdminRegister />} />
                        <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
                        <Route path="/admin/test-login" element={<TestLogin />} />
                        
                        {/* Admin dashboard routes - Protected */}
                        <Route path="/admin" element={<AdminLayout />}>
                          <Route element={<ProtectedRoute requireAdmin={true} />}>
                            <Route index element={<AdminDashboard />} />
                            <Route path="events" element={<AdminEvents />} />
                            <Route path="startups" element={<AdminStartups />} />
                            <Route path="blog" element={<AdminBlog />} />
                            <Route path="gallery" element={<AdminGallery />} />
                            <Route path="resources" element={<AdminResources />} />
                            <Route path="users" element={<AdminUsers />} />
                            <Route path="settings" element={<AdminSettings />} />
                            <Route path="content/:contentType" element={<AdminContentManager />} />
                          </Route>
                        </Route>
                      </Routes>
                    </Suspense>
                  </BlogProvider>
                </StartupProvider>
              </EventsProvider>
            </ContentProvider>
          </ResourceProvider>
        </UserProvider>
      </AuthProvider>
    </NotificationProvider>
  )
}

export default App