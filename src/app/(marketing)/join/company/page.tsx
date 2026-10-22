import type { Metadata } from "next";
import Link from "next/link";
import { CompanySignUpForm } from "@/components/accounts/AuthForms";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/sections/PageHeader";

export const metadata: Metadata = {
  title: "Register your company",
  description: "Register your organisation with Axon Arbor using your work email.",
  alternates: { canonical: "/join/company" },
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="For companies"
        heading="Register your organisation."
        lede="Sign up with your work email. We check every company before granting access, so consultants’ profiles stay with genuine organisations."
      />
      <Container className="py-16 sm:py-20">
        <div className="max-w-3xl">
          <CompanySignUpForm />
          <p className="mt-10 text-sm text-grey-600">
            Already registered?{" "}
            <Link href="/sign-in" className="text-ink underline decoration-amber decoration-2 underline-offset-4">
              Sign in
            </Link>
            .
          </p>
        </div>
      </Container>
    </>
  );
}
