"use client";

/* Package System */
import React, { useState } from "react";
import { AlignCenter, AlignLeft, AlignRight, Bold, FileImage, Smile, Heading1, Heading2, Heading3, Highlighter, Italic, List, ListOrdered, Palette, Redo, SquarePlay, Strikethrough, Underline, Undo, Code } from "lucide-react"
import 'tailwindcss/tailwind.css';
import { Root as Toggle } from "@radix-ui/react-toggle";
import { Editor } from "@tiptap/react";

/* Package Application */
import SourceCodeModal from "./sourceCodeModal";

export default function MenuBar({ editor }: { editor: Editor | null }) {
    const [height] = useState(360);
    const [width] = useState(480);

    const [color, setColor] = useState("#000000");

    const [isModalOpen, setIsModalOpen] = useState(false); // Modal control state
    const [sourceCode, setSourceCode] = useState(""); // State to store HTML source code

    if (!editor) {
        return null
    }

    const changeTextColor = (newColor: string) => {
        setColor(newColor);
        if (editor) {
            editor.chain().focus().setColor(newColor).run();
        }
    };

    const Options = [
        {
            icon: <Undo className="size-4" />,
            onclick: () => editor.chain().focus().undo().run(),
            pressed: false,
            disabled: !editor.can().undo(),
            tooltip: "Undo (Ctrl+Z)",
        },
        {
            icon: <Redo className="size-4" />,
            onclick: () => editor.chain().focus().redo().run(),
            pressed: false,
            disabled: !editor.can().redo(),
            tooltip: "Redo (Ctrl+Y)",
        },
        {
            icon: <Heading1 className="size-4" />,
            onclick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            pressed: editor.isActive("heading", { level: 1 }),
            tooltip: "Heading 1",
        },
        {
            icon: <Heading2 className="size-4" />,
            onclick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            pressed: editor.isActive("heading", { level: 2 }),
            tooltip: "Heading 2",
        },
        {
            icon: <Heading3 className="size-4" />,
            onclick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
            pressed: editor.isActive("heading", { level: 3 }),
            tooltip: "Heading 3",
        },
        {
            icon: <Bold className="size-3.5" />,
            onclick: () => editor.chain().focus().toggleBold().run(),
            pressed: editor.isActive("bold"),
            tooltip: "Bold (Ctrl+B)",
        },
        {
            icon: <Italic className="size-3.5" />,
            onclick: () => editor.chain().focus().toggleItalic().run(),
            pressed: editor.isActive("italic"),
            tooltip: "Italic (Ctrl+I)",
        },
        {
            icon: <Underline className="size-3.5" />,
            onclick: () => editor.chain().focus().toggleUnderline().run(),
            pressed: editor.isActive("underline"),
            tooltip: "Underline (Ctrl+U)",
        },
        {
            icon: <Strikethrough className="size-4" />,
            onclick: () => editor.chain().focus().toggleStrike().run(),
            pressed: editor.isActive("strike"),
            tooltip: "Strikethrough (Ctrl+Shift+X)",
        },
        {
            icon: (
                <div className="relative group">
                    {/* Icon + Hiển thị màu hiện tại */}
                    <div className="flex items-center gap-2 p-1 rounded-lg border border-gray-300 shadow-sm bg-white cursor-pointer hover:bg-gray-100">
                        <Palette className="size-4 text-gray-700" />
                        <div
                            className="w-4 h-4 rounded-full border border-gray-400"
                            style={{ backgroundColor: color }}
                        />
                    </div>

                    <input
                        type="color"
                        value={color}
                        onChange={(e) => changeTextColor(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </div>
            ),
            onclick: () => { },
            pressed: editor.isActive("textStyle"),
            tooltip: "Text color",
        },
        {
            icon: <Smile className="size-4" />,
            onclick: () => {
                const emoji = '😊';
                editor.chain().focus().insertContent(emoji).run();
            },
            pressed: false,
            tooltip: "Insert emoji",
        },
        {
            icon: <AlignLeft className="size-4" />,
            onclick: () => {
                if (editor.isActive("image")) {
                    editor.chain().focus().updateAttributes("image", { class: "float-left mr-2" }).run();
                } else if (editor.isActive("video")) {
                    editor.chain().focus().updateAttributes("video", { class: "float-left mr-2" }).run();
                }
                else {
                    editor.chain().focus().setTextAlign("left").run();
                }

                // Xử lý video (iframe)
                const selectedVideo = document.querySelector("iframe");
                if (selectedVideo) {
                    selectedVideo.style.float = "left";
                    selectedVideo.style.marginRight = "8px";
                }
            },
            pressed: editor.isActive("left") || editor.isActive("image", { class: "float-left mr-2" }) || editor.isActive("video", { class: "float-left mr-2" }),
            tooltip: "Align left",
        },
        {
            icon: <AlignCenter className="size-4" />,
            onclick: () => {
                if (editor.isActive("image")) {
                    editor.chain().focus().updateAttributes("image", { class: "block mx-auto" }).run();
                } else if (editor.isActive("video")) {
                    editor.chain().focus().updateAttributes("video", { class: "block mx-auto" }).run();
                } else {
                    editor.chain().focus().setTextAlign("center").run()
                }

                // Xử lý video (iframe)
                const selectedVideo = document.querySelector("iframe");
                if (selectedVideo) {
                    selectedVideo.style.display = "block";
                    selectedVideo.style.margin = "0 auto";
                    selectedVideo.style.float = "none";
                }
            },
            pressed: editor.isActive("center") || editor.isActive("image", { class: "block mx-auto" }) || editor.isActive("video", { class: "block mx-auto" }),
            tooltip: "Align center",
        },
        {
            icon: <AlignRight className="size-4" />,
            onclick: () => {
                if (editor.isActive("image")) {
                    editor.chain().focus().updateAttributes("image", { class: "float-right ml-2" }).run()
                } else if (editor.isActive("video")) {
                    editor.chain().focus().updateAttributes("video", { class: "float-right ml-2" }).run()
                }
                else {
                    editor.chain().focus().setTextAlign("right").run()
                }

                // Xử lý video (iframe)
                const selectedVideo = document.querySelector("iframe");
                if (selectedVideo) {
                    selectedVideo.style.float = "right";
                    selectedVideo.style.marginLeft = "8px";
                }
            },
            pressed: editor.isActive("right") || editor.isActive("image", { class: "float-right ml-2" }) || editor.isActive("video", { class: "float-right ml-2" }),
            tooltip: "Align right",
        },
        {
            icon: <List className="size-4" />,
            onclick: () => editor.chain().focus().toggleBulletList().run(),
            pressed: editor.isActive("bulletList"),
            tooltip: "Bullet list",
        },
        {
            icon: <ListOrdered className="size-4" />,
            onclick: () => editor.chain().focus().toggleOrderedList().run(),
            pressed: editor.isActive("orderList"),
            tooltip: "Order list",
        },
        {
            icon: <Highlighter className="size-4" />,
            onclick: () => editor.chain().focus().toggleHighlight().run(),
            pressed: editor.isActive("highlight"),
            tooltip: "High light",
        },
        {
            icon: <FileImage className="size-4" />,
            onclick: () => {
                const url = window.prompt("URL");

                if (!url) {
                    return;
                }
                else {
                    editor.chain().focus().setImage({ src: url }).run();
                    const size = window.prompt("Enter image size (e.g., 200px, auto):") || "auto";
                    editor.chain().focus().updateAttributes("image", { width: size, height: "auto" }).run();
                }
            },
            pressed: false,
            tooltip: "Insert/Edit image",
        },
        {
            icon: <SquarePlay className="size-4" />,
            onclick: () => {
                const url = prompt("Enter YouTube URL");

                if (url) {
                    editor.commands.setYoutubeVideo({
                        src: url,
                        width: Math.max(320, width),
                        height: Math.max(180, height),
                    });
                }
            },
            pressed: false,
            tooltip: "Insert/Edit media",
        },
        {
            icon: <Code className="size-4" />,
            onclick: () => {
                const htmlContent = editor.getHTML(); // Lấy source code HTML từ editor
                setSourceCode(htmlContent); // Cập nhật source code vào state
                setIsModalOpen(true); // Mở modal để hiển thị source code
            },
            tooltip: "Source code",
        },
    ]

    const handleSaveSourceCode = () => {
        if (editor) {
            editor.commands.setContent(sourceCode);    // Cập nhật lại nội dung của editor từ source code sau khi chỉnh sửa
            setIsModalOpen(false); // Đóng modal
        }
    };

    return (
        <div className="border border-gray-400 rounded-md p-1 mb-1 bg-slate-50 space-x-2 z-50">
            {Options.map((option, index) => (
                <Toggle
                    key={index}
                    className={`p-2 rounded data-[state=on]:bg-gray-300 ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    pressed={option.pressed}
                    onPressedChange={() => !option.disabled && option.onclick()}
                    disabled={option.disabled}
                    title={option.tooltip}
                >
                    {option.icon}
                </Toggle>

            ))}

            <SourceCodeModal 
                isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} sourceCode={sourceCode}
                setSourceCode={setSourceCode} handleSaveSourceCode={handleSaveSourceCode}
            />
        </div>
    )
}