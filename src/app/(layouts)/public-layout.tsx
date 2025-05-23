"use client"


export const PublicLayout = ({ children }: ChildrenProps) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="border border-border  rounded-lg shadow bg-background w-full max-w-md">
        {children}
      </div>
    </div>
  )
}

export default PublicLayout