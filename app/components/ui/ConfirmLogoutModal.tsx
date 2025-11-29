import React from 'react';

type Props = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void> | void;
    title?: string;
    message?: string;
    cancelLabel?: string;
    confirmLabel?: string;
};

export default function ConfirmLogoutModal({ open, onClose, onConfirm, title, message, cancelLabel, confirmLabel }: Props) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            <div className="relative z-10 w-full max-w-sm mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden">
                <div className="p-6">
                    <div className="flex items-start justify-between">
                        <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title ?? 'Xác nhận đăng xuất'}</h3>
                              <p className="text-sm text-gray-500 mt-1">{message ?? 'Bạn có chắc muốn đăng xuất khỏi tài khoản không?'}</p>
                        </div>
                        <button onClick={onClose} aria-label="Close" className="rounded-full p-2 hover:bg-gray-100">✕</button>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-md">{cancelLabel ?? 'Hủy'}</button>
                        <button
                            onClick={async () => {
                                try {
                                    await onConfirm();
                                } catch (e) {
                                    console.error(e);
                                }
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-md"
                        >
                            {confirmLabel ?? 'Đăng xuất'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
