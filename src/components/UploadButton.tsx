import { useState, useRef } from "react";
import { Upload, Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { sendToGemini } from "@/services/geminiService";
import { addItemsToFirebase } from "@/firebaseUtils";

interface UploadButtonProps {
  onUploadComplete?: () => void; // Callback to refresh inventory
}

export function UploadButton({ onUploadComplete }: UploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    await processFiles(Array.from(files));
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };





  const processFiles = async (files: File[]) => {
    console.log('=== UPLOAD PROCESS STARTED ===');
    console.log('Files to process:', files.length);
    
    setIsUploading(true);
    let totalItemsAdded = 0;

    try {
      for (const file of files) {
        console.log(`Processing file: ${file.name} (${file.type})`);
        try {
          // Validate file type
          if (!file.type.startsWith('image/')) {
            console.log(`Invalid file type: ${file.type}`);
            toast({
              title: "Invalid File Type",
              description: `${file.name} is not an image file. Please select an image.`,
              variant: "destructive",
            });
            continue;
          }

          console.log('File validation passed, calling sendToGemini...');
          // Send to Gemini API for processing
          const extractedItems = await sendToGemini(file);
          console.log('Gemini response received:', extractedItems);
          console.log('Number of items:', extractedItems ? extractedItems.length : 0);
          
          if (extractedItems && extractedItems.length > 0) {
            console.log('Items found, adding to Firebase...');
            // Save items to Firebase
            await addItemsToFirebase(extractedItems);
            totalItemsAdded += extractedItems.length;
            
            console.log(`✅ Processed ${file.name}: ${extractedItems.length} items extracted and saved`);
          } else {
            console.log(`❌ No items extracted from ${file.name}`);
            toast({
              title: "No Items Found",
              description: `No food items could be extracted from ${file.name}.`,
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error(`❌ Error processing ${file.name}:`, error);
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
          title: "Upload Complete! 🎉",
          description: `Successfully added ${totalItemsAdded} items to your inventory.`,
        });
        
        // Refresh the inventory list
        if (onUploadComplete) {
          onUploadComplete();
        }
      } else {
        toast({
          title: "No Items Added",
          description: "No food items could be extracted from the uploaded images.",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "An error occurred while processing the images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <Button
        onClick={handleButtonClick}
        disabled={isUploading}
        size="lg"
        className="shadow-soft hover:shadow-medium transition-smooth bg-gradient-to-r from-primary to-primary-glow text-white border-0"
      >
        {isUploading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Camera className="w-5 h-5 mr-2" />
            Upload Grocery Bills & Food Labels
          </>
        )}
      </Button>
      
      <p className="text-sm text-muted-foreground text-center max-w-md">
        Upload images of grocery receipts, food labels, or shopping lists. 
        Our AI will automatically extract food items and add them to your inventory.
      </p>
    </div>
  );
}
