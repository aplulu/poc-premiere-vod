import { HStack, Text } from '@kuma-ui/core';

export const Header = () => {
  return (
    <HStack
      as="header"
      justifyContent="space-between"
      alignItems="center"
      minHeight={64}
      px={24}
      py={8}
      backgroundColor="var(--header-background)">
      <Text as="a" href="/" fontSize="1.5rem" color="var(--header-text-color)">
        NyanTube
      </Text>
    </HStack>
  );
};
