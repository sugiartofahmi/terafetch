export type TResultHeaderProps = {
  url: string
}

export const ResultHeader = ({ url }: TResultHeaderProps) => {
  return (
    <div>
      <p className="truncate text-body-sm text-muted-foreground">
        Link: <span className="text-foreground font-medium">{url}</span>
      </p>
      <h1 className="mt-1 text-h1 text-foreground">Files</h1>
    </div>
  )
}
