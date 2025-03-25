import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Upload, X } from "lucide-react"
import { uploadImage } from "@/lib/actions"

interface ImageUploadProps {
  initialImage?: string
  onImageChange: (imagePath: string | undefined) => void // Allow undefined as well
  folder: string // e.g., "members", "albums", "sub-units"
  className?: string
}

export default function ImageUpload({ initialImage, onImageChange, folder, className = "" }: ImageUploadProps) {
  const [image, setImage] = useState<string | undefined>(initialImage) // Allow image to be undefined initially
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", folder)

      const result = await uploadImage(formData)

      if (result.success) {
        setImage(result.imagePath)
        onImageChange(result.imagePath)
      } else {
        setError(result.error || "Failed to upload image")
      }
    } catch (err) {
      setError("An error occurred while uploading the image")
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setImage(undefined) // Change this to undefined instead of an empty string
    onImageChange(undefined) // Pass undefined to the onImageChange function
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`${className}`}>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      {image ? (
        <div className="relative">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-gray-700">
            <Image src={image || "/placeholder.svg"} alt="Uploaded image" fill className="object-cover" />
          </div>
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={triggerFileInput}
          disabled={isUploading}
          className="flex aspect-square w-full flex-col items-center justify-center rounded-lg border border-dashed border-gray-600 bg-gray-800 p-4 hover:border-gray-500 hover:bg-gray-750"
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-500 border-t-purple-500"></div>
              <span className="mt-2 text-sm text-gray-400">Uploading...</span>
            </div>
          ) : (
            <>
              <Upload className="mb-2 h-8 w-8 text-gray-400" />
              <span className="text-sm text-gray-400">Click to upload image</span>
              <span className="mt-1 text-xs text-gray-500">(Max 5MB)</span>
            </>
          )}
        </button>
      )}

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  )
}