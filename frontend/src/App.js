import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Board from './page/Board';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Hero />,
    },
    {
      path: "/about",
      element: <About />,
    },
    {
      path: "/contact",
      element: <Contact />,
    },
    {
      path: '/white-board',
      element: <Board />
    }
  ]);

  return (
    <div className='md:space-y-16 space-y-10'>
      <RouterProvider router={router} />
      <Footer />
    </div>
  );
}

export default App;
