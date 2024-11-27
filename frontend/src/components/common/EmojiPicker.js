import { Box, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

const EmojiPicker = props => {
  const [selectedEmoji, setSelectedEmoji] = useState()
  const [isShowPicker, setIsShowPicker] = useState(false)

  useEffect(() => {
    setSelectedEmoji(props.icon)
  }, [props.icon])

  const selectEmoji = (emoji) => {
    setIsShowPicker(false)
    props.onChange(emoji.native)
  }

  const showPicker = () => setIsShowPicker(!isShowPicker)

  return (
    <Box sx={{ position: 'relative', width: 'max-content' }}>
      <Typography
        variant='h3'
        fontWeight='700'
        sx={{ cursor: 'pointer' }}
        onClick={showPicker}
      >
        {selectedEmoji}
      </Typography>
      <Box sx={{
        display: isShowPicker ? 'block' : 'none',
        position: 'absolute',
        top: '100%',
        zIndex: '9999'
      }}>
        <Picker 
          data={data} 
          onEmojiSelect={selectEmoji}
          theme="light"
          previewPosition="none"
        />
      </Box>
    </Box>
  )
}

export default EmojiPicker