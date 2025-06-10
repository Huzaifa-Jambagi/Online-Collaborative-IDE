import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { initSocket } from "../socket";
import Client from "./Client";
import Editor from "./Editor";

const Editorpage = () => {
  const socketRef = useRef(null);
  const location = useLocation();
  const { roomid } = useParams();
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const codeRef = useRef("");

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
     
      const handleErrors = (err) => {
        console.log("Socket connection error:", err);
        toast.error("Socket connection failed. Try again later.");
        navigate("/");
      };

      socketRef.current.on("connect_error", handleErrors);
      socketRef.current.on("connect_failed", handleErrors);

      socketRef.current.emit("join", {
        roomid,
        username: location.state?.username,
      });

      socketRef.current.on("user-joined", ({ clients, username }) => {
        if (username !== location.state?.username) {
          toast.success(`${username} joined`);
        }
        setClients(clients);
      });

      socketRef.current.on("user-disconnected", ({ socketId, username }) => {
        toast.error(`${username} left`);
        console.log(`${username} left`)
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId)
        });
      });
    };

    init();

    return () => {
      socketRef.current.disconnect();
      socketRef.current.off('user-joined');
      socketRef.current.off('user-disconnected');
    }
  }, []);

  if (!location.state) {
    return <Navigate to="/" />;
  }

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomid);
      toast.success("Room ID copied!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy Room ID");
    }
  };

  const leaveRoom = () => {
    navigate("/");
  };

  return (
    <div className="container-fluid vh-100 px-0">
      <div className="row h-100 g-0 desktop">
        <div className="col-md-2 bg-dark text-light d-flex flex-column h-100" style={{ boxShadow: "2px 0px 4px rgba(0,0,0,0.5)" }}>
          <img src="/logonobg.png" alt="logo" className="image-fluid mx-auto" style={{ maxWidth: "170px", marginLeft: "1vw", marginTop: "-30px" }} />
          <hr style={{ marginTop: "-2rem" }} />
          <div className="d-flex flex-column overflow-auto">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
          <div className="mt-auto d-grid gap-2">
            <hr />
            <button className="btn btn-success w-75 px-3 mb-2" style={{ marginLeft: "1vw" }} onClick={copyRoomId}>
              Copy Room Id
            </button>
            <button className="btn btn-danger w-75 px-3 mb-3" style={{ marginLeft: "1vw" }} onClick={leaveRoom}>
              Leave
            </button>
          </div>
        </div>
        <div className="col-md-10 d-flex flex-column h-100 text-light">
          <div className="flex-grow-1" style={{ minHeight: 0, height: "100%" }}>
            <Editor socketRef={socketRef} codeRef={codeRef} />
          </div>
        </div>
      </div>
      <div className="mobile-warning">
        This IDE is built for desktop use. Please use a larger screen 💻
      </div>
    </div>
  );
};

export default Editorpage;