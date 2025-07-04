'use client'

import type React from 'react'
import {
  type ChangeEvent,
  type DragEvent,
  type InputHTMLAttributes,
  useCallback,
  useRef,
  useState,
} from 'react'

export type FileMetadata = {
  name: string
  size: number
  type: string
  url: string
  id: string
}

export type FileWithPreview = {
  file: File | FileMetadata
  id: string
  preview?: string
}

export type FileUploadOptions = {
  maxFiles?: number // Only used when multiple is true, defaults to Infinity
  maxSize?: number // in bytes
  accept?: string
  multiple?: boolean // Defaults to false
  initialFiles?: FileMetadata[]
  onFilesChange?: (files: FileWithPreview[]) => void // Callback when files change
  onFilesAdded?: (addedFiles: FileWithPreview[]) => void // Callback when new files are added
}

export type FileUploadState = {
  files: FileWithPreview[]
  isDragging: boolean
  errors: string[]
}

export type FileUploadActions = {
  addFiles: (files: FileList | File[]) => void
  removeFile: (id: string) => void
  clearFiles: () => void
  clearErrors: () => void
  handleDragEnter: (e: DragEvent<HTMLElement>) => void
  handleDragLeave: (e: DragEvent<HTMLElement>) => void
  handleDragOver: (e: DragEvent<HTMLElement>) => void
  handleDrop: (e: DragEvent<HTMLElement>) => void
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void
  openFileDialog: () => void
  getInputProps: (
    props?: InputHTMLAttributes<HTMLInputElement>
  ) => InputHTMLAttributes<HTMLInputElement> & {
    ref: React.Ref<HTMLInputElement>
  }
}

const DEFAULT_MAX_FILES = 10
const DEFAULT_MAX_SIZE = 1024 * 1024 * 10 // 10MB

export const useFileUpload = (
  options: FileUploadOptions = {}
): [FileUploadState, FileUploadActions] => {
  const {
    maxFiles = DEFAULT_MAX_FILES,
    maxSize = DEFAULT_MAX_SIZE,
    accept = '*',
    multiple = false,
    initialFiles = [],
    onFilesChange,
    onFilesAdded,
  } = options

  const [state, setState] = useState<FileUploadState>({
    files: initialFiles.map((file) => ({
      file,
      id: file.id,
      preview: file.url,
    })),
    isDragging: false,
    errors: [],
  })

  const inputRef = useRef<HTMLInputElement>(null)

  const getFileProperties = useCallback((file: File | FileMetadata) => {
    const isFileObject = file instanceof File
    return {
      name: file.name,
      size: file.size,
      type: isFileObject ? file.type || '' : file.type,
      extension: `.${file.name.split('.').pop()}`,
    }
  }, [])

  const validateFileSize = useCallback(
    (file: File | FileMetadata): string | null => {
      if (file.size > maxSize) {
        return `File "${file.name}" exceeds the maximum size of ${formatBytes(maxSize)}.`
      }
      return null
    },
    [maxSize]
  )

  const validateFileType = useCallback(
    (file: File | FileMetadata): string | null => {
      if (accept === '*') {
        return null
      }

      const { type, extension } = getFileProperties(file)
      const acceptedTypes = accept.split(',').map((acceptType) => acceptType.trim())

      const isAccepted = acceptedTypes.some((acceptedType) => {
        if (acceptedType.startsWith('.')) {
          return extension.toLowerCase() === acceptedType.toLowerCase()
        }
        if (acceptedType.endsWith('/*')) {
          const baseType = acceptedType.split('/')[0]
          return type.startsWith(`${baseType}/`)
        }
        return type === acceptedType
      })

      if (!isAccepted) {
        return `File "${file.name}" is not an accepted file type.`
      }

      return null
    },
    [accept, getFileProperties]
  )

  const validateFile = useCallback(
    (file: File | FileMetadata): string | null => {
      return validateFileSize(file) || validateFileType(file)
    },
    [validateFileSize, validateFileType]
  )

  const validateFilesLimit = useCallback(
    (newFilesCount: number): string | null => {
      if (multiple && maxFiles !== 10 && state.files.length + newFilesCount > maxFiles) {
        return `You can only upload a maximum of ${maxFiles} files.`
      }
      return null
    },
    [multiple, maxFiles, state.files.length]
  )

  const isDuplicateFile = useCallback(
    (file: File): boolean => {
      if (!multiple) {
        return false
      }

      return state.files.some(
        (existingFile) =>
          existingFile.file.name === file.name && existingFile.file.size === file.size
      )
    },
    [multiple, state.files]
  )

  const createPreview = useCallback((file: File | FileMetadata): string | undefined => {
    if (file instanceof File) {
      return URL.createObjectURL(file)
    }
    return file.url
  }, [])

  const generateUniqueId = useCallback((file: File | FileMetadata): string => {
    if (file instanceof File) {
      return `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    }
    return file.id
  }, [])

  const processSingleFile = useCallback(
    (file: File): { validFile?: FileWithPreview; error?: string } => {
      if (isDuplicateFile(file)) {
        return {}
      }

      const validationError = validateFile(file)
      if (validationError) {
        return { error: validationError }
      }

      return {
        validFile: {
          file,
          id: generateUniqueId(file),
          preview: createPreview(file),
        },
      }
    },
    [isDuplicateFile, validateFile, generateUniqueId, createPreview]
  )

  const updateStateWithFiles = useCallback(
    (validFiles: FileWithPreview[], errors: string[]) => {
      if (validFiles.length > 0) {
        onFilesAdded?.(validFiles)

        setState((prev) => {
          const updatedFiles = multiple ? [...prev.files, ...validFiles] : validFiles
          onFilesChange?.(updatedFiles)
          return {
            ...prev,
            files: updatedFiles,
            errors,
          }
        })
      } else if (errors.length > 0) {
        setState((prev) => ({
          ...prev,
          errors,
        }))
      }
    },
    [multiple, onFilesAdded, onFilesChange]
  )

  const resetFileInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }, [])

  const clearFiles = useCallback(() => {
    setState((prev) => {
      // Clean up object URLs
      for (const file of prev.files) {
        if (file.preview && file.file instanceof File && file.file.type.startsWith('image/')) {
          URL.revokeObjectURL(file.preview)
        }
      }

      if (inputRef.current) {
        inputRef.current.value = ''
      }

      const newState = {
        ...prev,
        files: [],
        errors: [],
      }

      onFilesChange?.(newState.files)
      return newState
    })
  }, [onFilesChange])

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      if (!newFiles || newFiles.length === 0) {
        return
      }

      const newFilesArray = Array.from(newFiles)
      const errors: string[] = []

      // Clear existing errors when new files are uploaded
      setState((prev) => ({ ...prev, errors: [] }))

      // In single file mode, clear existing files first
      if (!multiple) {
        clearFiles()
      }

      // Check if adding these files would exceed maxFiles (only in multiple mode)
      const filesLimitError = validateFilesLimit(newFilesArray.length)
      if (filesLimitError) {
        errors.push(filesLimitError)
        setState((prev) => ({ ...prev, errors }))
        return
      }

      const validFiles: FileWithPreview[] = []

      for (const file of newFilesArray) {
        const { validFile, error } = processSingleFile(file)
        if (error) {
          errors.push(error)
        } else {
          validFile && validFiles.push(validFile)
        }
      }

      // Only update state if we have valid files to add
      updateStateWithFiles(validFiles, errors)

      // Reset input value after handling files
      resetFileInput()
    },
    [
      multiple,
      clearFiles,
      validateFilesLimit, // Reset input value after handling files
      resetFileInput, // Only update state if we have valid files to add
      updateStateWithFiles,
      processSingleFile,
    ]
  )

  const removeFile = useCallback(
    (id: string) => {
      setState((prev) => {
        const fileToRemove = prev.files.find((file) => file.id === id)
        if (
          fileToRemove?.preview &&
          fileToRemove.file instanceof File &&
          fileToRemove.file.type.startsWith('image/')
        ) {
          URL.revokeObjectURL(fileToRemove.preview)
        }

        const newFiles = prev.files.filter((file) => file.id !== id)
        onFilesChange?.(newFiles)

        return {
          ...prev,
          files: newFiles,
          errors: [],
        }
      })
    },
    [onFilesChange]
  )

  const clearErrors = useCallback(() => {
    setState((prev) => ({
      ...prev,
      errors: [],
    }))
  }, [])

  const handleDragEnter = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setState((prev) => ({ ...prev, isDragging: true }))
  }, [])

  const handleDragLeave = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return
    }

    setState((prev) => ({ ...prev, isDragging: false }))
  }, [])

  const handleDragOver = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback(
    (e: DragEvent<HTMLElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setState((prev) => ({ ...prev, isDragging: false }))

      // Don't process files if the input is disabled
      if (inputRef.current?.disabled) {
        return
      }

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        // In single file mode, only use the first file
        if (multiple) {
          addFiles(e.dataTransfer.files)
        } else {
          const file = e.dataTransfer.files[0]
          if (file) {
            addFiles([file])
          }
        }
      }
    },
    [addFiles, multiple]
  )

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        addFiles(e.target.files)
      }
    },
    [addFiles]
  )

  const openFileDialog = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }, [])

  const getInputProps = useCallback(
    (props: InputHTMLAttributes<HTMLInputElement> = {}) => {
      return {
        ...props,
        type: 'file' as const,
        onChange: handleFileChange,
        accept: props.accept || accept,
        multiple: props.multiple !== undefined ? props.multiple : multiple,
        ref: inputRef,
      }
    },
    [accept, multiple, handleFileChange]
  )

  return [
    state,
    {
      addFiles,
      removeFile,
      clearFiles,
      clearErrors,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      handleFileChange,
      openFileDialog,
      getInputProps,
    },
  ]
}

// Helper function to format bytes to human-readable format
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) {
    return '0 Bytes'
  }
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  const size = Number.parseFloat((bytes / k ** i).toFixed(dm))

  return `${size} ${sizes[i]}`
}
