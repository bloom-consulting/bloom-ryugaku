"use client";
import {
  BriefcaseBusiness,
  Building,
  ChevronLeft,
  ChevronRight,
  Earth,
  Flower2,
  GraduationCap,
  Handshake,
  HeartHandshake,
  Laptop,
  Laugh,
  LucideIcon,
  MapPinned,
  PartyPopper,
  ShoppingCart,
  Smartphone,
  Stethoscope,
  Store,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";

export interface Category {
  name: string;
  icon: LucideIcon | null;
  pathname: string;
}

// サイト全体のパス情報
export const CATEGORY_LIST: Category[] = [
  {
    name: "シェアハウス",
    icon: null,
    pathname: "/properties",
  },
  {
    name: "おすすめブログ",
    icon: Laptop,
    pathname: "/blogs",
  },
  {
    name: "お仕事探し",
    icon: BriefcaseBusiness,
    pathname: "/jobs",
  },
  {
    name: "インターン",
    icon: Handshake,
    pathname: "/internships",
  },
  {
    name: "ミートアップ",
    icon: PartyPopper,
    pathname: "/meetups",
  },
  {
    name: "フリーマーケット",
    icon: ShoppingCart,
    pathname: "/marketplaces",
  },
  {
    name: "スキルマーケット",
    icon: Laugh,
    pathname: "/skill-markets",
  },
  {
    name: "個人経営のお店",
    icon: Store,
    pathname: "/local-shops",
  },
  {
    name: "留学エージェント",
    icon: Building,
    pathname: "/agencies",
  },
  {
    name: "トイレマップ",
    icon: MapPinned,
    pathname: "/washrooms",
  },
  {
    name: "留学校サーチ",
    icon: GraduationCap,
    pathname: "/schools",
  },
  {
    name: "エピソードシェア",
    icon: Earth,
    pathname: "/experiences",
  },
  {
    name: "携帯SIMカード",
    icon: Smartphone,
    pathname: "/mobile-carriers",
  },
  {
    name: "海外留学保険",
    icon: HeartHandshake,
    pathname: "/insurance",
  },
  {
    name: "クリニック",
    icon: Stethoscope,
    pathname: "/clinics",
  },
  {
    name: "BLOOMニュース",
    icon: Flower2,
    pathname: "/bloom-news",
  },
] as const;
/**
 * カテゴリーコンポーネント
 */
function Categories() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start", // スライドを左端から配置
    containScroll: "trimSnaps", // スクロール範囲をスナップ位置に制限
    dragFree: true, // 指やマウスで自由にスクロール可能にする
  });

  // スクロールボタンの有効/無効状態を管理する
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const scrollStep = 2; // 1回のスクロールで移動するスナップ数

  /**
   * 左（前のカテゴリー）へスクロールする
   */
  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    const currentIndex = emblaApi.selectedScrollSnap(); // 現在のスナップ位置
    emblaApi.scrollTo(Math.max(0, currentIndex - scrollStep)); // 左に移動（最小値0）
  }, [emblaApi, scrollStep]);

  /**
   * 右（次のカテゴリー）へスクロールする
   */
  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    const currentIndex = emblaApi.selectedScrollSnap(); // 現在のスナップ位置
    emblaApi.scrollTo(
      Math.min(emblaApi.scrollSnapList().length - 1, currentIndex + scrollStep)
    ); // 右に移動（最大値）
  }, [emblaApi, scrollStep]);

  /**
   * スクロール位置に応じてボタンの表示/非表示を更新する
   */
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  /**
   * Embla の初期化時やスクロール時にボタンの状態を更新する
   */
  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect); // スクロール位置が変わるたびに実行
    emblaApi.on("reInit", onSelect); // Embla が再初期化されたときにも実行
  }, [emblaApi, onSelect]);

  const pathname = usePathname();
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  /**
   * 要素が完全に画面内に収まっているかを判定
   */
  const isCategoryFullyInView = useCallback(
    (categoryPath: string) => {
      const element = categoryRefs.current[categoryPath];
      if (!element || !emblaApi) return false;

      const elementRect = element.getBoundingClientRect();
      const emblaContainer = emblaApi.containerNode().getBoundingClientRect();

      return (
        elementRect.left >= emblaContainer.left &&
        elementRect.right <= emblaContainer.right
      );
    },
    [emblaApi]
  );

  /**
   * カテゴリがクリックされたときのスクロール制御
   */
  const handleCategoryClick = (pathname: string) => {
    if (!emblaApi) return;

    const element = categoryRefs.current[pathname];
    if (!element) return;

    // カテゴリ要素の位置を取得
    const rect = element.getBoundingClientRect();

    // Embla のスクロールコンテナを取得
    const container = emblaApi.containerNode();
    if (!container) return;

    const containerRect = container.getBoundingClientRect();

    // 完全に画面内に収まっているか判定
    const isFullyVisible =
      rect.left >= containerRect.left && rect.right <= containerRect.right;

    // 画面内に収まっていない場合のみスクロール
    if (!isFullyVisible) {
      emblaApi.scrollTo(
        CATEGORY_LIST.findIndex((item) => item.pathname === pathname)
      );
    }
  };

  /**
   * 初回ロード時に現在のカテゴリを画面内に収める
   */
  useEffect(() => {
    if (!emblaApi) return;

    if (!isCategoryFullyInView(pathname)) {
      const index = CATEGORY_LIST.findIndex(
        (item) => item.pathname === pathname
      );
      if (index !== -1) {
        emblaApi.scrollTo(index);
      }
    }
  }, [pathname, emblaApi, isCategoryFullyInView]);

  const [isFixed, setIsFixed] = useState(false);

  /**
   * 固定するかどうかスクロールの高さで判断する
   */
  useEffect(() => {
    const handleScroll = () => {
      setIsFixed(window.scrollY > 100); // 100px 以上スクロールで固定
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // カテゴリ一覧のpathnameに完全一致するかチェック
  const isExactMatch = CATEGORY_LIST.some(
    (category) => category.pathname === pathname
  );

  // 一致しない場合は表示しない
  if (!isExactMatch) return null;

  return (
    // TODO: 全ページのフィルターが完成したらヘッダーを固定する。下のdivのコメントを解除すると固定される。
    // <div
    //   className={`w-full z-50 transition-all duration-300 ${
    //     isFixed ? "fixed top-0 left-0 bg-white shadow-md" : ""
    //   }`}
    // >
    <div className="w-full flex justify-center">
      <div className="relative base-px py-2 h-20  ">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {CATEGORY_LIST.map((item, index) => (
              <div
                key={item.name}
                ref={(el) => {
                  categoryRefs.current[item.pathname] = el;
                }}
                onClick={() => handleCategoryClick(item.pathname)}
                className={`${index === 0 ? "ml-0" : "ml-2 lg:ml-3"} ${
                  index === CATEGORY_LIST.length - 1 ? "mr-0" : "mr-2 lg:mr-3"
                }`}
              >
                <CategoryBox
                  icon={item.icon}
                  name={item.name}
                  pathname={item.pathname}
                  selected={pathname === item.pathname}
                />
              </div>
            ))}
          </div>
        </div>
        {/* スクロールボタン PCで表示 */}
        <div className="hidden lg:block">
          {prevBtnEnabled && (
            <button
              className="absolute left-10 xl:left-20 top-1/2 transform -translate-y-1/2 border bg-white p-1 rounded-full shadow-md z-10"
              onClick={scrollPrev}
            >
              <ChevronLeft size={18} />
            </button>
          )}
          {nextBtnEnabled && (
            <button
              className="absolute right-10 xl:right-20 top-1/2 transform -translate-y-1/2 border bg-white p-1 rounded-full shadow-md z-10"
              onClick={scrollNext}
            >
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
    // </div>
  );
}

function CategoryBox({
  icon: Icon,
  name,
  pathname,
  selected,
}: {
  icon: LucideIcon | null;
  name: string;
  pathname: string;
  selected: boolean;
}) {
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(pathname);
  }, [pathname, router]);

  return (
    <div className="flex-grow-0 flex-shrink-0 basis-1/12 group">
      <div
        onClick={handleClick}
        className={`flex flex-col items-center justify-between gap-1 py-2 border-b-2 group-hover:text-gray-800 transition cursor-pointer
        ${
          selected
            ? "border-b-gray-800 font-semibold"
            : "border-transparent text-bloom-gray"
        }
        `}
      >
        {Icon ? (
          <Icon className="h-6" strokeWidth={1} />
        ) : (
          <Image
            src={`/ouchiLogo/ouchi_category_${
              selected ? "active" : "disable"
            }.png`}
            alt="バンクーバーのお家"
            className="w-10 h-6"
            width={25}
            height={15}
            unoptimized={true}
          />
        )}

        <div className="text-[10px] whitespace-nowrap rounded-md">{name}</div>
      </div>
    </div>
  );
}

export { Categories };
