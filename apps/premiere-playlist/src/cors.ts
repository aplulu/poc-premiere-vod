import { ExecutionContext } from '@cloudflare/workers-types';

export type CORSOptions = {
  allowedOrigins?: string[];
  allowedMethods?: string[];
  allowedHeaders?: string[];
  allowCredentials?: boolean;
  maxAge?: number;
};

const initOptions = {
  allowedOrigins: [],
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  allowCredentials: false,
  maxAge: 3600,
};

export const cors = <T>(
  options: CORSOptions,
  handler: (req: Request, env: T, ctx: ExecutionContext) => Promise<Response>
) => {
  const opts = { ...initOptions, ...options };

  return async (req: Request, env: T, ctx: ExecutionContext) => {
    const origin = req.headers.get('Origin');

    if (req.method === 'OPTIONS') {
      if (
        !origin ||
        (!opts.allowedOrigins.includes('*') &&
          !opts.allowedOrigins.includes(origin))
      ) {
        return new Response('Forbidden', { status: 403 });
      }

      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': opts.allowedMethods.join(','),
          'Access-Control-Allow-Headers': opts.allowedHeaders.join(','),
          'Access-Control-Allow-Credentials': opts.allowCredentials
            ? 'true'
            : 'false',
          'Access-Control-Max-Age': opts.maxAge.toString(),
        },
      });
    }

    const resp = await handler(req, env, ctx);

    const nResp = new Response(resp.body, {
      status: resp.status,
      statusText: resp.statusText,
      headers: resp.headers,
    });

    if (
      !nResp.headers.has('Access-Control-Allow-Origin') &&
      origin &&
      (opts.allowedOrigins.includes('*') ||
        opts.allowedOrigins.includes(origin))
    ) {
      nResp.headers.set('Access-Control-Allow-Origin', origin);
    }
    if (!nResp.headers.has('Access-Control-Allow-Methods')) {
      nResp.headers.set(
        'Access-Control-Allow-Credentials',
        opts.allowCredentials ? 'true' : 'false'
      );
    }

    return nResp;
  };
};
