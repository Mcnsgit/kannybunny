import React from 'react';
import { Button } from '@mui/material';

const SaveButtonSaveCard = ({ onSave }) => {
  const handleSave = () => {
    if (typeof onSave === 'function') {

      onSave();
    }
  };

  return (

    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>

      <Button variant="contained" color="primary" onClick={handleSave}>
        Save
      </Button>
    </div>
  );
};

export default SaveButtonSaveCard;

