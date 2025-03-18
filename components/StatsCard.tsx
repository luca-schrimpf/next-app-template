import { Button, Card, CardBody, Tooltip } from "@heroui/react";
import Link from "next/link";
import React, { ElementType } from "react";
import { EyeIcon } from "@heroicons/react/24/solid";

interface StatsCardProps {
  title: string;
  icon: ElementType;
  value: string;
  description: string;
  href?: string;
  color: "green" | "orange";
}

const StatsCard = ({ content }: { content: StatsCardProps }) => {
  return (
    <Card
      className={`bg-gradient-to-br px-4 py-2  ${content.color === "green" ? " from-primary  to-[#006649]" : content.color === "orange" ? " from-orange-600 to-red-400" : ""} `}
    >
      <CardBody className="flex flex-col gap-3 justify-between">
        <h2 className="text-white text-2xl font-semibold">{content.title}</h2>
        <div className="flex items-center  gap-2">
          <content.icon className="text-white w-11 h-11" />
          <p className="text-4xl font-black">{content.value}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-white/75 text-sm">{content.description}</p>
          {content.href && (
            <Tooltip
              content={`Alle ${content.title} anzeigen`}
              color="foreground"
            >
              <Link href={content.href}>
                <Button className="bg-foreground/40" isIconOnly>
                  <EyeIcon className="text-foreground w-6 h-6" />
                </Button>
              </Link>
            </Tooltip>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default StatsCard;
