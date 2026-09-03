import { useEffect } from 'react'

interface PageMetaOptions {
  title: string
  description?: string
  image?: string
  type?: string
}

export function usePageMeta({ title, description, image, type = 'website' }: PageMetaOptions) {
  useEffect(() => {
    document.title = title

    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name'
      let element = document.querySelector(`meta[${attr}="${name}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attr, name)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    }

    if (description) {
      setMeta('description', description)
      setMeta('og:description', description, true)
    }

    setMeta('og:title', title, true)
    setMeta('og:type', type, true)

    if (image) {
      setMeta('og:image', image, true)
    }

    return () => {
      document.title = 'Daal Mill'
    }
  }, [title, description, image, type])
}
