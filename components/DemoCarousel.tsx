import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

const imagesData = [
  {
    alt: "my workouts",
    src: "/my-movs.png",
    width: 700,
    height: 500,
  },
  {
    alt: "new workouts",
    src: "/new-workouts.png",
    width: 700,
    height: 500,
  },
  {
    alt: "share profile",
    src: "/share-profile.png",
    width: 960,
    height: 540,
  },
];

export default function DemoCarousel() {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {imagesData.map((image, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex h-[540px] w-[960] items-center justify-center p-6">
                  <Image
                    className="flex h-[540px] w-[960px] justify-center rounded-2xl shadow-2xl"
                    src={image.src}
                    alt={image.alt}
                    height={image.height}
                    width={image.width}
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
