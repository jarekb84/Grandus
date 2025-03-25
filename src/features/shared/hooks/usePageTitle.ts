import { useEffect } from 'react'

export function usePageTitle(title: string): void {
  useEffect((): (() => void) => {
    const previousTitle = document.title
    document.title = title

    return (): void => {
      document.title = previousTitle
    }
  }, [title])
} 