import { useState, useCallback } from "react";
import { Upload, Camera, FileImage, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { sendToGemini } from "@/services/geminiService";
import { addItemsToFirebase } from "@/firebaseUtils";

export function UploadSection() {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  }, []);

  const handleUpload = async (file: File) => {
    if (!currentUser) {
      throw new Error("User must be authenticated to upload items");
    }
    const extractedItems = await sendToGemini(file);
    await addItemsToFirebase(extractedItems, currentUser.uid);
    return extractedItems;
  };

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      let totalItemsAdded = 0;
      let totalFilesProcessed = 0;
      
      // Process each file using the new handleUpload function
      for (const file of files) {
        try {
          const extractedItems = await handleUpload(file);
          totalItemsAdded += extractedItems.length;
          totalFilesProcessed++;
          
        } catch (error) {
          console.error(`Error processing file ${file.name}:`, error);
          toast({
            title: "Processing Error",
            description: `Failed to process ${file.name}. Please try again.`,
            variant: "destructive",
          });
        }
      }
      
      // Show success message
      if (totalItemsAdded > 0) {
        toast({
          title: "Upload Complete",
          description: `Successfully processed ${totalFilesProcessed} file(s) and added ${totalItemsAdded} items to inventory.`,
        });
      } else {
        toast({
          title: "No Items Found",
          description: "No food items could be extracted from the uploaded images.",
          variant: "destructive",
        });
      }
      
    } catch (error) {
      console.error('Error processing files:', error);
      toast({
        title: "Upload Failed",
        description: "An error occurred while processing the images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card 
        className={`transition-smooth border-2 border-dashed cursor-pointer hover:shadow-medium ${
          isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50'
        } ${isProcessing ? 'pointer-events-none opacity-60' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="p-12 text-center">
          <div className="mb-6">
            {isProcessing ? (
              <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto flex items-center justify-center animate-pulse">
                <div className="w-8 h-8 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              </div>
            ) : isDragging ? (
              <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary-foreground" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-gradient-fresh rounded-full mx-auto flex items-center justify-center shadow-soft">
                <FileImage className="w-8 h-8 text-white" />
              </div>
            )}
          </div>
          
          <h3 className="text-xl font-semibold mb-2">
            {isProcessing ? 'Processing...' : isDragging ? 'Drop files here' : 'Upload Grocery Bills & Food Labels'}
          </h3>
          
          <p className="text-muted-foreground mb-6">
            {isProcessing 
              ? 'Analyzing images and extracting food items...'
              : 'Drag and drop images here, or click to browse'
            }
          </p>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
            disabled={isProcessing}
          />
          
          <label htmlFor="file-upload">
            <Button 
              variant="default" 
              size="lg" 
              className="shadow-soft hover:shadow-medium transition-smooth"
              disabled={isProcessing}
              asChild
            >
              <span>
                <Camera className="w-5 h-5 mr-2" />
                Choose Files
              </span>
            </Button>
          </label>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary-glow/5 border-primary/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <FileImage className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">Smart Recognition</p>
              <p className="text-xs text-muted-foreground">AI extracts food items automatically</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center">
              <Check className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="font-medium text-sm">Auto-Categorization</p>
              <p className="text-xs text-muted-foreground">Items sorted by expiry dates</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-destructive/5 to-destructive/10 border-destructive/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-destructive/20 rounded-lg flex items-center justify-center">
              <Upload className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="font-medium text-sm">Cloud Sync</p>
              <p className="text-xs text-muted-foreground">Access from any device</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}