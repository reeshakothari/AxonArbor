import { Container } from "@/components/layout/Container";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <Container className="py-28 sm:py-40">
          <Eyebrow>Page not found</Eyebrow>
          <h1 className="mt-6 max-w-3xl font-serif text-5xl leading-[1.05] tracking-tight sm:text-7xl">
            This branch doesn’t lead anywhere.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-grey-600">
            The page you’re looking for may have moved when we refreshed our site.
          </p>
          <ButtonLink href="/" className="mt-10">
            Back to home
          </ButtonLink>
        </Container>
      </main>
      <Footer />
    </>
  );
}
