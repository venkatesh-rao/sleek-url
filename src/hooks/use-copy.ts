import copy from "clipboard-copy";
import { useState } from "react";

const useCopy = (): [boolean, (text: string) => Promise<void>] => {
    const [isCopied, setIsCopied] = useState(false);
    const handleCopyClick = async (text: string) => {
        try {
            await copy(text);
            setIsCopied(true);
            const timeoutRef = setTimeout(() => {
                setIsCopied(false);
                clearTimeout(timeoutRef);
            }, 2000);
        } catch (error) {
            console.error('Failed to copy text to clipboard', error);
        }
    };
    return [isCopied, handleCopyClick];
}

export default useCopy;