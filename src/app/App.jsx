import { AppRouter } from "./router"
import { ErrorBoundary } from "./error-boundary"

export default function App() {
  return (
    <ErrorBoundary>
      <AppRouter />
    </ErrorBoundary>
  )
}
