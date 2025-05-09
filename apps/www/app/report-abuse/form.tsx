'use client';

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { FileWarningIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { reportAbuse } from "@/lib/api/report-abuse";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export function ReportAbuseForm({ formId }: { formId: string }) {
    const [reason, setReason] = useState('');
    const [details, setDetails] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const result = await reportAbuse(formId, reason, details);
            
            if (result.error) {
                toast.error(result.error.message);
                return;
            }

            toast.success("Report submitted successfully");
            router.push('/report-abuse/success');
        } catch (error) {
            console.error('Error submitting report:', error);
            toast.error("Failed to submit report. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="space-y-2">
                <Label htmlFor="reason">Reason for reporting</Label>
                <Textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Please explain why you are reporting this form..."
                    required
                    maxLength={1000}
                    className="min-h-[50px] max-h-[100px]"
                />
                <p className="text-sm text-muted-foreground">
                    {reason.length}/1000 characters
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="details">Additional details (optional)</Label>
                <Input
                    id="details"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Any additional information that might help us understand the situation..."
                    maxLength={100}
                />
                <p className="text-sm text-muted-foreground">
                    {details.length}/100 characters
                </p>
            </div>

            <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
            >
                <FileWarningIcon className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
        </form>
    );
}
