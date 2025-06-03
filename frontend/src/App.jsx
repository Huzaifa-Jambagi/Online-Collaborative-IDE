import { Toaster } from 'react-hot-toast';
import { Route, Routes } from 'react-router-dom';
import Editorpage from './Components/Editorpage';
import Home from './Components/Home';
import Nopage from './Components/Nopage';

function App() {

  return (
    <>
      <Toaster position='top-center'></Toaster>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/editor/:roomid' element={<Editorpage />} />
        <Route path='*' element={<Nopage />} />
      </Routes>
    </>

  )
}

export default App
