import { createFileRoute } from '@tanstack/react-router'
import LibraryPage from '../components/library-page/LibraryPage'

export const Route = createFileRoute('/library')({
  component: RouteComponent,
})

function RouteComponent() {
  return <LibraryPage />
}
