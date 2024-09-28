import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Hero from './components/Hero';
import Board from './page/Board';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Hero />,
    },
    {
      path: '/board',
      element: <Board />
    }
  ]);

  return (
    <div className='md:space-y-16 space-y-10'>
      {/* <Header /> */}
      <RouterProvider router={router} />
      {/* <Footer /> */}
    </div>
  );
}

export default App;