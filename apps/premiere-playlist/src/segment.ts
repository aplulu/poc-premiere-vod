export type Segment = {
  index: number;
  duration: number;
};

export type TimeSegment = {
  startTime: number;
  duration: number;
  path: string;
  sequence: number;
  discontinuitySequence: number;
};
