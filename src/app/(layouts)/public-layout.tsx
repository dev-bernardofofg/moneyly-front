"use client"

export const PublicLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="flex items-center justify-center h-screen dark:bg-slate-900 bg-slate-50">
      {children}
    </div>
  )
}

export default PublicLayout