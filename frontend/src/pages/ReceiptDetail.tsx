import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { toast } from "sonner";
import { FiArrowLeft, FiEdit2, FiTrash2, FiDownload, FiCalendar, FiTag, FiDollarSign, FiFileText } from "react-icons/fi";
import { useReceiptStore } from "@/store/useReceiptStore";

const ReceiptDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { receipts, deleteReceipt } = useReceiptStore();

  // Find receipt by ID
  const receipt = receipts.find(r => r.id === id);

  // If receipt not found, show error
  if (!receipt) {
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
          <h1 className="text-3xl font-bold">Receipt Not Found</h1>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                The receipt you're looking for could not be found.
              </p>
              <Button onClick={() => navigate("/receipts")}>
                View All Receipts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDelete = () => {
    deleteReceipt(id!);
    toast.success("Receipt deleted successfully");
    navigate("/dashboard");
  };

  const handleDownload = () => {
    // Create a simple JSON representation of the receipt
    const receiptData = JSON.stringify(receipt, null, 2);

    // Create a blob and download link
    const blob = new Blob([receiptData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Receipt downloaded successfully");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-4"
          >
            <FiArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">{receipt.merchant}</h1>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownload}>
            <FiDownload className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" onClick={() => navigate(`/edit-receipt/${id}`)}>
            <FiEdit2 className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <FiTrash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Receipt</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this receipt? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Receipt Image */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Receipt Image</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            {receipt.imageUrl ? (
              <img
                src={receipt.imageUrl}
                alt="Receipt"
                className="max-h-96 rounded-md object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-64 bg-muted rounded-md p-6 text-center">
                <FiFileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No receipt image available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Receipt Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Receipt Details</CardTitle>
            <CardDescription>
              Purchased on {formatDate(receipt.date)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground flex items-center">
                  <FiCalendar className="mr-1 h-4 w-4" /> Date
                </span>
                <span className="font-medium">{formatDate(receipt.date)}</span>
              </div>

              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground flex items-center">
                  <FiTag className="mr-1 h-4 w-4" /> Category
                </span>
                <span className="font-medium">{receipt.category}</span>
              </div>

              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground flex items-center">
                  <FiDollarSign className="mr-1 h-4 w-4" /> Total Amount
                </span>
                <span className="font-medium">${receipt.amount.toFixed(2)}</span>
              </div>
            </div>

            {receipt.notes && (
              <div>
                <h3 className="text-sm font-medium mb-2">Notes</h3>
                <p className="text-sm text-muted-foreground">{receipt.notes}</p>
              </div>
            )}

            {receipt.items && receipt.items.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {receipt.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <div className="text-sm text-muted-foreground">
              Created: {formatDate(receipt.createdAt)}
            </div>
            {receipt.updatedAt !== receipt.createdAt && (
              <div className="text-sm text-muted-foreground">
                Updated: {formatDate(receipt.updatedAt)}
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ReceiptDetail;