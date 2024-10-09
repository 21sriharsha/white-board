import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Board from './page/Board';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Board />,
    },
  ]);

  return (
    <div className='md:space-y-16 space-y-10'>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;