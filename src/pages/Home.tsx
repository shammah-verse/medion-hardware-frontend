import { ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="flex flex-col gap-y-32 pb-32">
      {/* Hero Section */}
      <section className="relative px-6 pt-32 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-serif text-foreground leading-[1.1] tracking-tight mb-8">
            Tools for the modern maker.
          </h1>
          <p className="text-xl md:text-2xl text-muted font-light leading-relaxed mb-12 max-w-2xl">
            Uncompromising hardware designed with an obsessive attention to detail, tactile feedback, and enduring materials.
          </p>
          <div className="flex flex-wrap gap-6">
            <Link to="/products">
              <Button size="lg" className="gap-3">
                Explore Collection
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Our Story
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Image Macro-Spacing */}
      <section className="px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="aspect-[21/9] w-full rounded-[32px] bg-border-light dark:bg-border-dark overflow-hidden relative">
          {/* We'd put a beautiful generated image here, simulating for now */}
          <div className="absolute inset-0 bg-gradient-to-tr from-accent-terracotta/20 to-transparent mix-blend-multiply" />
          <div className="w-full h-full object-cover bg-[#E5E5E5] dark:bg-[#2A2A2A]" />
        </div>
      </section>

      {/* Editorial Section */}
      <section className="px-6 lg:px-8 max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-16 md:gap-32 items-center">
        <div>
          <h2 className="text-4xl font-serif text-foreground mb-6 leading-tight">
            Designed to disappear into your workflow.
          </h2>
          <p className="text-lg text-muted leading-relaxed">
            We believe that the best tools are the ones you don't notice. By focusing on essential forms and tactile materials, Medion hardware provides a seamless extension of your creative process. No glowing lights, no superfluous buttons. Just pure utility.
          </p>
        </div>
        <div className="aspect-square rounded-[24px] bg-border-light dark:bg-border-dark" />
      </section>
    </div>
  );
}
