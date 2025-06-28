'use client'

import type { ChangeEvent } from "react";
import React, { useCallback, useRef, useState } from "react";
import ReactCrop, {
  centerCrop,
  type Crop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useSupabaseQuery, useSupabaseMutation } from "@/lib/hooks";
import DataLoader from "./data-loader";
import { UnifiedDialog } from "./unified-dialog";
import { Button } from "./button";
import { Alert, AlertDescription } from "./alert";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "./alert-dialog";
import { AlertCircle, ChevronLeft, Upload, X } from "lucide-react";
import IconButton from "./icon-button";

interface ImageUploadProps {
  currentImageUrl?: string | null;
  onImageUrlChange: (url: string | null) => void;
  userId: string;
  aspectRatio?: number;
  bucketName: string;
  folderPath: string; // This will be automatically prefixed with userId
  maxFileSize?: number;
  allowedTypes?: string[];
  className?: string;
  placeholderText?: string;
  maxImages?: number; // Maximum number of images allowed in this folder
}

interface BucketImage {
  name: string;
  url: string;
  created_at: string;
}

interface ExistingImagesStepProps {
  existingImages: BucketImage[] | null;
  isLoadingImages: boolean;
  fetchError: string | null;
  onSelectImage: (image: BucketImage) => void;
  onUploadClick: () => void;
  onDeleteImage: (image: BucketImage) => void;
  maxFileSize: number;
  allowedTypes: string[];
  maxImages?: number;
  currentCount: number;
}

interface CropImageStepProps {
  imgSrc: string;
  crop: Crop | undefined;
  aspectRatio?: number;
  onCropChange: (crop: Crop) => void;
  onImageLoad: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  imgRef: React.RefObject<HTMLImageElement | null>;
}

const DEFAULT_MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const DEFAULT_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

// Helper function to create user-specific folder path
function createUserFolderPath(userId: string, folderPath: string): string {
  // Create user-specific folder structure: users/{userId}/{folderPath}
  return `users/${userId}/${folderPath}`;
}

// Component for Step 1: Select Existing Images
const ExistingImagesStep: React.FC<ExistingImagesStepProps> = ({
  existingImages,
  isLoadingImages,
  fetchError,
  onSelectImage,
  onUploadClick, // eslint-disable-line @typescript-eslint/no-unused-vars
  onDeleteImage,
  maxFileSize, // eslint-disable-line @typescript-eslint/no-unused-vars
  allowedTypes, // eslint-disable-line @typescript-eslint/no-unused-vars
  maxImages,
  currentCount,
}) => {
  const isAtLimit = maxImages ? currentCount >= maxImages : false;
  
  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700">
            Your Existing Images
          </h4>
          {maxImages && (
            <span className={`text-xs px-2 py-1 rounded-full ${
              isAtLimit ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {currentCount} / {maxImages}
            </span>
          )}
        </div>
        
        {isAtLimit && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You&apos;ve reached the maximum limit of {maxImages} images. Delete existing images to upload new ones.
            </AlertDescription>
          </Alert>
        )}
        <DataLoader
          data={existingImages}
          loading={isLoadingImages}
          error={fetchError}
          empty={
            <div className="text-center py-8 text-gray-500">
              No existing images found. Upload your first image below.
            </div>
          }
        >
          {(images) => (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {images.map((image) => (
                <div
                  key={image.name}
                  className="relative aspect-video rounded-lg overflow-hidden group"
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Select overlay */}
                  <div 
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                    onClick={() => onSelectImage(image)}
                  >
                    <span className="text-white text-sm font-medium">
                      Select
                    </span>
                  </div>
                  
                  {/* Delete button */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Image?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete this image from your storage. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDeleteImage(image)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Delete Image
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          )}
        </DataLoader>
      </div>
    </>
  );
};

// Component for Step 2: Crop Image
const CropImageStep: React.FC<CropImageStepProps> = ({
  imgSrc,
  crop,
  aspectRatio,
  onCropChange,
  onImageLoad,
  imgRef,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        {imgSrc ? (
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => onCropChange(percentCrop)}
            aspect={aspectRatio}
            className="max-w-full"
          >
            <img
              ref={imgRef}
              src={imgSrc}
              alt="Crop preview"
              onLoad={onImageLoad}
              style={{
                maxWidth: "100%",
                maxHeight: "50vh",
                display: "block",
              }}
            />
          </ReactCrop>
        ) : (
          <div className="text-gray-500">Loading image...</div>
        )}
      </div>
    </div>
  );
};

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImageUrl,
  onImageUrlChange,
  userId,
  aspectRatio,
  bucketName,
  folderPath,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  allowedTypes = DEFAULT_ALLOWED_TYPES,
  className = "",
  placeholderText = "Change Image",
  maxImages,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImageUrl || null,
  );
  const [error, setError] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [imgSrc, setImgSrc] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState<"select" | "crop">("select");
  const [hasOpenedModal, setHasOpenedModal] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create user-specific folder path
  const userFolderPath = createUserFolderPath(userId, folderPath);

  // Fetch existing images using useSupabaseQuery - only when dialog is opened
  const {
    data: existingImages,
    isLoading: isLoadingImages,
    error: fetchError,
    refetch: fetchImages,
  } = useSupabaseQuery<BucketImage[]>({
    queryKey: ['bucket_images', bucketName, userFolderPath],
    fetcher: async (supabase) => {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .list(userFolderPath, {
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) {
        // If folder doesn't exist, return empty array instead of throwing
        if (error.message.includes('The resource was not found')) {
          return [];
        }
        throw error;
      }

      if (!data || data.length === 0) {
        return [];
      }

      return await Promise.all(
        data.map(async (file: { name: string; created_at: string }) => {
          const {
            data: { publicUrl },
          } = supabase.storage
            .from(bucketName)
            .getPublicUrl(`${userFolderPath}/${file.name}`);

          return {
            name: file.name,
            url: publicUrl,
            created_at: file.created_at,
          };
        }),
      );
    },
    enabled: hasOpenedModal && modalStep === 'select' && showModal,
  });

  // Upload mutation using useSupabaseMutation
  const uploadMutation = useSupabaseMutation<{ url: string }, { file: Uint8Array; fileName: string }>({
    mutationFn: async (supabase, { file, fileName }) => {
      const filePath = `${userFolderPath}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
          contentType: "image/webp",
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucketName).getPublicUrl(filePath);

      return { url: publicUrl };
    },
    onSuccess: (data) => {
      setPreviewUrl(data.url);
      onImageUrlChange(data.url);
      setShowModal(false);
      setModalStep("select");
      // Refresh the image list after upload
      fetchImages();
    },
    onError: (error) => {
      console.error("Error uploading image:", error);
      
      // Check for server-side RLS policy violation (storage limit exceeded)
      if (error.message?.includes('row-level security policy') || 
          error.message?.includes('policy')) {
        const limitText = maxImages ? `${maxImages} images` : 'the storage limit';
        setError(`You have reached your ${limitText} limit. Please delete some existing images before uploading new ones.`);
      } else if (error.message?.includes('413') || error.message?.includes('too large')) {
        setError("Image file is too large. Please compress your image or choose a smaller file.");
      } else {
        setError(`Upload failed: ${error.message || 'Please try again.'}`);
      }
    },
  });

  // Delete mutation using useSupabaseMutation
  const deleteMutation = useSupabaseMutation<void, { fileName: string }>({
    mutationFn: async (supabase, { fileName }) => {
      const filePath = `${userFolderPath}/${fileName}`;
      
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);

      if (error) throw error;
    },
    onSuccess: () => {
      // Refresh the image list after deletion
      fetchImages();
    },
    onError: (error) => {
      console.error("Error deleting image:", error);
      setError("Failed to delete image. Please try again.");
    },
  });

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      console.log("Image loaded:", { width, height, aspectRatio }); // Debug log

      if (aspectRatio) {
        setCrop(centerAspectCrop(width, height, aspectRatio));
      } else {
        // Initialize crop even without aspect ratio
        setCrop({
          unit: "%",
          x: 10,
          y: 10,
          width: 80,
          height: 80,
        });
      }
    },
    [aspectRatio],
  );

  const handleClick = () => {
    setShowModal(true);
    setModalStep("select");
    setHasOpenedModal(true);
    setError(null);
  };

  const handleSelectExistingImage = (image: BucketImage) => {
    setPreviewUrl(image.url);
    onImageUrlChange(image.url);
    setShowModal(false);
    setError(null);
  };

  const handleDeleteImage = (image: BucketImage) => {
    // Extract filename from the image name
    const fileName = image.name;
    deleteMutation.mutate({ fileName });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (!file) return;

    // Check image count limit
    const currentCount = existingImages?.length || 0;
    if (maxImages && currentCount >= maxImages) {
      setError(
        `You've reached the maximum limit of ${maxImages} images. Please delete an existing image before uploading a new one.`
      );
      return;
    }

    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
    const maxSizeMB = (maxFileSize / (1024 * 1024)).toFixed(0);

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      setError(
        `Please select a valid image file (${allowedTypes.map((t) => t.split("/")[1].toUpperCase()).join(", ")})`,
      );
      return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      setError(
        `Image too large! File size is ${fileSizeMB}MB, but maximum allowed is ${maxSizeMB}MB. Please compress your image or choose a smaller file.`,
      );
      return;
    }

    // Create preview and switch to crop step
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      console.log("FileReader result:", result ? "Success" : "Failed");
      setImgSrc(result);
      setModalStep("crop");
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async () => {
    if (!imgRef.current || !crop) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Get the actual image dimensions
    const imageWidth = imgRef.current.naturalWidth;
    const imageHeight = imgRef.current.naturalHeight;

    // Calculate the crop dimensions in actual image pixels
    const cropX = (crop.x * imageWidth) / 100;
    const cropY = (crop.y * imageHeight) / 100;
    const cropWidth = (crop.width * imageWidth) / 100;
    const cropHeight = (crop.height * imageHeight) / 100;

    // Set canvas dimensions to match the crop size
    canvas.width = cropWidth;
    canvas.height = cropHeight;

    // Draw the cropped portion
    ctx.drawImage(
      imgRef.current,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight,
    );

    // Convert canvas to blob
    canvas.toBlob(
      async (blob) => {
        if (!blob) return;

        try {
          const fileExt = "webp";
          const fileName = `${Date.now()}.${fileExt}`;

          const arrayBuffer = await blob.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);

          await uploadMutation.mutateAsync({
            file: uint8Array,
            fileName,
          });
        } catch (err) {
          console.error("Error processing image:", err);
          setError("Failed to process image. Please try again.");
        }
      },
      "image/webp",
      0.9,
    );
  };

  const handleBackToSelect = () => {
    setModalStep("select");
    setImgSrc("");
    setCrop(undefined);
    setError(null);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center space-y-4">
        <div
          className={`relative overflow-hidden cursor-pointer group ${className}`}
          onClick={handleClick}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Image preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-white/50 border border-white/40 flex items-center justify-center">
              <span className="text-[#3F3F3F] text-4xl">+</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-sm">
              {uploadMutation.isLoading ? "Uploading..." : placeholderText}
            </span>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={allowedTypes.join(",")}
          onChange={handleImageSelect}
          className="hidden"
        />

        {error && !showModal && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-[#666] text-center space-y-1">
          <p>Max file size: {maxFileSize / (1024 * 1024)}MB</p>
          <p>
            Supported formats:{" "}
            {allowedTypes.map((t) => t.split("/")[1].toUpperCase()).join(", ")}
          </p>
          {maxImages && (
            <p>
              Image limit: {maxImages} images maximum
            </p>
          )}
        </div>
      </div>

      {/* Dialog Modal */}
      <UnifiedDialog
        open={showModal}
        onOpenChange={setShowModal}
        title={
            <div className="flex items-center space-x-2">
              {modalStep === "crop" && (
                <IconButton
                  icon={<ChevronLeft className="h-4 w-4" />}
                  variant="ghost"
                  size="icon"
                  onClick={handleBackToSelect}
                  aria-label="Go back to image selection"
                />
              )}
            <span className="text-lg font-medium font-serif">
              {modalStep === "select" ? "Select or Upload Image" : "Crop Image"}
            </span>
          </div>
        }
        size="xl"
        footer={
          modalStep === "select" ? (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-4">
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Max file size: {maxFileSize / (1024 * 1024)}MB</p>
                <p>
                  Supported formats:{" "}
                  {allowedTypes
                    .map((t) => t.split("/")[1].toUpperCase())
                    .join(", ")}
                </p>
                {maxImages && (
                  <p>
                    Image limit: {existingImages?.length || 0} / {maxImages}
                  </p>
                )}
              </div>
              <Button
                onClick={handleUploadClick}
                variant="outline"
                size="default"
                disabled={maxImages ? (existingImages?.length || 0) >= maxImages : false}
              >
                <Upload className="w-4 h-4 mr-2" />
                {maxImages && (existingImages?.length || 0) >= maxImages 
                  ? "Limit Reached" 
                  : "Upload New Image"
                }
              </Button>
            </div>
          ) : (
            <>
              <Button variant="outline" onClick={handleBackToSelect}>
                Cancel
              </Button>
              <Button
                onClick={handleCropComplete}
                disabled={uploadMutation.isLoading}
                size="default"
                loading={uploadMutation.isLoading}
              >
                {uploadMutation.isLoading ? "Uploading..." : "Crop & Save"}
              </Button>
            </>
          )
        }
      >

            {/* Error Display */}
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Step Content */}
            {modalStep === "select" ? (
              <ExistingImagesStep
                existingImages={existingImages}
                isLoadingImages={isLoadingImages}
                fetchError={fetchError?.message || null}
                onSelectImage={handleSelectExistingImage}
                onUploadClick={handleUploadClick}
                onDeleteImage={handleDeleteImage}
                maxFileSize={maxFileSize}
                allowedTypes={allowedTypes}
                maxImages={maxImages}
                currentCount={existingImages?.length || 0}
              />
            ) : (
              <CropImageStep
                imgSrc={imgSrc}
                crop={crop}
                aspectRatio={aspectRatio}
                onCropChange={setCrop}
                onImageLoad={onImageLoad}
                imgRef={imgRef}
              />
            )}
      </UnifiedDialog>
    </div>
  );
};

export default ImageUpload; 