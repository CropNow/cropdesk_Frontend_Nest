import { AppRouter } from './router'
import { ErrorBoundary } from './error-boundary'
import ResponsiveNav from '@/components/layout/ResponsiveNav'

export default function App() {
  return (
    <ErrorBoundary>
      <ResponsiveNav />
      <AppRouter />
    </ErrorBoundary>
  )
}
