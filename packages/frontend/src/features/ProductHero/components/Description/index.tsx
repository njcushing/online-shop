import ReactMarkdown from "react-markdown";
import styles from "./index.module.css";

export type TDescription = {
    text: string;
};

export function Description({ text }: TDescription) {
    return <ReactMarkdown>{text}</ReactMarkdown>;
}
