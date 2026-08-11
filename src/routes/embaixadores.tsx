import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/embaixadores')({
  beforeLoad: () => {
    throw redirect({
      to: '/colaborar',
      replace: true,
    })
  },
})
