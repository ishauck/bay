import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { EditIcon, LockIcon } from "lucide-react";
import { useState } from "react";
import { AlertDialogCancel, AlertDialogFooter } from "@/components/ui/alert-dialog";

const formSchema = z.object({
    name: z.string().min(3, { message: 'Name is required' }),
    slug: z.string()
})

function generateSlug(name: string) {
    return name
        .toLowerCase()
        .replace(/_/g, '-')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
}

interface NameSlugFormProps {
    onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
    isLoading?: boolean;
    nameLabel?: string;
    nameDescription?: string;
    slugLabel?: string;
    slugDescription?: string;
    submitLabel?: string;
    alertDialog?: boolean;
}

export function NameSlugForm({
    onSubmit,
    isLoading = false,
    nameLabel = "Name",
    nameDescription = "This is the display name",
    slugLabel = "Slug",
    slugDescription = "This will be used in the URL",
    submitLabel = "Submit",
    alertDialog = false
}: NameSlugFormProps) {
    const [isInputLocked, setIsInputLocked] = useState(true);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            slug: ""
        },
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{nameLabel}</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter name"
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        if (isInputLocked) {
                                            const newSlug = generateSlug(e.target.value);
                                            form.setValue("slug", newSlug);
                                        }
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                {nameDescription}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{slugLabel}</FormLabel>
                            <FormControl>
                                <div className="flex items-center gap-2">
                                    <Input
                                        placeholder="Enter slug"
                                        {...field}
                                        disabled={isInputLocked}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            if (!isInputLocked) {
                                                const newSlug = generateSlug(e.target.value);
                                                form.setValue("slug", newSlug);
                                            }
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="size-10"
                                        size="icon"
                                        onClick={() => {
                                            if (!isInputLocked) {
                                                const nameValue = form.getValues("name");
                                                const newSlug = generateSlug(nameValue);
                                                form.setValue("slug", newSlug);
                                            }
                                            setIsInputLocked(!isInputLocked);
                                        }}
                                    >
                                        {isInputLocked ? <EditIcon className="w-4 h-4" /> : <LockIcon className="w-4 h-4" />}
                                    </Button>
                                </div>
                            </FormControl>
                            <FormDescription>
                                {slugDescription}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {alertDialog ? (
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button type="submit" disabled={isLoading}>
                            {submitLabel}
                        </Button>
                    </AlertDialogFooter>
                ) : (
                    <Button type="submit" disabled={isLoading}>
                        {submitLabel}
                    </Button>
                )}
            </form>
        </Form>
    );
} 