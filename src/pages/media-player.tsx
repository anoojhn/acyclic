import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import ReactAudioPlayer from 'react-audio-player';

const MediaPlayer = () => {
  const router = useRouter();
  const { file } = router.query;
  console.log(router);
  useEffect(() => {
    if (!file) {
      router.push('login');
    }
  }, [file]);
  return (
    <div className="bg-[url('../assets/background.jpeg')] bg-no-repeat bg-cover flex font-sans w-screen h-screen justify-center items-center py-4 px-4">
      {file && (
        <ReactAudioPlayer
          src={`https://skywalker.infura-ipfs.io/ipfs/${file}`}
          autoPlay
          className="w-3/4 h-3/4 backdrop-filter backdrop-blur-md border rounded-3xl"
          controls
        />
      )}
    </div>
  );
};

export default MediaPlayer;
