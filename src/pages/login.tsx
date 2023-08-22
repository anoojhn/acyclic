import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import predefinedAudio from '../assets/audio.mp3';

const apiKey = process.env.NEXT_PUBLIC_IPFS_API_KEY;
const secretKey = process.env.NEXT_PUBLIC_IPFS_SECRET_KEY;
const authorization = `Basic ${btoa(`${apiKey}:${secretKey}`)}`;

const LoginPage = () => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState();

  const client = ipfsHttpClient({
    url: 'https://ipfs.infura.io:5001',
    headers: {
      authorization,
    },
  });

  const handleMetaMaskConnect = async () => {
    if (!window.ethereum) {
      alert('missing metamask extension');
      return;
    }

    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    setUser(accounts[0]);
  };
  console.log(router);

  const handleMusicFileupload = async (file?: any) => {
    const blob = file.slice(0, file.size, file.type);
    const extension = file.name.split('.').pop();
    const modifiedFile = new File([blob], `${new Date()}.${extension}`, {
      type: file.type,
    });

    console.log(modifiedFile);

    const result = await client.add(modifiedFile);
    console.log(result);
    router.push(
      {
        pathname: '/media-player',
        query: {
          file: result.path,
        },
      },
      '/media-player',
    );
  };

  const uploadPredefinedAudioToIPFS = async () => {
    const response = await fetch(predefinedAudio);

    const blob = await response.blob();
    const file = new File([blob], `${new Date()?.toISOString}.mp3`);
    const result = await client.add(file);
    console.log(result);
    router.push(
      {
        pathname: '/media-player',
        query: {
          file: result.path,
        },
      },
      '/media-player',
    );
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[url('../assets/background.jpeg')] bg-cover bg-no-repeat p-4 font-sans">
      {user ? (
        <div className="flex w-2/4 justify-between">
          <button
            type="button"
            className="rounded border px-4 py-2 font-bold text-white hover:backdrop-blur-xl"
            onClick={() => inputRef?.current?.click()}
          >
            Upload audio file
          </button>
          <button
            type="button"
            className="rounded border px-4 py-2 font-bold text-white hover:backdrop-blur-xl"
            onClick={() => uploadPredefinedAudioToIPFS()}
          >
            Use predefined audio file
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="audio/*"
            onChange={(e: {
              target: {
                files?: any;
              };
            }) => handleMusicFileupload(e?.target?.files[0])}
            className="hidden"
          />
        </div>
      ) : (
        <button
          type="button"
          className="rounded border px-4 py-2 font-bold text-white hover:backdrop-blur-xl"
          onClick={handleMetaMaskConnect}
        >
          Login via MetaMask
        </button>
      )}
    </div>
  );
};

export default LoginPage;
