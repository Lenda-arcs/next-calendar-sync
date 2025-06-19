export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Auth pages should not check for authentication
  // This layout bypasses the parent app layout's auth check
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
} 