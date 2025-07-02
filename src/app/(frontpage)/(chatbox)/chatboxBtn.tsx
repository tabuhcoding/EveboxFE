'use client';

/* Package System */
import { useState } from "react";
import Image from "next/image";

/* Package Application */
import '@/styles/admin/chatbox.css';
import ChatBoxWrapper from "./chatBoxWrapper";

const logoPath = '/images/chatbox-space1.png';

export default function ChatboxButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChatbox = () => {
    setIsOpen(!isOpen);
  }

  return (
    <>
      <button
        className="chat-box-btn flex items-center justify-center"
        onClick={handleOpenChatbox}
      >
        <Image src={logoPath} alt='logo chatbox' height={56} width={71.3} />
        <span className="chat-box-name">Eve Chatbox</span>
      </button>
      <div className={`chat-box-wrapper ${isOpen ? 'open' : ''}`}>
        {isOpen && (
          <ChatBoxWrapper handleOpen={handleOpenChatbox} />
        )}
      </div>
    </>
  )
}