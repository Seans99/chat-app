import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Chat from './pages/Chat';
import ChatProvider from './context/ChatProvider';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ChatProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chats" element={<Chat />} />
          </Routes>
        </ChatProvider>
      </BrowserRouter>
    </div>

  );
}

export default App;
