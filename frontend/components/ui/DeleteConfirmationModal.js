import Image from "next/image";

const DeleteConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/0 lg:pt-28 mb:pt-24 xsm:pt-24 sm:pt-24 mb:px-20 lg:px-20 sm:px-8 xsm:px-8 pb-8 mx-auto z-50">
            <div className="bg-background rounded-xs shadow-lg p-6 w-2/6">
                <div className="flex justify-center items-center mb-4">
                    <Image
                        src="/Delete.png"
                        width={70}
                        height={50}
                        alt="Delete Icon"
                    />
                </div>

                <p className="text-center text-gray-700 mb-6">
                    Are you sure you want to delete this notification?
                </p>

                <div className="flex justify-center space-x-6">
                    <button
                        className="button1 flex items-center justify-center"
                        onClick={onConfirm}
                    >
                        <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">
                            Yes
                        </p>
                    </button>

                    <button
                        className="button2 flex items-center justify-center"
                        onClick={onCancel}
                    >
                        <p className="lg:text-medium mb:text-medium sm:text-xsmall xsm:text-xsmall font-medium text-center">
                            No
                        </p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
