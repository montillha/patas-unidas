import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { AppRoutes } from './routes';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Header />
        <main>
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
