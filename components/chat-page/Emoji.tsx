import React, { VFC } from 'react';
import { stripHexcode } from 'emojibase';
import {
  CanonicalEmoji,
  PathConfig,
} from 'interweave-emoji';
import EmojiPicker from 'interweave-emoji-picker';

interface IProps {
  onSelectEmoji: (e: CanonicalEmoji) => void;
}

const Emoji: VFC<IProps> = ({ onSelectEmoji }) => {
  const emojiPath = (hexcode: string, { enlarged }: PathConfig) => `https://cdn.jsdelivr.net/gh/joypixels/emoji-assets@latest/png/${
    enlarged ? 64 : 32
  }/${stripHexcode(hexcode).toLowerCase()}.png`;

  const skinIcons = {
    none: <i className="fas fa-hand-paper" />,
    light: <i className="fas fa-hand-paper" />,
    mediumLight: <i className="fas fa-hand-paper" />,
    medium: <i className="fas fa-hand-paper" />,
    mediumDark: <i className="fas fa-hand-paper" />,
    dark: <i className="fas fa-hand-paper" />,
  };

  const clearIcon = <i className="fas fa-times" />;

  return (
    <div className="interweave__examples">
      <div className="demo-grid">
        <div className="slack">
          <EmojiPicker
            emojiLargeSize={48}
            emojiPadding={6}
            emojiPath={emojiPath}
            emojiSize={22}
            onSelectEmoji={onSelectEmoji}
            clearIcon={clearIcon}
            commonMode="recently-used"
            displayOrder={['groups', 'search', 'emojis']}
            messages={{ noPreview: 'Emoji Deluxe™' }}
            skinIcons={skinIcons}
          />
        </div>
      </div>
    </div>
  );
};

export default Emoji;
