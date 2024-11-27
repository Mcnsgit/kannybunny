// import React, { useState } from 'react';
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

// const CardDetails = ({ cardData, onClose, onUpdate }) => {
//   const [updatedTitle, setUpdatedTitle] = useState(cardData.title);
//   const [updatedDescription, setUpdatedDescription] = useState(cardData.description);

//   const handleUpdate = () => {
//     const updatedCardData = { ...cardData, title: updatedTitle, description: updatedDescription };
//     onUpdate(updatedCardData);
//     onClose();
//   };

//   return (
//     <Dialog open={!!cardData} onClose={onClose}>
//       {cardData && (
//         <>
//           <DialogTitle>Edit Card</DialogTitle>
//           <DialogContent>
//             <TextField
//               label="Title"
//               value={updatedTitle}
//               onChange={(e) => setUpdatedTitle(e.target.value)}
//               fullWidth
//               margin="normal"
//             />
//             <TextField
//               label="Description"
//               value={updatedDescription}
//               onChange={(e) => setUpdatedDescription(e.target.value)}
//               multiline
//               fullWidth
//               margin="normal"
//             />
//             {/* Render other card details as needed */}
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleUpdate} color="primary">Update</Button>
//             <Button onClick={onClose} color="secondary">Cancel</Button>
//           </DialogActions>
//         </>
//       )}
//     </Dialog>
//   );
// };

// export default CardDetails;
