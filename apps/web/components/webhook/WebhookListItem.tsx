import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";

import classNames from "@calcom/lib/classNames";

import { useLocale } from "@lib/hooks/useLocale";
import { inferQueryOutput, trpc } from "@lib/trpc";

import { Dialog, DialogTrigger } from "@components/Dialog";
import { ListItem } from "@components/List";
import { Tooltip } from "@components/Tooltip";
import ConfirmationDialogContent from "@components/dialog/ConfirmationDialogContent";
import Button from "@components/ui/Button";

export type TWebhook = inferQueryOutput<"viewer.webhook.list">[number];

export default function WebhookListItem(props: { webhook: TWebhook; onEditWebhook: () => void }) {
  const { t } = useLocale();
  const utils = trpc.useContext();
  const deleteWebhook = trpc.useMutation("viewer.webhook.delete", {
    async onSuccess() {
      await utils.invalidateQueries(["viewer.webhook.list"]);
    },
  });

  return (
    <ListItem className="-mt-px flex w-full p-4">
      <div className="flex w-full justify-between">
        <div className="flex max-w-full flex-col truncate">
          <div className="flex space-y-1">
            <span
              className={classNames(
                "truncate text-sm",
                props.webhook.active ? "text-neutral-700" : "text-neutral-200"
              )}>
              {props.webhook.subscriberUrl}
            </span>
          </div>
          <div className="mt-2 flex">
            <span className="flex flex-col space-x-2 space-y-1 text-xs sm:flex-row sm:space-y-0 sm:rtl:space-x-reverse">
              {props.webhook.eventTriggers.map((eventTrigger, ind) => (
                <span
                  key={ind}
                  className={classNames(
                    "w-max rounded-sm px-1 text-xs ",
                    props.webhook.active ? "bg-blue-100 text-blue-700" : "bg-blue-50 text-blue-200"
                  )}>
                  {t(`${eventTrigger.toLowerCase()}`)}
                </span>
              ))}
            </span>
          </div>
        </div>
        <div className="flex">
          <Tooltip content={t("edit_webhook")}>
            <Button
              onClick={() => props.onEditWebhook()}
              color="minimal"
              size="icon"
              StartIcon={PencilAltIcon}
              className="ml-4 w-full self-center p-2"></Button>
          </Tooltip>
          <Dialog>
            <Tooltip content={t("delete_webhook")}>
              <DialogTrigger asChild>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  color="minimal"
                  size="icon"
                  StartIcon={TrashIcon}
                  className="ml-2 w-full self-center p-2"></Button>
              </DialogTrigger>
            </Tooltip>
            <ConfirmationDialogContent
              variety="danger"
              title={t("delete_webhook")}
              confirmBtnText={t("confirm_delete_webhook")}
              cancelBtnText={t("cancel")}
              onConfirm={() =>
                deleteWebhook.mutate({
                  id: props.webhook.id,
                  eventTypeId: props.webhook.eventTypeId || undefined,
                })
              }>
              {t("delete_webhook_confirmation_message")}
            </ConfirmationDialogContent>
          </Dialog>
        </div>
      </div>
    </ListItem>
  );
}
