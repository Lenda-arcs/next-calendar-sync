export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Auth pages should not check for authentication
  // This layout bypasses the parent app layout's auth check
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {children}
    </div>
  )
} 