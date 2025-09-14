import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Plus, ExternalLink } from 'lucide-react';
import ImageUploader from './ImageUploader';

interface ProductImagesManagerProps {
  productId: string;
  images: string[];
  videos?: string[];
  onChange: (images: string[], videos: string[]) => void;
}

export default function ProductImagesManager({
  productId,
  images = [],
  videos = [],
  onChange,
}: ProductImagesManagerProps) {
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');

  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      const updatedImages = [...images, newImageUrl.trim()];
      onChange(updatedImages, videos);
      setNewImageUrl('');
    }
  };

  const handleAddVideoUrl = () => {
    if (newVideoUrl.trim()) {
      const updatedVideos = [...videos, newVideoUrl.trim()];
      onChange(images, updatedVideos);
      setNewVideoUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    onChange(updatedImages, videos);
  };

  const handleRemoveVideo = (index: number) => {
    const updatedVideos = videos.filter((_, i) => i !== index);
    onChange(images, updatedVideos);
  };

  const handleImageUploaded = (imageUrl: string) => {
    const updatedImages = [...images, imageUrl];
    onChange(updatedImages, videos);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Product Images</h3>
          
          {/* GitHub Image Uploader */}
          <div className="mb-6">
            <ImageUploader 
              productId={productId} 
              onImageUploaded={handleImageUploaded} 
            />
          </div>
          
          {/* Manual Image URL Input */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="image-url">Add Image URL</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="image-url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                <Button onClick={handleAddImageUrl}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Image List */}
            {images.length > 0 && (
              <div className="space-y-2">
                <Label>Current Images</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {images.map((url, index) => (
                    <div key={index} className="flex items-center gap-2 border rounded-md p-2">
                      <img
                        src={url}
                        alt={`Product image ${index + 1}`}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 truncate text-sm">{url}</div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="h-8 w-8"
                        >
                          <a href={url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveImage(index)}
                          className="h-8 w-8 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Product Videos</h3>
          
          {/* Video URL Input */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="video-url">Add Video URL</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="video-url"
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  placeholder="https://example.com/video.mp4"
                />
                <Button onClick={handleAddVideoUrl}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Video List */}
            {videos.length > 0 && (
              <div className="space-y-2">
                <Label>Current Videos</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videos.map((url, index) => (
                    <div key={index} className="flex items-center gap-2 border rounded-md p-2">
                      <div className="w-16 h-16 flex items-center justify-center bg-muted rounded">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </div>
                      <div className="flex-1 truncate text-sm">{url}</div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="h-8 w-8"
                        >
                          <a href={url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveVideo(index)}
                          className="h-8 w-8 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}