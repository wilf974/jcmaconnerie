import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
      if (isAdminRoute) {
        return token?.email === 'admin@jc-maconnerie.fr'
      }
      return true
    },
  },
})

export const config = {
  matcher: ['/admin/:path*']
}

