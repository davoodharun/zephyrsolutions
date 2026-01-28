/**
 * Cloudflare Pages Functions types
 */

import type { Env as LibEnv } from './_lib/env';

// Re-export the Env type for use in Pages Functions
export type Env = LibEnv;

// Pages Function type definition
// Simplified type that matches Cloudflare Pages Functions API
export type PagesFunction<Env = any> = (context: {
  request: Request;
  env: Env;
  waitUntil?: (promise: Promise<any>) => void;
  next?: () => Promise<Response>;
  params?: Record<string, string>;
  data?: any;
}) => Response | Promise<Response>;
