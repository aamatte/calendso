import React, { useEffect, useState } from "react";
import useDigitInput from "react-digit-input";
import { useFormContext } from "react-hook-form";

import { useLocale } from "@lib/hooks/useLocale";

import { Input } from "@components/form/fields";

export default function TwoFactor() {
  const [value, onChange] = useState("");
  const { t } = useLocale();
  const methods = useFormContext();

  const digits = useDigitInput({
    acceptedCharacters: /^[0-9]$/,
    length: 6,
    value,
    onChange,
  });

  useEffect(() => {
    if (value) methods.setValue("totpCode", value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const className = "h-12 w-12 !text-xl text-center";

  return (
    <div className="mx-auto !mt-0 max-w-sm">
      <p className="mb-4 text-sm text-gray-500">{t("2fa_enabled_instructions")}</p>
      <input hidden type="hidden" value={value} {...methods.register("totpCode")} />
      <div className="flex flex-row space-x-1">
        <Input className={className} name="2fa1" inputMode="decimal" {...digits[0]} autoFocus />
        <Input className={className} name="2fa2" inputMode="decimal" {...digits[1]} />
        <Input className={className} name="2fa3" inputMode="decimal" {...digits[2]} />
        <Input className={className} name="2fa4" inputMode="decimal" {...digits[3]} />
        <Input className={className} name="2fa5" inputMode="decimal" {...digits[4]} />
        <Input className={className} name="2fa6" inputMode="decimal" {...digits[5]} />
      </div>
    </div>
  );
}
