import Link from "next/link";

import { useLocale } from "@lib/hooks/useLocale";

const PoweredByCal = () => {
  const { t } = useLocale();
  return (
    <div className="p-1 text-xs text-center sm:text-right">
      <Link href={`https://ventures.platan.us?utm_source=embed&utm_medium=powered-by-button-pv-cal`}>
        <a target="_blank" className="text-gray-500 opacity-50 hover:opacity-100 dark:text-white">
          {t("powered_by")}{" "}
          <img
            className="relative -mt-px inline h-[10px] w-auto dark:hidden"
            src="/pv-logo.svg"
            alt="PV Logo"
          />
          <img
            className="relative -mt-px hidden h-[10px] w-auto dark:inline"
            src="/pv-logo.svg"
            alt="PV Logo"
          />
        </a>
      </Link>
    </div>
  );
};

export default PoweredByCal;
