interface Props {
    readonly children: React.ReactNode;
    readonly isOpen: boolean;
    readonly onClose: () => void;
    readonly className?: string;
}

export default function ModalLayout({ children, isOpen, onClose, className }: Props) {
    if (!isOpen) return null;
    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
            <div
                id="default-modal"
                tabIndex={-1}
                aria-hidden="true"
                className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden"
            >
                <div
                    className={`relative  w-full max-w-2xl max-h-full bg-white rounded-lg shadow ${className || ''} p-6`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        type="button"
                        className="absolute top-0 right-2 text-gray-600 hover:text-gray-900 text-4xl "
                        onClick={onClose}
                    >
                        &times;
                    </button>
                    {children}
                </div>
            </div>
        </>
    )
}