import axios from 'axios';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('/api/rooms/join', data);

            navigate(`/editor/${data.roomId}`, { state: { username: data.username } });
        } catch (error) {

            alert('Failed to join room');
        }

    };

    return (
        <div className="container-fluid">
            <div className="row justify-content-center align-items-center min-vh-100 desktop">
                <div className="col-12 col-md-6">
                    <div className="card shadow-sm p-2 mb-5 bg-secondary rounded">
                        <div className="card-body text-center bg-dark">
                            <img className="img-fluid mx-auto d-block" src="logonobg.png" alt="CodeSync" style={{ maxWidth: "170px" }} />
                            <h4 className="text-light">Enter the Room Id</h4>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Room Id"
                                        {...register('roomId', { required: true })}
                                    />
                                    {errors.roomId && <span className="text-danger">Room Id is required</span>}
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Username"
                                        {...register('username', { required: true })}
                                    />
                                    {errors.username && <span className="text-danger">Username is required</span>}
                                </div>
                                <button type="submit" className="btn btn-success btn-lg btn-block">JOIN</button>
                            </form>
                            <p className="mt-3 text-light">
                                Don’t have a room Id? <span className="text-success p-2" style={{ cursor: "pointer" }}>New Room</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
                {/* mobile screens */}
            <div className="mobile-warning">
                This IDE is built for desktop use. Please use a larger screen 💻
            </div>
        </div>

    )
}

export default Home;
