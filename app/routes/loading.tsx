import React from 'react';
import ProgressLoading from '~/components/ProgressLoading';

export default function LoadingPage() {
  const handleLoadingComplete = () => {
    console.log("Loading selesai!");
  };

  return (
    <ProgressLoading 
      title="Memproses Data..."
      subtitle="Mohon tunggu sebentar"
      redirectUrl="/dashboard" 
      redirectTime={3600} 
      spinnerColor="border-amber-400"
      progressColor="bg-amber-400"
      onLoadingComplete={handleLoadingComplete}
    />
  );
}

// contoh penggunaan Loading mase
