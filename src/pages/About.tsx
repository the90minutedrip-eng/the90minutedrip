import { useEffect } from "react";
import Header from "@/components/layout/Header";
import Founders from "@/components/sections/Founders";

const About = () => {
  useEffect(() => {
    document.title = "About | The 90 Minute Drip";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Meet the five founders behind The 90 Minute Drip — a 3D scroll story.");
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <section className="container mx-auto py-12 md:py-16">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-semibold">About</h1>
            <p className="text-muted-foreground">The five partners powering the drip.</p>
          </header>
        </section>
        <Founders />
      </main>
    </div>
  );
};

export default About;
