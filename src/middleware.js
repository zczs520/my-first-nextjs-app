import { NextResponse } from 'next/server'

export function middleware(req) {
  const url = req.nextUrl.clone()
  const host = req.headers.get('host') || ''

  // Force canonical domain: www.tavern-ai.xyz
  // Avoid infinite redirects: only redirect when host is EXACT apex domain
  if (host === 'tavern-ai.xyz') {
    url.hostname = 'www.tavern-ai.xyz'
    return NextResponse.redirect(url, { status: 308 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Apply to all paths except Next internals and assets
    '/((?!_next/|favicon.ico|robots.txt|sitemap.xml|.*\.(?:png|jpg|jpeg|gif|svg|ico|webp|css|js)).*)',
  ],
}
