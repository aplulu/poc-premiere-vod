import { VStack } from '@kuma-ui/core';

import { Header } from '@/components/header';
import { WatchPage } from '@/pages/watch';
import { HomePage } from '@/pages/home';

function App() {
  const videoId = new URLSearchParams(window.location.search).get('v');

  return (
    <VStack>
      <Header />
      <VStack as="main" px={24} py={36}>
        {videoId ? <WatchPage /> : <HomePage />}
      </VStack>
    </VStack>
  );
}

export default App;
