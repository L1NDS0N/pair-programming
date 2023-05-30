import * as Toast from "@radix-ui/react-toast";
import { XCircle } from "lucide-react";
import * as React from "react";

export type XToastProps = {
  title?: string;
  description: string;
  undoAction?: () => void;
};

export const useXToast = () => {
  const [open, setOpen] = React.useState(false);
  const timerRef = React.useRef(0);
  const [props, setProps] = React.useState<XToastProps>({} as XToastProps);

  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const showXToast = (props: XToastProps) => {
    setOpen(false);
    setProps(props);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setOpen(true);
    }, 0);
  };

  const XToast = () => {
    function undoAction() {
      if (props.undoAction) {
        props.undoAction();
      }
    }
    return (
      <Toast.Provider swipeDirection="right">
        <Toast.Root
          className={
            "z-[99999] grid grid-cols-[auto_max-content] items-center gap-x-[15px] rounded-md bg-white p-[15px]" +
            " shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] " +
            "[grid-template-areas:_'title_action'_'description_action'] data-[swipe=cancel]:translate-x-0 " +
            "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=closed]:animate-hide " +
            " data-[state=open]:animate-slideIn data-[swipe=end]:animate-swipeOut data-[swipe=cancel]:transition-[transform_200ms_ease-out]"
          }
          open={open}
          onOpenChange={setOpen}
        >
          <Toast.Title className="mb-[5px] text-[15px] font-medium text-slate12 [grid-area:_title]">
            {props.title}
          </Toast.Title>
          <Toast.Description asChild>
            <div className="m-0 text-[13px] leading-[1.3] text-slate11 [grid-area:_description]">
              {props.description}
            </div>
          </Toast.Description>
          <Toast.Close
            asChild
            className="absolute right-1 top-1"
            aria-label="Close"
          >
            <span aria-hidden>
              <XCircle
                size={20}
                className="rounded-full text-red-700 transition-colors hover:bg-red-700 hover:text-zinc-50"
              />
            </span>
          </Toast.Close>
          {props.undoAction && (
            <Toast.Action
              className="[grid-area:_action]"
              asChild
              altText="Goto schedule to undo"
            >
              <button
                onClick={undoAction}
                className={
                  "inline-flex h-[25px] items-center justify-center rounded bg-green2 px-[10px]" +
                  " text-xs font-medium leading-[25px] text-green11 shadow-[inset_0_0_0_1px] " +
                  " shadow-green7 hover:shadow-[inset_0_0_0_1px] hover:shadow-green8 focus:shadow-[0_0_0_2px] focus:shadow-green8"
                }
              >
                Desfazer
              </button>
            </Toast.Action>
          )}
        </Toast.Root>
        <Toast.Viewport
          className={
            "fixed bottom-0 right-0 z-10 m-0 flex w-[390px] max-w-[100vw] " +
            "list-none flex-col gap-[10px] p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]"
          }
        />
      </Toast.Provider>
    );
  };

  return { showXToast, XToast };
};
