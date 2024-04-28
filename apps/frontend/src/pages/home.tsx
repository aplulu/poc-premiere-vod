import { Grid, VStack } from '@kuma-ui/core';

export const HomePage = () => {
  return (
    <VStack gap={24}>
      <Grid gridTemplateColumns="repeat(auto-fit, minmax(260px, 1fr))">
        <a href="/?v=premiere-test-01">Premiere Test 01 (毎時0分開始)</a>
        <a href="/?v=premiere-test-02">Premiere Test 02 (毎時15分開始)</a>
        <a href="/?v=premiere-test-03">Premiere Test 03 (毎時30分開始)</a>
        <a href="/?v=premiere-test-04">Premiere Test 04 (毎時45分開始)</a>
      </Grid>
    </VStack>
  );
};
