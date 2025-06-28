"use client"


export const PublicLayout = ({ children }: ChildrenProps) => {
  return (
    <div className="flex items-center justify-center h-screen dark:bg-slate-950 bg-slate-50">
      {children}
    </div>
  )
}

export default PublicLayout