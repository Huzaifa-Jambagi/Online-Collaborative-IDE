import { Avatar } from '@mui/material';

const Client = ({socketId, username}) => {
  // Get initials from username
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  return (
    <div className="d-flex align-items-center mb-3">
      <Avatar 
        sx={{ 
          width: 50, 
          height: 50, 
          bgcolor: '#6c757d',
          fontSize: '18px',
          fontWeight: 'bold'
        }}
        className="me-3"
      >
        {getInitials(username.toString())}
      </Avatar>
      <span className="mx-2">{username.toString() || "Unknown User"}</span>
    </div>
  )
}

export default Client;