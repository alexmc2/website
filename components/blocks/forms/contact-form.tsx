// components/blocks/forms/ContactForm.tsx
"use client";

import { useCallback } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { stegaClean } from "next-sanity";
import { Loader2 } from "lucide-react";

import SectionContainer from "@/components/ui/section-container";
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
import type { ColorVariant, SectionPadding } from "@/sanity.types";

export type ContactFormBlock = {
  _type: "form-contact";
  _key: string;
  padding?: SectionPadding | null;
  colorVariant?: ColorVariant | null;
  heading?: string | null;
  body?: string | null;
  formspreeFormId?: string | null;
  submitButtonLabel?: string | null;
  successMessage?: string | null;
};

type FormContactProps = ContactFormBlock;

const contactFormSchema = z.object({
  name: z.string().min(1, {
    message: "Please enter your name",
  }),
  email: z
    .string()
    .min(1, {
      message: "Please enter your email",
    })
    .email({
      message: "Please enter a valid email",
    }),
  message: z.string().min(1, {
    message: "Please share a message",
  }),
});

const cleanString = (value?: string | null) =>
  value ? stegaClean(value) : undefined;

export default function ContactForm({
  padding,
  colorVariant,
  heading,
  body,
  formspreeFormId,
  submitButtonLabel,
  successMessage,
}: FormContactProps) {
  const cleanedColor = colorVariant ? stegaClean(colorVariant) : undefined;
  const cleanedHeading = cleanString(heading) ?? "Get in touch";
  const cleanedBody = cleanString(body);
  const cleanedFormId = cleanString(formspreeFormId);
  const cleanedSubmitLabel = cleanString(submitButtonLabel) ?? "Send message";
  const cleanedSuccessMessage = cleanString(successMessage);

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const { isSubmitting } = form.formState;

  const handleSubmit = useCallback(
    async (values: z.infer<typeof contactFormSchema>) => {
      if (!cleanedFormId) {
        toast.error("The contact form is not configured yet.");
        return;
      }

      try {
        const response = await fetch(`https://formspree.io/f/${cleanedFormId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(values),
        });

        const result = await response.json();

        if (response.ok) {
          const messageText = cleanedSuccessMessage || "Your message has been sent.";
          toast.success(messageText);
          form.reset();
        } else {
          toast.error(result?.errors?.[0]?.message || "Something went wrong. Please try again.");
        }
      } catch (error: any) {
        toast.error(error.message || "Unable to send your message right now.");
      }
    },
    [cleanedFormId, cleanedSuccessMessage, form]
  );

  async function onSubmit(values: z.infer<typeof contactFormSchema>) {
    await handleSubmit(values);
  }

  return (
    <SectionContainer color={cleanedColor} padding={padding}>
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold tracking-tight lg:text-4xl">
            {cleanedHeading}
          </h2>
          {cleanedBody && (
            <p className="text-muted-foreground whitespace-pre-line">{cleanedBody}</p>
          )}
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Your name" autoComplete="name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="you@yourbusiness.co.uk"
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      rows={5}
                      className="flex min-h-[160px] w-full rounded-md border border-input bg-white px-3 py-3 text-base shadow-none transition-colors placeholder:text-muted-foreground focus-visible:border-slate-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                      placeholder="How can we help?"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {cleanedSubmitLabel || "Send message"}
            </Button>
          </form>
        </Form>
      </div>
    </SectionContainer>
  );
}
