import { withAuth } from 'next-auth/middleware'

// Require a valid session (JWT) for matched routes
export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token, // allow only if signed in
  },
})

export const config = { matcher: ['/dashboard'] }
