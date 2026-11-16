import { useEffect, useRef, type ReactNode } from 'react'

interface ModalProps {
  id?: string
  title: string
  titleId: string
  open: boolean
  /** Called for every user-initiated close: Esc, the × button, the backdrop or Cancel. */
  onClose: () => void
  children: ReactNode
}

/**
 * Native <dialog> opened with showModal(): the browser provides the focus
 * trap, Esc handling, the backdrop and an inert background.
 */
export function Modal({ id, title, titleId, open, onClose, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const pointerDownOnBackdropRef = useRef(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      dialog.showModal()
      // Start on the first field rather than on the × button.
      dialog.querySelector<HTMLElement>('input, textarea, select')?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  return (
    <dialog
      id={id}
      ref={dialogRef}
      aria-labelledby={titleId}
      // Esc fires "cancel": let React state drive the close instead.
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      // "close" fires after the dialog is closed and no longer inert, so focus
      // can be restored here. It also syncs state when the browser closes the
      // dialog on its own (e.g. a repeated Esc that skips a cancelable "cancel").
      onClose={() => {
        returnFocusRef.current?.focus()
        if (open) onClose()
      }}
      // Clicks on the backdrop target the <dialog> itself (content fills it).
      // Requiring pointerdown there too avoids closing when a text selection
      // started inside the form ends over the backdrop.
      onPointerDown={(event) => {
        pointerDownOnBackdropRef.current = event.target === event.currentTarget
      }}
      onClick={(event) => {
        if (pointerDownOnBackdropRef.current && event.target === event.currentTarget) onClose()
        pointerDownOnBackdropRef.current = false
      }}
      className="m-auto w-[min(100%-2rem,36rem)] rounded-lg border border-line bg-white p-0 text-fg shadow-xl backdrop:bg-black/40"
    >
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <h2 id={titleId} className="text-lg font-semibold">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="inline-flex size-11 cursor-pointer items-center justify-center rounded-md text-2xl leading-none text-muted hover:bg-surface focus-visible:outline-2 focus-visible:outline-accent md:size-8"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <div className="p-4">{children}</div>
    </dialog>
  )
}
