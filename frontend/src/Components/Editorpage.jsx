import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { initSocket } from "../socket";
import Client from "./Client";
import Editor from "./Editor";
const Editorpage = () => {

  const socketRef = useRef(null);
  const location = useLocation()
  const { roomId } = useParams()
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();

      socketRef.current.on('connect_error', (err) => handleError(err))
      socketRef.current.on('connect_failed', (err) => handleError(err))

      const handleError = (e) => {
        console.log('socket error', e)
        toast.error('Socket connection failed')
        navigate('/');
      }

      socketRef.current.emit('join', {
        roomId,
        username: location.state?.username

      })
    }
    init();
  }, [])

  const [members, setMembers] = useState([
    {
      socketId: 1,
      username: "Huzaifa"
    },
    {
      socketId: 2,
      username: "Zain"
    },
    {
      socketId: 3,
      username: "Raheem"
    },
    {
      socketId: 4,
      username: "Zohaib"
    }
  ])

  if(!location.state){
    navigate('/')
  }
  return (
    <div className="container-fluid vh-100 px-0 ">
      <div className="row h-100 g-0 desktop">
        <div className="col-md-2 bg-dark text-light d-flex flex-column h-100" style={{ boxShadow: "2px 0px 4px rgba(0,0,0,0.5)" }}>

          <img src="/logonobg.png"
            alt="logo"
            className="image-fluid mx-auto"
            style={{ maxWidth: "170px", marginLeft: "1vw", marginTop: "-30px" }} />
          <hr style={{ marginTop: "-2rem" }} />
          <div className="d-flex flex-column overflow overflow-auto">
            {members.map((member) => (
              <Client key={member.socketId} username={member.username} />
            ))}
          </div>
          {/* buttons */}
          <div className="mt-auto d-grid gap-2">
            <hr />
            <button className="btn btn-success w-75 px-3 mb-2 " style={{ marginLeft: "1vw" }}>
              Copy Room Id
            </button>
            <button className="btn btn-danger w-75 px-3 mb-3" style={{ marginLeft: "1vw" }}>
              Leave
            </button>
          </div>
        </div>

        <div className="col-md-10 d-flex flex-column h-100 text-light">

          <div className="flex-grow-1" style={{ minHeight: 0, height: '100%' }}>
            <Editor />
          </div>
        </div>
      </div>
      {/* mobile screens */}
      <div className="mobile-warning">
        This IDE is built for desktop use. Please use a larger screen 💻
      </div>
    </div>
  );
};

export default Editorpage;