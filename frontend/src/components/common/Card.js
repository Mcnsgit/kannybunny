// import React, { useState } from 'react';
// import { Box, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
// import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
// import EditIcon from '@mui/icons-material/Edit';

// const Card = ({ cardData, onDelete }) => {
//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [editedTitle, setEditedTitle] = useState(cardData.title);

//   const handleEditOpen = () => {
//     setIsEditOpen(true);
//   };

//   const handleEditClose = () => {
//     setIsEditOpen(false);
//   };

//   const handleEditSave = () => {
//     // Save edited title to the parent component or perform any other action
//     console.log("Edited title:", editedTitle);
//     setIsEditOpen(false);
//   };

//   const handleDelete = () => {
//     // Pass the card id to the parent component to handle deletion
//     onDelete(cardData.id);
//   };

//   return (
//     <Box
//       sx={{
//         padding: '10px',
//         marginBottom: '8px',
//         backgroundColor: '#ffffff',
//         borderRadius: '4px',
//         boxShadow: '0 1px 2px rgba(9,30,66,.25)',
//       }}
//     >
//       <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
//         {cardData.title}
//       </Typography>
//       <Typography variant="body2">{cardData.dueDate}</Typography>
//       {/* Render other card details as needed */}

//       {/* Edit button */}
//       <IconButton onClick={handleEditOpen} sx={{ color: 'primary', marginRight: '8px' }}>
//         <EditIcon />
//       </IconButton>

//       {/* Delete button */}
//       <IconButton onClick={handleDelete} sx={{ color: 'error' }}>
//         <DeleteOutlineIcon />
//       </IconButton>

//       {/* Edit Dialog */}
//       <Dialog open={isEditOpen} onClose={handleEditClose}>
//         <DialogTitle>Edit Card Title</DialogTitle>
//         <DialogContent>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Title"
//             type="text"
//             fullWidth
//             value={editedTitle}
//             onChange={(e) => setEditedTitle(e.target.value)}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleEditClose}>Cancel</Button>
//           <Button onClick={handleEditSave}>Save</Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default Card;
