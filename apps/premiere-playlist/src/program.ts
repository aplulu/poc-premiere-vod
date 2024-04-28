import { Content, getContentByName } from './content';
import { TimeSegment } from './segment';
import { Representation } from './representation';

export type Program = {
  name: string;
  startTime: number;
  endTime: number;
  programContents: ProgramContent[];
};

export type ProgramContent = {
  contentName: string;
  repeat?: number;
};

const programs: Program[] = [
  {
    name: 'premiere-test-01',
    startTime: 0,
    endTime: 0,
    programContents: [
      {
        contentName: 'start60',
      },
      {
        contentName: 'countdown60',
      },
      {
        contentName: 'big_buck_bunny',
      },
      {
        contentName: 'end60',
      },
    ],
  },
  {
    name: 'premiere-test-02',
    startTime: 0,
    endTime: 0,
    programContents: [
      {
        contentName: 'start60',
      },
      {
        contentName: 'countdown60',
      },
      {
        contentName: 'big_buck_bunny',
      },
      {
        contentName: 'end60',
      },
    ],
  },
  {
    name: 'premiere-test-03',
    startTime: 0,
    endTime: 0,
    programContents: [
      {
        contentName: 'start60',
      },
      {
        contentName: 'countdown60',
      },
      {
        contentName: 'big_buck_bunny',
      },
      {
        contentName: 'end60',
      },
    ],
  },
  {
    name: 'premiere-test-04',
    startTime: 0,
    endTime: 0,
    programContents: [
      {
        contentName: 'start60',
      },
      {
        contentName: 'countdown60',
      },
      {
        contentName: 'big_buck_bunny',
      },
      {
        contentName: 'end60',
      },
    ],
  },
];

export const getProgramByName = (name: string): Program | undefined => {
  const program = programs.find((program) => program.name === name);
  if (!program) {
    return undefined;
  }

  if (program.name === 'premiere-test-01') {
    const t = new Date();
    t.setMinutes(0, 0, 0);
    program.startTime = t.getTime() / 1000;
  } else if (program.name === 'premiere-test-02') {
    const t = new Date();
    t.setMinutes(15, 0, 0);
    program.startTime = t.getTime() / 1000;
  } else if (program.name === 'premiere-test-03') {
    const t = new Date();
    t.setMinutes(30, 0, 0);
    program.startTime = t.getTime() / 1000;
  } else if (program.name === 'premiere-test-04') {
    const t = new Date();
    t.setMinutes(45, 0, 0);
    program.startTime = t.getTime() / 1000;
  }

  return program;
};

export const flattenContents = (program: Program): Content[] => {
  return program.programContents.flatMap((programContent) => {
    const content = getContentByName(programContent.contentName);
    if (!content) {
      throw new Error(`Content not found: ${programContent.contentName}`);
    }

    const contents: Content[] = [];
    for (let i = 0; i < (programContent.repeat ?? 1); i++) {
      contents.push(content);
    }
    return contents;
  });
};

export const flattenTimeSegments = (
  program: Program,
  representation: Representation,
  segmentBucketUrl: string
): TimeSegment[] => {
  const contents = flattenContents(program);

  const timeSegments: TimeSegment[] = [];
  let startTime = program.startTime;
  let currentContentName = '';
  let discontinuitySequence = 0;
  for (const content of contents) {
    if (content.name !== currentContentName) {
      if (currentContentName !== '') {
        discontinuitySequence++;
      }
      currentContentName = content.name;
    }
    for (const segment of content.segments) {
      timeSegments.push({
        startTime,
        duration: segment.duration,
        path: `${segmentBucketUrl}/${content.name}/${representation.name}_${segment.index.toString().padStart(3, '0')}.ts`,
        sequence: timeSegments.length,
        discontinuitySequence,
      });
      startTime += segment.duration;
    }
  }
  return timeSegments;
};
