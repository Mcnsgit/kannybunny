import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  IconButton,
  Card as MuiCard,
  Paper,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import listApi from "../../api/listApi";
import cardApi from "../../api/cardApi";
import CardModal from "./CardModal";

const Kanban = ({ boardId = '', data = [] }) => {
  const [lists, setLists] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [editingList, setEditingList] = useState(null);
  const [newListTitle, setNewListTitle] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedList, setSelectedList] = useState(null);

  useEffect(() => {
    setLists(Array.isArray(data) ? data.map(list => ({
      ...list,
      cards: list.cards || []
    })) : []);
  }, [data]);

  const onDragEnd = async ({ source, destination }) => {
    if (!destination) return;

    const sourceListIndex = lists.findIndex(list => list.id === source.droppableId);
    const destinationListIndex = lists.findIndex(list => list.id === destination.droppableId);

    if (sourceListIndex < 0 || destinationListIndex < 0) return;

    const newLists = [...lists];
    const sourceList = newLists[sourceListIndex];
    const destinationList = newLists[destinationListIndex];

    // Moving within the same list
    if (source.droppableId === destination.droppableId) {
      const newCards = [...sourceList.cards];
      const [movedCard] = newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, movedCard);
      newLists[sourceListIndex].cards = newCards;

      try {
        await cardApi.updatePosition(boardId, {
          cards: newCards.map((card, index) => ({
            id: card._id,
            position: index
          })),
          listId: destination.droppableId
        });
        setLists(newLists);
      } catch (err) {
        console.error('Error updating card position:', err);
        setLists(lists); // Revert on error
      }
    } else {
      // Moving between lists
      const sourceCards = [...sourceList.cards];
      const destinationCards = [...destinationList.cards];
      const [movedCard] = sourceCards.splice(source.index, 1);
      destinationCards.splice(destination.index, 0, { ...movedCard, listId: destination.droppableId });

      newLists[sourceListIndex].cards = sourceCards;
      newLists[destinationListIndex].cards = destinationCards;

      try {
        await cardApi.updatePosition(boardId, {
          cards: [
            ...sourceCards.map((card, index) => ({
              id: card._id,
              position: index,
              listId: source.droppableId
            })),
            ...destinationCards.map((card, index) => ({
              id: card._id,
              position: index,
              listId: destination.droppableId
            }))
          ]
        });
        setLists(newLists);
      } catch (err) {
        console.error('Error updating card position:', err);
        setLists(lists); // Revert on error
      }
    }
  };

  const createList = async () => {
    try {
      const res = await listApi.create(boardId);
      setLists([...lists, { ...res, cards: [] }]);
    } catch (err) {
      console.error('Error creating list:', err);
    }
  };

  const deleteList = async (listId) => {
    try {
      await listApi.delete(boardId, listId);
      const newLists = lists.filter(l => l.id !== listId);
      setLists(newLists);
      handleCloseMenu();
    } catch (err) {
      console.error('Error deleting list:', err);
    }
  };

  const updateListTitle = async (listId, newTitle) => {
    try {
      await listApi.update(boardId, listId, { title: newTitle });
      const newLists = lists.map(l => 
        l.id === listId ? { ...l, title: newTitle } : l
      );
      setLists(newLists);
      setEditingList(null);
    } catch (err) {
      console.error('Error updating list title:', err);
    }
  };

  const createCard = async (listId) => {
    try {
      const res = await cardApi.create(boardId, { listId });
      const newLists = lists.map(l => {
        if (l.id === listId) {
          return {
            ...l,
            cards: [...l.cards, res]
          };
        }
        return l;
      });
      setLists(newLists);
    } catch (err) {
      console.error('Error creating card:', err);
    }
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedList(null);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          width: '100%',
          overflowX: 'auto',
          p: 2
        }}
      >
        {lists.map(list => (
          <div key={list.id} style={{ minWidth: 300, marginRight: 16 }}>
            <Droppable droppableId={list.id} type="CARD">
              {(provided) => (
                <Paper
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  sx={{ p: 2, bgcolor: 'background.default' }}
                >
                  <Box sx={{ mb: 2 }}>
                    {editingList === list.id ? (
                      <TextField
                        fullWidth
                        value={newListTitle}
                        onChange={(e) => setNewListTitle(e.target.value)}
                        onBlur={() => updateListTitle(list.id, newListTitle)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            updateListTitle(list.id, newListTitle);
                          }
                        }}
                        autoFocus
                      />
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h6" onClick={() => {
                          setEditingList(list.id);
                          setNewListTitle(list.title);
                        }}>
                          {list.title}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            setAnchorEl(e.currentTarget);
                            setSelectedList(list);
                          }}
                        >
                          <MoreHorizIcon />
                        </IconButton>
                      </Box>
                    )}
                  </Box>

                  {list.cards.map((card, index) => (
                    <Draggable key={card._id} draggableId={card._id} index={index}>
                      {(provided, snapshot) => (
                        <MuiCard
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{
                            mb: 1,
                            cursor: snapshot.isDragging ? 'grabbing' : 'pointer',
                            '&:hover': { bgcolor: 'action.hover' }
                          }}
                          onClick={() => setSelectedCard(card)}
                        >
                          <Box sx={{ p: 2 }}>
                            <Typography>{card.title || 'Untitled'}</Typography>
                          </Box>
                        </MuiCard>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}

                  <Button
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => createCard(list.id)}
                    startIcon={<AddOutlinedIcon />}
                  >
                    Add Card
                  </Button>
                </Paper>
              )}
            </Droppable>
          </div>
        ))}

        <Button
          variant="outlined"
          startIcon={<AddOutlinedIcon />}
          onClick={createList}
          sx={{ minWidth: 300, height: '100%' }}
        >
          Add List
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={() => {
            if (selectedList) {
              setEditingList(selectedList.id);
              setNewListTitle(selectedList.title);
            }
            handleCloseMenu();
          }}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Title</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => {
            if (selectedList) {
              deleteList(selectedList.id);
            }
          }}>
            <ListItemIcon>
              <DeleteOutlineIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete List</ListItemText>
          </MenuItem>
        </Menu>

        {selectedCard && (
          <CardModal
            card={selectedCard}
            onClose={() => setSelectedCard(null)}
            boardId={boardId}
            onUpdate={(updatedCard) => {
              const newLists = lists.map(list => ({
                ...list,
                cards: list.cards.map(card =>
                  card._id === updatedCard._id ? updatedCard : card
                )
              }));
              setLists(newLists);
            }}
          />
        )}
      </Box>
    </DragDropContext>
  );
};

export default Kanban;