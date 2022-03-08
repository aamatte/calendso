import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { useLocale } from "@lib/hooks/useLocale";
import showToast from "@lib/notification";
import { trpc } from "@lib/trpc";
import { WEBHOOK_TRIGGER_EVENTS } from "@lib/webhooks/constants";
import customTemplate, { hasTemplateIntegration } from "@lib/webhooks/integrationTemplate";

import { DialogFooter } from "@components/Dialog";
import { FieldsetLegend, Form, InputGroupBox, TextArea, TextField } from "@components/form/fields";
import Button from "@components/ui/Button";
import Switch from "@components/ui/Switch";
import { TWebhook } from "@components/webhook/WebhookListItem";
import WebhookTestDisclosure from "@components/webhook/WebhookTestDisclosure";

export default function WebhookDialogForm(props: {
  eventTypeId?: number;
  defaultValues?: TWebhook;
  handleClose: () => void;
}) {
  const { t } = useLocale();
  const utils = trpc.useContext();
  const handleSubscriberUrlChange = (e) => {
    form.setValue("subscriberUrl", e.target.value);
    if (hasTemplateIntegration({ url: e.target.value })) {
      setUseCustomPayloadTemplate(true);
      form.setValue("payloadTemplate", customTemplate({ url: e.target.value }));
    }
  };
  const {
    defaultValues = {
      id: "",
      eventTriggers: WEBHOOK_TRIGGER_EVENTS,
      subscriberUrl: "",
      active: true,
      payloadTemplate: null,
    } as Omit<TWebhook, "userId" | "createdAt" | "eventTypeId">,
  } = props;

  const [useCustomPayloadTemplate, setUseCustomPayloadTemplate] = useState(!!defaultValues.payloadTemplate);

  const form = useForm({
    defaultValues,
  });
  return (
    <Form
      data-testid="WebhookDialogForm"
      form={form}
      handleSubmit={async (event) => {
        const e = { ...event, eventTypeId: props.eventTypeId };
        if (!useCustomPayloadTemplate && event.payloadTemplate) {
          event.payloadTemplate = null;
        }
        if (event.id) {
          await utils.client.mutation("viewer.webhook.edit", e);
          await utils.invalidateQueries(["viewer.webhook.list"]);
          showToast(t("webhook_updated_successfully"), "success");
        } else {
          await utils.client.mutation("viewer.webhook.create", e);
          await utils.invalidateQueries(["viewer.webhook.list"]);
          showToast(t("webhook_created_successfully"), "success");
        }
        props.handleClose();
      }}
      className="space-y-4">
      <input type="hidden" {...form.register("id")} />
      <fieldset className="space-y-2">
        <InputGroupBox className="border-0 bg-gray-50">
          <Controller
            control={form.control}
            name="active"
            render={({ field }) => (
              <Switch
                label={field.value ? t("webhook_enabled") : t("webhook_disabled")}
                defaultChecked={field.value}
                onCheckedChange={(isChecked) => {
                  form.setValue("active", isChecked);
                }}
              />
            )}
          />
        </InputGroupBox>
      </fieldset>
      <TextField
        label={t("subscriber_url")}
        {...form.register("subscriberUrl")}
        required
        type="url"
        onChange={handleSubscriberUrlChange}
      />

      <fieldset className="space-y-2">
        <FieldsetLegend>{t("event_triggers")}</FieldsetLegend>
        <InputGroupBox className="border-0 bg-gray-50">
          {WEBHOOK_TRIGGER_EVENTS.map((key) => (
            <Controller
              key={key}
              control={form.control}
              name="eventTriggers"
              render={({ field }) => (
                <Switch
                  label={t(key.toLowerCase())}
                  defaultChecked={field.value.includes(key)}
                  onCheckedChange={(isChecked) => {
                    const value = field.value;
                    const newValue = isChecked ? [...value, key] : value.filter((v) => v !== key);

                    form.setValue("eventTriggers", newValue, {
                      shouldDirty: true,
                    });
                  }}
                />
              )}
            />
          ))}
        </InputGroupBox>
      </fieldset>
      <fieldset className="space-y-2">
        <FieldsetLegend>{t("payload_template")}</FieldsetLegend>
        <div className="space-x-3 text-sm rtl:space-x-reverse">
          <label>
            <input
              className="text-neutral-900 focus:ring-neutral-500"
              type="radio"
              name="useCustomPayloadTemplate"
              onChange={(value) => setUseCustomPayloadTemplate(!value.target.checked)}
              defaultChecked={!useCustomPayloadTemplate}
            />{" "}
            Default
          </label>
          <label>
            <input
              className="text-neutral-900 focus:ring-neutral-500"
              onChange={(value) => setUseCustomPayloadTemplate(value.target.checked)}
              name="useCustomPayloadTemplate"
              type="radio"
              defaultChecked={useCustomPayloadTemplate}
            />{" "}
            Custom
          </label>
        </div>
        {useCustomPayloadTemplate && (
          <TextArea
            {...form.register("payloadTemplate")}
            defaultValue={useCustomPayloadTemplate && (defaultValues.payloadTemplate || "")}
            rows={3}
          />
        )}
      </fieldset>
      <WebhookTestDisclosure />
      <DialogFooter>
        <Button type="button" color="secondary" onClick={props.handleClose} tabIndex={-1}>
          {t("cancel")}
        </Button>
        <Button type="submit" loading={form.formState.isSubmitting}>
          {t("save")}
        </Button>
      </DialogFooter>
    </Form>
  );
}
