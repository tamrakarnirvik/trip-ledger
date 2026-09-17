"use client";

import {
  AnimatePresence,
  motion,
} from "motion/react";

import {
  X,
} from "lucide-react";

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
};

export function Modal({
  open,
  title,
  description,
  onClose,
  children,
}: ModalProps) {
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
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-3 backdrop-blur-[2px] sm:items-center sm:p-6"
          onMouseDown={
            onClose
          }
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 24,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 16,
              scale: 0.98,
            }}
            transition={{
              duration: 0.24,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-5 shadow-2xl shadow-black/10 sm:p-6"
            onMouseDown={(
              event
            ) =>
              event.stopPropagation()
            }
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-zinc-950">
                  {title}
                </h2>

                {description && (
                  <p className="mt-1 text-sm leading-5 text-zinc-500">
                    {
                      description
                    }
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={
                  onClose
                }
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
                aria-label="Close"
              >
                <X
                  size={17}
                />
              </button>
            </div>

            <div className="mt-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}