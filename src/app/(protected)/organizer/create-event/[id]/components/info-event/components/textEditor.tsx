"use client";

/* Package System */
import React, { useEffect } from "react";
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Heading from '@tiptap/extension-heading'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style';
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'

/* Package Application */
import MenuBar from "./menu-bar";
// import '@/styles/admin/pages/CreateEvent.css'
import DescriptionWithAI, { GenerationProps } from "./descriptionWithAI";

interface TextEditorProps {
    content: string;
    onChange: (content: string) => void;
    isValidDescription: boolean;
    generationForm: GenerationProps
}

export default function TextEditor({ content, onChange, isValidDescription, generationForm }: TextEditorProps) {
    const CustomImage = Image.extend({
        addAttributes() {
            return {
                ...this.parent?.(),
                class: {
                    default: null,
                    parseHTML: element => element.getAttribute("class"),
                    renderHTML: attributes => ({
                        class: attributes.class,
                    }),
                },
                width: {
                    default: "auto",
                    parseHTML: element => element.getAttribute("width") || "auto",
                    renderHTML: attributes => ({
                        width: attributes.width !== "auto" ? attributes.width : undefined,
                    }),
                },
                height: {
                    default: "auto",
                    parseHTML: element => element.getAttribute("height") || "auto",
                    renderHTML: attributes => ({
                        height: attributes.height !== "auto" ? attributes.height : undefined,
                    }),
                },
            };
        },
    });

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    HTMLAttributes: { class: "list-disc ml-3" },
                },
                orderedList: {
                    HTMLAttributes: { class: "list-decimal ml-3" },
                },
                heading: false,
            }),
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Heading.configure({ levels: [1, 2, 3] }),
            Highlight,
            Underline,
            CustomImage,
            Image.configure({ allowBase64: true }),
            Youtube.configure({ controls: false, nocookie: true }),
            TextStyle,
            Color,
        ],
        content: "", // 👉 content rỗng ban đầu
        editorProps: {
            attributes: {
                class:
                    "w-full min-h-[156px] border rounded-md bg-slate-50 py-2 px-3",
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // ✅ Khi content props thay đổi, cập nhật lại editor
    useEffect(() => {
        if (editor && content && editor.getHTML() !== content) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    if (!editor) return null;

    return (
        <div>
            <MenuBar editor={editor} />

            <div className="relative">
                <EditorContent editor={editor} className="w-full" />
                <DescriptionWithAI onChange={onChange} isValid={isValidDescription} generationForm={generationForm} />
            </div>
        </div>
    )
}