import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // This middleware runs for every request.
  // You can add auth, redirects, headers, etc. here.
  return NextResponse.next();
}

// Optional: limit the middleware to specific routes.
// export const config = { matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"] };
