import React from 'react';

const SpotifyEmbed: React.FC = () => {
  return (
    <div style={{ borderRadius: '12px', overflow: 'hidden' }}>
      <iframe
        style={{ borderRadius: '12px' }}
        src="https://open.spotify.com/embed/artist/5Z71xE9prhpHrqL5thVMyK?utm_source=generator&theme=0"
        width="100%"
        height="352"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    </div>
  );
};

export default SpotifyEmbed;
