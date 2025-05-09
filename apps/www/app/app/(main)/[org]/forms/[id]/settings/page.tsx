"use client";

import React from "react";
import { useForm as useFormQuery, useUpdateForm } from "@/hooks/api/form";
import { useCurrentOrganization } from "@/hooks/use-current-org";
import { useParams } from "next/navigation";
import { Form, FormItem, FormLabel, FormControl, FormMessage, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { UpdatableForm } from "@/types/forms";
import { AlertCircle, Check } from "lucide-react";
import Tilt from "react-parallax-tilt";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SettingsPage() {
  const params = useParams();
  const org = useCurrentOrganization();
  const formId = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";
  const { data: form, isLoading, error } = useFormQuery(org.data?.id || "", formId);
  const updateFormMutation = useUpdateForm(org.data?.id || "", formId);

  const rhf = useForm<UpdatableForm>({
    defaultValues: {
      name: form?.name || "",
      isActive: form?.isActive ?? true,
      nonAcceptingMessage: form?.nonAcceptingMessage || "",
    },
  });

  const [showSuccess, setShowSuccess] = React.useState(false);

  React.useEffect(() => {
    if (form) {
      rhf.reset({
        name: form.name || "",
        isActive: form.isActive ?? true,
        nonAcceptingMessage: form.nonAcceptingMessage || "",
      });
    }
    if (updateFormMutation.isSuccess) {
      setShowSuccess(true);
      const timeout = setTimeout(() => {
        setShowSuccess(false);
        updateFormMutation.reset();
      }, 1500);
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, updateFormMutation.isSuccess]);

  const onSubmit = async (values: UpdatableForm) => {
    updateFormMutation.mutate(values);
  };

  const orgSlug = typeof params.org === "string" ? params.org : Array.isArray(params.org) ? params.org[0] : "";

  if (isLoading || !org.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 mb-3 border-4 border-solid border-muted-foreground/20 border-t-muted-foreground rounded-full animate-spin" />
        <span>Loading settings...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <Tilt
          perspective={500}
          glareEnable={true}
          glareMaxOpacity={0.45}
          scale={1.02}
          className="transform-3d rounded-xl p-4 bg-muted overflow-hidden mb-4"
        >
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="size-5" />
            <span>{error.message || "Failed to load form."}</span>
          </div>
        </Tilt>
        <h2>Something went wrong</h2>
      </div>
    );
  }
  if (!form) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <h2>Form not found</h2>
        <p>The form you are looking for does not exist or could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-4xl font-bold mb-2">Form Settings</h1>
      <p className="text-muted-foreground mb-2">Update your form&apos;s details and availability.</p>
      <div className="flex flex-row gap-2 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/app/${orgSlug}/forms/${formId}`}>
            <ArrowLeft className="mr-2" />
            Back to editor
          </Link>
        </Button>
      </div>
      <Form {...rhf}>
        <form onSubmit={rhf.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={rhf.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Form Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Form name" required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={rhf.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Accepting Responses</FormLabel>
                  <p className="text-muted-foreground text-xs">Enable to allow users to submit responses.</p>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={rhf.control}
            name="nonAcceptingMessage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Non-Accepting Message</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="This form is not currently accepting responses." rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="relative h-10 overflow-hidden w-full">
            <Button
              type="submit"
              disabled={updateFormMutation.isPending || showSuccess}
              className={`w-full flex items-center justify-center gap-2 absolute left-0 top-0 transition-all duration-300 ${showSuccess ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}
            >
              {updateFormMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
            <div
              className={`w-full h-10 flex items-center justify-center absolute left-0 top-0 transition-all duration-300 ${showSuccess ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}
            >
              {updateFormMutation.isError ? (
                <>
                  <AlertCircle className="size-4 mr-2" />
                  <span className="font-medium">{updateFormMutation.error?.message}</span>
                </>
              ) : (
                <>
                  <Check className="size-4 mr-2" />
                  <span className=" font-medium">Settings saved!</span>
                </>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
