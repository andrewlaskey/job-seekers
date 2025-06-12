"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createApplication } from "./actions";
import { ApplicationInsertFormData } from "@/types/applications.types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewApplicationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<ApplicationInsertFormData>({
    title: "",
    company: "",
    url: "",
    notes: "",
    interest: 0,
    alignment: 0,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const result = await createApplication(formData);

      if (result.error) {
        throw new Error(result.error);
      }

      router.push(`/applications/${result.data.id}`);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Link
        href="/applications"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Applications
      </Link>

      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">New Application</h1>
          <p className="mt-2 text-sm text-gray-600">
            Add a new job application to track
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Job Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                placeholder="e.g., Software Engineer"
              />
            </div>

            <div>
              <label
                htmlFor="company"
                className="block text-sm font-medium text-gray-700"
              >
                Company
              </label>
              <input
                type="text"
                name="company"
                id="company"
                required
                value={formData.company}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                placeholder="e.g., Acme Corp"
              />
            </div>

            <div>
              <label
                htmlFor="url"
                className="block text-sm font-medium text-gray-700"
              >
                Job Board Listing URL
              </label>
              <input
                type="url"
                name="url"
                id="url"
                value={formData.url}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                placeholder="https://example.com/jobs/123"
              />
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label
                  htmlFor="interest"
                  className="block text-sm font-medium text-gray-700"
                >
                  Interest
                </label>
                <span className="text-sm font-bold text-gray-700">
                  {formData.interest}
                </span>
              </div>
              <input
                type="range"
                name="interest"
                id="interest"
                value={formData.interest}
                min={0}
                max={5}
                step={1}
                onChange={handleChange}
                className="mt-1 block w-full p-2 appearance-none bg-transparent slider"
              />
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label
                  htmlFor="alignment"
                  className="block text-sm font-medium text-gray-700"
                >
                  Alignment
                </label>
                <span className="text-sm font-bold text-gray-700">
                  {formData.alignment}
                </span>
              </div>
              <input
                type="range"
                name="alignment"
                id="alignment"
                value={formData.alignment}
                min={0}
                max={5}
                step={1}
                onChange={handleChange}
                className="mt-1 block w-full p-2 appearance-none bg-transparent slider"
              />
            </div>

            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700"
              >
                Notes
              </label>
              <textarea
                name="notes"
                id="notes"
                rows={4}
                value={formData.notes ?? ""}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                placeholder="Add any notes about this application..."
              />
            </div>

            <div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isSubmitting
                    ? "bg-primary cursor-not-allowed"
                    : "bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                }`}
              >
                {isSubmitting ? "Creating..." : "Create Application"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
