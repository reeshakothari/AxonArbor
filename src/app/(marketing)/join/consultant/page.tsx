import type { Metadata } from "next";
import { ConsultantSignUpForm } from "@/components/accounts/AuthForms";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/sections/PageHeader";

export const metadata: Metadata = {
  title: "Join as a consultant",
  description: "Create your Axon Arbor consultant account and build your profile.",
  alternates: { canonical: "/join/consultant" },
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="For consultants"
        heading="Join the Axon Arbor network."
        lede="Create your account, then complete your profile. Our team reviews every profile before companies can see it."
      />
      <Container className="py-16 sm:py-20">
        <ConsultantSignUpForm />
      </Container>
    </>
  );
}
