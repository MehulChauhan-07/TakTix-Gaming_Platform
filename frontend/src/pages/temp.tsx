import {
  AnimatedPage,
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@components/layout/animated-page";
import { useAuth } from "@hooks/use-Auth";
import { EnhancedGameCard } from "./home/components/gamecard";
import { ScrollAnimation } from "../components/layout/scroll-animation";

export default function TempPage() {
  const { user } = useAuth();

  return (
    <AnimatedPage>
      {/* Hero Section */}
      <FadeIn>
        <div className="relative bg-gradient-to-b from-primary/20 to-background pt-20 pb-16">
          {/* Hero content... */}
        </div>
      </FadeIn>

      {/* Featured Games */}
      <FadeIn delay={0.2}>
        <div className="container mx-auto py-12">
          <ScrollAnimation animation="fade" delay={0.2}>
            <h2 className="text-3xl font-bold text-center mb-8">
              Featured Games
            </h2>
          </ScrollAnimation>
          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StaggerItem>
                <EnhancedGameCard
                  title="Chess"
                  description="The classic strategy game of kings and queens"
                  image="/placeholder.svg?height=200&width=300"
                  players="2 Players"
                  href="/games"
                />
              </StaggerItem>
              <StaggerItem>
                <EnhancedGameCard
                  title="Tic-Tac-Toe"
                  description="Simple yet strategic game of X's and O's"
                  image="/placeholder.svg?height=200&width=300"
                  players="2 Players"
                  href="/games"
                />
              </StaggerItem>
              <StaggerItem>
                <EnhancedGameCard
                  title="Coming Soon"
                  description="More multiplayer games are on the way!"
                  image="/placeholder.svg?height=200&width=300"
                  players="3-4 Players"
                  href="#"
                  disabled
                />
              </StaggerItem>
            </div>
          </StaggerContainer>
        </div>
      </FadeIn>

      {/* Rest of your sections... */}
    </AnimatedPage>
  );
}
