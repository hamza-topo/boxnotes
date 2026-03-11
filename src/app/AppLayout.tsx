import type { ReactNode } from "react"

type Props = {
  search: ReactNode
  form: ReactNode
  results: ReactNode
}

export default function AppLayout({ search, form, results }: Props) {
  return (
    <main className="app-shell">
      <div className="search-row">{search}</div>

      <div className="content-grid">
        <section className="card">{form}</section>
        <section className="card">{results}</section>
      </div>
    </main>
  )
}