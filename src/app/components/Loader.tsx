import React from 'react';
import { CircularProgress } from '@mui/material';

interface LoadingProps {
  text?: string;
  fullPage?: boolean;
  size?: number;
  loader?: React.ReactNode; // <-- custom loader prop
}

const Loading: React.FC<LoadingProps> = ({ text = 'Loading...', fullPage = false, size = 40, loader }) => {
  const defaultLoader = <CircularProgress size={size} />;

  if (fullPage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        {loader || defaultLoader}
        {text && <p className="mt-4 text-lg font-medium text-gray-600">{text}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {loader || defaultLoader}
      {text && <p className="mt-2 text-sm text-gray-500">{text}</p>}
    </div>
  );
};

export default Loading;
