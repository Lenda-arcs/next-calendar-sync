import { useState, useEffect } from 'react'
import { EventTag } from '@/lib/event-types'
import { DEFAULT_TAG_COLOR } from '@/lib/constants/tag-constants'

interface UseTagFormProps {
  initialTag: EventTag | null
  isEditing: boolean
  userId: string
}

interface TagFormData {
  id?: string
  name: string
  color: string
  classType: string[]
  audience: string[] | null
  cta: { label: string; url: string } | null
  priority: number | null
  imageUrl: string | null
  userId?: string
}

export function useTagForm({ initialTag, isEditing, userId }: UseTagFormProps) {
  const [formData, setFormData] = useState<TagFormData>({
    name: '',
    color: DEFAULT_TAG_COLOR,
    classType: [],
    audience: null,
    cta: null,
    priority: null,
    imageUrl: null,
  })

  // Reset form when props change
  useEffect(() => {
    if (initialTag && isEditing) {
      setFormData({
        id: initialTag.id,
        name: initialTag.name || '',
        color: initialTag.color || DEFAULT_TAG_COLOR,
        classType: initialTag.classType || [],
        audience: initialTag.audience || null,
        cta: initialTag.cta || null,
        priority: initialTag.priority || null,
        imageUrl: initialTag.imageUrl || null,
        userId: initialTag.userId || undefined,
      })
    } else if (!isEditing) {
      setFormData({
        name: '',
        color: DEFAULT_TAG_COLOR,
        classType: [],
        audience: null,
        cta: null,
        priority: null,
        imageUrl: null,
      })
    }
  }, [initialTag, isEditing])

  const updateField = <K extends keyof TagFormData>(
    field: K,
    value: TagFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updateCta = (field: 'label' | 'url', value: string) => {
    setFormData(prev => ({
      ...prev,
      cta: {
        label: field === 'label' ? value : prev.cta?.label || '',
        url: field === 'url' ? value : prev.cta?.url || '',
      }
    }))
  }

  // classType is now set directly via updateField from a MultiSelect in the UI

  const buildEventTag = (): EventTag => {
    const slug = formData.name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

    return {
      id: formData.id || '',
      slug,
      name: formData.name.trim(),
      color: formData.color,
      classType: formData.classType,
      audience: formData.audience,
      cta: formData.cta?.label && formData.cta?.url ? formData.cta : null,
      priority: formData.priority,
      imageUrl: formData.imageUrl,
      userId: isEditing ? formData.userId : userId,
      chip: {
        color: formData.color
      }
    }
  }

  const isValid = formData.name.trim().length > 0

  return {
    formData,
    updateField,
    updateCta,
    buildEventTag,
    isValid,
  }
} 