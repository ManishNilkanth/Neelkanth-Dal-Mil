import { useRef, useState } from 'react'
import { ImagePlus, X } from 'lucide-react'
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE_MB } from '../../lib/utils'

interface ImageUploadProps {
  currentUrl: string | null
  onFileSelect: (file: File | null) => void
  error?: string
}

export function ImageUpload({ currentUrl, onFileSelect, error }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const displayUrl = preview ?? currentUrl

  const handleFileChange = (file: File | null) => {
    if (!file) {
      setPreview(null)
      onFileSelect(null)
      return
    }
    onFileSelect(file)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleRemove = () => {
    setPreview(null)
    onFileSelect(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-earth-800">Product Image</label>

      {displayUrl ? (
        <div className="relative inline-block">
          <img
            src={displayUrl}
            alt="Product preview"
            className="h-40 w-40 rounded-lg border border-earth-200 object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -right-2 -top-2 rounded-full bg-red-600 p-1 text-white hover:bg-red-700"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-40 w-full max-w-xs flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-earth-300 bg-earth-50 text-earth-600 hover:border-brand-400 hover:bg-brand-50"
        >
          <ImagePlus className="h-8 w-8" />
          <span className="text-sm">Click to upload image</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_IMAGE_TYPES.join(',')}
        className="hidden"
        onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
      />

      <p className="text-sm text-earth-500">
        JPEG, PNG, or WebP. Max {MAX_IMAGE_SIZE_MB}MB.
      </p>

      {displayUrl && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-sm font-medium text-brand-800 hover:text-brand-900"
        >
          Replace image
        </button>
      )}

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
