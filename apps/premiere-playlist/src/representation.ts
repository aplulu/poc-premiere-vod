export type Representation = {
  name: string;
  bandwidth: number;
  width: number;
  height: number;
};

const representations = [
  {
    name: '360p',
    bandwidth: 800000,
    width: 640,
    height: 360,
  },
  {
    name: '720p',
    bandwidth: 2800000,
    width: 1280,
    height: 720,
  },
  {
    name: '1080p',
    bandwidth: 5000000,
    width: 1920,
    height: 1080,
  },
];

export const findAllRepresentations = (): Representation[] => representations;
