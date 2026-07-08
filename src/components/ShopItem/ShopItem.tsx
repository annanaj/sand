import { useTranslation } from "react-i18next";
import SuperMario from "../svg/supermario.svg";
import HomeIcon from "../svg/home.svg";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ShopItemProps = {
  onBuy?: () => void;
};

export function ShopItem({ onBuy }: ShopItemProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <div className="rounded-lg overflow-hidden mb-4">
          <SuperMario />
        </div>

        <CardTitle className="title title-left flex gap-2">
          <HomeIcon />
          {t("ShopItem.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>{t("ShopItem.description")}</p>
      </CardContent>
      <CardFooter className="justify-center">
        <Button
          aria-label={t("ShopItem.buyButton")}
          onClick={onBuy}
        >
          {t("ShopItem.buyButton")}
        </Button>
      </CardFooter>
    </Card>
  );
}
