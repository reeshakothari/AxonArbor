import type { Metadata } from "next";
import { ConsultantSignUpForm } from "@/components/accounts/AuthForms";
import { BenefitsBand, CONSULTANT_BENEFITS, CONSULTANT_STEPS, ExpertiseTicker, FormWithSteps } from "@/components/accounts/Pitch";
import { PageHeader } from "@/components/sections/PageHeader";

export const metadata: Metadata = {
  title: "Join as a consultant",
  description: "Join the Axon Arbor consultant network and be matched to vetted organisations looking for your expertise.",
  alternates: { canonical: "/join/consultant" },
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="For consultants"
        heading="Your expertise, in front of the right organisations."
        lede="Join the Axon Arbor network of trainers, coaches and facilitators, and be matched to companies that need exactly what you do."
      />
      <ExpertiseTicker />
      <BenefitsBand eyebrow="Why join" heading="Built for independent experts." points={CONSULTANT_BENEFITS} />
      <FormWithSteps title="Create your account" steps={CONSULTANT_STEPS}>
        <ConsultantSignUpForm />
      </FormWithSteps>
    </>
  );
}
