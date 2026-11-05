import { createFileRoute } from "@tanstack/react-router";
import BlurFade from "@/components/magicui/blur-fade";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import { TravelGlobe } from "@/components/shared/travel-globe";
import { MAPBOX_TOKEN, TRAVEL_LOCATIONS } from "@/data/travel";
import { useLocale } from "@/lib/i18n";
import * as storyContent from "@/data/i18n/story";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

export const Route = createFileRoute("/story")({
  component: StoryPage,
});

const BLUR_FADE_DELAY = 0.04;

function StoryPage() {
  const { locale } = useLocale();
  const story = storyContent[locale];

  return (
    <main className="flex flex-col min-h-dvh">
      <section id="story">
        <BlurFade delay={BLUR_FADE_DELAY}>
          <div className="max-w-2xl mx-auto">
            <TypingAnimation
              delay={BLUR_FADE_DELAY * 1000 + 200}
              duration={50}
              className="text-2xl font-bold tracking-tight mb-6"
              text={story.title}
            />
            <article className="article story-article">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {story.intro}
              </ReactMarkdown>
            </article>
            <TravelGlobe locations={TRAVEL_LOCATIONS} mapboxToken={MAPBOX_TOKEN} />
            <article className="article story-article">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {story.rest}
              </ReactMarkdown>
            </article>
          </div>
        </BlurFade>
      </section>
    </main>
  );
}
