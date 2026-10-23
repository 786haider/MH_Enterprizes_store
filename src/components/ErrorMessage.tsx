export function ErrorMessage({ title = "Something went wrong", message, action }: { title?: string; message?: string; action?: React.ReactNode }) {
  return <div role="alert" className="container-x py-20 text-center"><h1 className="text-4xl">{title}</h1>{message && <p className="mx-auto mt-3 max-w-md text-muted">{message}</p>}{action && <div className="mt-6">{action}</div>}</div>;
}
