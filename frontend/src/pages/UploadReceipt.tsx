import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { toast } from "sonner";
import { FiArrowLeft, FiUpload, FiCamera, FiFileText, FiCheck } from "react-icons/fi";
import { useReceiptStore } from "@/store/useReceiptStore";
import { ReceiptFormValues } from "@/types";

// Form validation schema
const formSchema = z.object({
  merchant: z.string().min(1, "Merchant name is required"),
  date: z.string().min(1, "Date is required"),
  amount: z.string().min(1, "Amount is required"),
  category: z.string().min(1, "Category is required"),
  notes: z.string().optional(),
});

const UploadReceipt = () => {
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrData, setOcrData] = useState<Partial<ReceiptFormValues> | null>(null);
  const { addReceipt, categories } = useReceiptStore();

  const form = useForm<ReceiptFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      merchant: "",
      date: new Date().toISOString().split("T")[0],
      amount: "",
      category: "",
      notes: "",
    },
  });

  // Mock OCR processing
  const processReceiptImage = (file: File) => {
    setIsProcessing(true);

    // Simulate API call delay
    setTimeout(() => {
      // Mock OCR data
      const mockOcrData = {
        merchant: "Walmart",
        date: "2023-11-15",
        amount: "56.78",
        category: "Groceries",
      };

      setOcrData(mockOcrData);

      // Update form with OCR data
      form.setValue("merchant", mockOcrData.merchant);
      form.setValue("date", mockOcrData.date);
      form.setValue("amount", mockOcrData.amount);
      form.setValue("category", mockOcrData.category);

      setIsProcessing(false);

      toast.success("Receipt processed successfully!");
    }, 1500);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Process the receipt image
      processReceiptImage(file);
    }
  };

  const onSubmit = (data: ReceiptFormValues) => {
    // Convert amount to number
    const amountNumber = parseFloat(data.amount);

    // Add receipt to store
    addReceipt({
      merchant: data.merchant,
      date: data.date,
      amount: amountNumber,
      category: data.category,
      notes: data.notes,
      imageUrl: previewUrl || undefined,
    });

    toast.success("Receipt saved successfully!");
    navigate("/dashboard");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="mr-4"
        >
          <FiArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Add Receipt</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Receipt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              {previewUrl ? (
                <div className="relative w-full max-w-md">
                  <img
                    src={previewUrl}
                    alt="Receipt preview"
                    className="w-full rounded-lg shadow-md object-contain max-h-96"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-background/80 backdrop-blur-sm"
                      onClick={() => setPreviewUrl(null)}
                    >
                      Change
                    </Button>
                  </div>

                  {isProcessing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-lg">
                      <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p className="text-sm font-medium">Processing receipt...</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="cursor-pointer">
                      <div className="flex flex-col items-center p-6 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:bg-muted transition-colors">
                        <FiUpload className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">Upload receipt</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </div>
                    </label>
                    <label className="cursor-pointer">
                      <div className="flex flex-col items-center p-6 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:bg-muted transition-colors">
                        <FiCamera className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">Take photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </div>
                    </label>
                  </div>

                  <div className="mt-6 text-center text-sm text-muted-foreground">
                    <p>Upload a receipt image to automatically extract information</p>
                    <p>Supported formats: JPG, PNG</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Form Section */}
        <Card>
          <CardHeader>
            <CardTitle>Receipt Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="merchant"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Merchant</FormLabel>
                        <FormControl>
                          <Input placeholder="Store or business name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.name}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add any additional details about this receipt"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">Save Receipt</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UploadReceipt;