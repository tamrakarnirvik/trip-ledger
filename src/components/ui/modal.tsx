"use client";

import {
  useEffect,
} from "react";

import {
  AnimatePresence,
  motion,
} from "motion/react";

import {
  X,
} from "lucide-react";


type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
};


export function Modal({
  open,
  onClose,
  title,
  description,
  children,
}: ModalProps) {

  /*
   * Stop the page behind the modal
   * from scrolling.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";


    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (
        event.key === "Escape"
      ) {
        onClose();
      }
    }


    window.addEventListener(
      "keydown",
      handleKeyDown
    );


    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    open,
    onClose,
  ]);


  return (
    <AnimatePresence>

      {open && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.18,
          }}
          className="
            fixed
            inset-0
            z-[100]
            flex
            min-h-[100dvh]
            items-center
            justify-center
            overflow-hidden
            bg-black/35
            p-4
            backdrop-blur-[2px]

            sm:p-6
          "
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              onClose();
            }
          }}
        >

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.97,
              y: 12,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.97,
              y: 12,
            }}
            transition={{
              duration: 0.22,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="
              flex
              max-h-[calc(100dvh-2rem)]
              w-full
              max-w-md
              flex-col
              overflow-hidden
              rounded-[24px]
              border
              border-zinc-200
              bg-white
              shadow-2xl

              sm:max-h-[calc(100dvh-3rem)]
            "
          >

            {/* HEADER */}

            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-zinc-100 px-5 py-4">

              <div className="min-w-0">

                <h2
                  id="modal-title"
                  className="text-base font-semibold text-zinc-950"
                >
                  {title}
                </h2>


                {description && (
                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    {description}
                  </p>
                )}

              </div>


              <button
                type="button"
                onClick={
                  onClose
                }
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  text-zinc-400
                  transition
                  hover:bg-zinc-100
                  hover:text-zinc-800
                "
                aria-label="Close modal"
              >
                <X
                  size={17}
                  strokeWidth={1.8}
                />
              </button>

            </div>


            {/* CONTENT */}

            <div
              className="
                min-h-0
                flex-1
                overflow-y-auto
                px-5
                py-5

                overscroll-contain
              "
            >
              {children}
            </div>

          </motion.div>

        </motion.div>
      )}

    </AnimatePresence>
  );
}