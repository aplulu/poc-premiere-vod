import { flattenTimeSegments, getProgramByName } from './program';
import { findAllRepresentations } from './representation';
import { cors } from './cors';

interface Env {
  SEGMENT_BUCKET_URL: string;
}

export default {
  fetch: cors(
    {
      allowedOrigins: ['*'],
      allowedMethods: ['GET', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Cookie'],
      allowCredentials: true,
      maxAge: 3600,
    },
    async (
      req: Request,
      env: Env,
      ctx: ExecutionContext
    ): Promise<Response> => {
      const url = new URL(req.url);

      if (url.pathname.endsWith('.m3u8')) {
        const parts = url.pathname
          .substring(1, url.pathname.length - 5)
          .split('/');
        console.log(parts);
        if (parts.length === 1) {
          const programId = parts[0];
          const program = getProgramByName(programId);
          if (!program) {
            console.log(`Program not found: ${programId}`);
            return new Response('Not found', { status: 404 });
          }

          const representations = findAllRepresentations();

          const lines: string[] = [];

          lines.push('#EXTM3U');
          for (const representation of representations) {
            lines.push(
              `#EXT-X-STREAM-INF:BANDWIDTH=${representation.bandwidth},RESOLUTION=${representation.width}x${representation.height}`
            );
            lines.push(`/${programId}/${representation.name}.m3u8`);
          }

          return new Response(lines.join('\n'), {
            status: 200,
            headers: { 'Content-Type': 'application/x-mpegURL' },
          });
        } else if (parts.length === 2) {
          const programId = parts[0];
          const representationId = parts[1];
          const program = getProgramByName(programId);
          if (!program) {
            console.log(`Program not found: ${programId}`);
            return new Response('Not found', { status: 404 });
          }

          const representations = findAllRepresentations();
          const representation = representations.find(
            (representation) => representation.name === representationId
          );
          if (!representation) {
            console.log('Representation not found');
            return new Response('Not found', { status: 404 });
          }

          /*
								const start = new Date();
								start.setMinutes(8);
								start.setSeconds(0);
								program.startTime = start.getTime() / 1000;
				*/

          console.log(`Start time: ${program.startTime}`);

          const segments = flattenTimeSegments(
            program,
            representation,
            env.SEGMENT_BUCKET_URL
          );

          const now = new Date().getTime() / 1000;
          const bufferTime = 15;
          const availableSegments = segments.filter(
            (segment) => segment.startTime <= now + bufferTime
          );

          const currentSegments = availableSegments.filter(
            (segment) => segment.startTime + segment.duration >= now
          );

          if (currentSegments.length === 0) {
            console.log('Segment not found');
            return new Response('Not found', { status: 404 });
          } else if (currentSegments[0].sequence === 0) {
            const availableDuration = currentSegments.reduce(
              (acc, segment) => acc + segment.duration,
              0
            );
            // bufferTime分のデータがない場合はエラー
            if (availableDuration < bufferTime) {
              console.log('Not enough data');
              return new Response('Not found', { status: 404 });
            }
          }

          const lines: string[] = [];

          let discontinuitySequence = currentSegments[0].discontinuitySequence;

          lines.push('#EXTM3U');
          lines.push('#EXT-X-VERSION:3');
          lines.push(`#EXT-X-TARGETDURATION:8`);
          lines.push(`#EXT-X-DISCONTINUITY-SEQUENCE:${discontinuitySequence}`);
          lines.push(`#EXT-X-MEDIA-SEQUENCE:${currentSegments[0].sequence}`);

          for (const segment of currentSegments) {
            if (segment.discontinuitySequence !== discontinuitySequence) {
              discontinuitySequence = segment.discontinuitySequence;
              lines.push(`#EXT-X-DISCONTINUITY`);
            }
            lines.push(`#EXTINF:${segment.duration},`);
            lines.push(segment.path);
          }

          if (
            currentSegments[currentSegments.length - 1].sequence ===
            segments.length - 1
          ) {
            lines.push('#EXT-X-ENDLIST');
          }

          return new Response(lines.join('\n'), {
            status: 200,
            headers: { 'Content-Type': 'application/x-mpegURL' },
          });
        }
      }

      return new Response('Not found', { status: 404 });
    }
  ),
};
