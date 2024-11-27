// import React, { useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useParams } from 'react-router-dom';
// import { Box, Typography, TextField, Button } from '@mui/material';
// import { addList } from '../../redux/features/boardSlice';
// import listApi from '../../api/listApi';
// import Kanban from './Kanban';

// const Board = () => {
//     const { boardId } = useParams();
//     const board = useSelector((state) => state.board.value.find((board) => board.id === boardId));
//     const dispatch = useDispatch();
//     const [newListTitle, setNewListTitle] = useState('');

//     const handleAddList = async () => {
//         try {
//             const res = await listApi.create(boardId, { title: newListTitle });
//             dispatch(addList(res));
//             setNewListTitle('');
//         } catch (err) {
//             alert(err);
//         }
//     };

//     return (
//         <Box>
//             <Typography variant="h4">{board.title}</Typography>
//             {/* Render any other board-level information */}
//             <Kanban data={board.lists} boardId={boardId} />
//             <Box>
//                 <TextField
//                     value={newListTitle}
//                     onChange={(e) => setNewListTitle(e.target.value)}
//                     placeholder="Enter list title"
//                 />
//                 <Button onClick={handleAddList}>Add List</Button>
//             </Box>
//             {/* Handle other board-specific actions or events */}
//         </Box>
//     );
// };

// export default Board;
