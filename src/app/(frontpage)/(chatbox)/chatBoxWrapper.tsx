'use client';

/* Package System */
import { useState, useEffect, useRef, KeyboardEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Icon } from "@iconify/react";
import Image from "next/image";
import PerfectScrollbar from "react-perfect-scrollbar";
import toast from "react-hot-toast";
import DOMPurify from 'dompurify';

/* Package Application */
import '@/styles/admin/components/perfectScrollBar.css';
import { fetchContent, sendMessageToBotNavigation } from "@/services/rag.service";
import { NAVIGATE_ROUTES } from "./libs/endpoints";
import { useSearchResults } from "@/app/providers/searchResultProvider";
import { ChatBoxWrapperProps, ChatBoxContent } from "@/types/models/dashboard/chatbox.interface";

const chatBoxLogo = '/images/chatbox-space1.png';

export default function ChatBoxWrapper({ handleOpen }: ChatBoxWrapperProps) {
  const t = useTranslations('common');
  const router = useRouter();
  const scrollRef = useRef<PerfectScrollbar | null>(null);

  const [chatBoxContents, setChatBoxContents] = useState<ChatBoxContent[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatBoxContent[]>([]);
  const [chatContent, setChatContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isErrorFetch, setIsErrorFetch] = useState<boolean>(false);

  const { setEventIds } = useSearchResults();

  useEffect(() => {
    const loadInitialContent = async () => {
      setIsLoading(true);
      const content = await fetchContent(setIsErrorFetch);
      if (content?.result) {
        setChatBoxContents([content.result]);
        setChatHistory([content.result]);
      }
      setIsLoading(false);
    };
    loadInitialContent();
  }, []);

  const handleSelectStep = (step: ChatBoxContent) => {
    setChatHistory(prev => [...prev, step]);
    setChatBoxContents([step]);
  };

  const handleGoBack = () => {
    setChatHistory(prev => {
      if (prev.length <= 1) return prev;
      const newHistory = prev.slice(0, -1);
      const lastRoot = newHistory[newHistory.length - 1];
      setChatBoxContents([lastRoot]);
      return newHistory;
    });
  };

  const handleInputChange = (e: FormEvent<HTMLTextAreaElement>) => {
    setChatContent((e.target as HTMLTextAreaElement).value);
  };

  const handleSendChat = async () => {
    const textarea = document.getElementById('chatTextArea') as HTMLTextAreaElement;
    const content = textarea?.value;

    if (content && content.trim()) {
      textarea.value = '';
      textarea.style.height = '64px';

      const newMsg: ChatBoxContent = {
        id: Date.now(),
        context: content,
        message: content,
        rootId: null,
        isBot: false,
        Child: []
      };
      setChatBoxContents(prev => [...prev, newMsg]);
      setChatContent('');

      await handleSendToBot(content);
    }
  };

  const handleSendToBot = async (query: string) => {
    if (!query || isLoading) return;

    setIsLoading(true);

    try {
      const lastBotMessage = [...chatHistory].reverse().find(msg => msg.isBot);
      const previousID = lastBotMessage?.PreviousResponseId || undefined;

      const response = await sendMessageToBotNavigation({
        query,
        privateKey: process.env.NEXT_PUBLIC_OPENAI_USAGE_PRIVATE_KEY || '', // Thêm privateKey từ env
        previousID
      });

      if (response.data) {
        const botResponse = response.data;
        const botMessage: ChatBoxContent = {
          id: Date.now(),
          context: botResponse.Message,
          message: botResponse.Message,
          rootId: null,
          isBot: true,
          Child: [],
          PreviousResponseId: botResponse.PreviousResponseId
        };

        // Xử lý route và kết quả tìm kiếm
        if (botResponse.Route === 'SEARCH_PAGE' && botResponse.EventIds) {
          setEventIds(botResponse.EventIds);
          botMessage.Child = [{
            id: Date.now() + 1,
            context: transWithFallback('goToSearchResultPage', 'Đi tới trang kết quả tìm kiếm'),
            message: null,
            rootId: botMessage.id,
            isBot: true,
            Child: [],
            route: 'SEARCH_PAGE',
          }];
        } else if (botResponse.Route && botResponse.Route !== 'NONE') {
          botMessage.Child = [{
            id: Date.now() + 1,
            context: `${transWithFallback('goToPage', 'Đi tới trang')} ${botResponse.Route}`,
            message: null,
            rootId: botMessage.id,
            isBot: true,
            Child: [],
            route: botResponse.Route,
          }];
        }

        setChatBoxContents(prev => [...prev, botMessage]);
        setChatHistory(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error sending query to bot:', error);
      toast.error(`${transWithFallback('errorSendToBot', 'Lỗi khi gửi tin nhắn tới chatbot')}: ${error}`)
    } finally {
      setIsLoading(false);
    }
  };

  const handleChildClick = (child: ChatBoxContent) => {
    if (child.route) {
      router.push(NAVIGATE_ROUTES[child.route as keyof typeof NAVIGATE_ROUTES] || '/');
    } else {
      setChatHistory(prev => [...prev, child]);
      setChatBoxContents([child]);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendChat();
    }
  };

  const transWithFallback = (key: string, fallback: string) => {
    const msg = t(key);
    return !msg || msg.startsWith('common.') ? fallback : msg;
  };

  // const getRouteDisplayText = (route: string) => {
  //   const routeTextMap: Record<string, string> = {
  //     'HOME_PAGE': transWithFallback('goToHomePage', 'Go to homepage'),
  //     'PROFILE_PAGE': transWithFallback('goToProfilePage', 'Đi tới trang cá nhân'),
  //     'SEARCH_PAGE': transWithFallback('goToSearchPage', 'Đi tới trang tìm kiếm'),
  //     'MY_TICKETS_PAGE': transWithFallback('goToMyTicketPage', 'Đi tới trang vé của tôi'),
  //     'CREATE_EVENT_PAGE': transWithFallback('goToCreateEventPage', 'Đi tới trang tạo sự kiện')
  //   };

  //   return routeTextMap[route] || `${transWithFallback('goToPage', 'Đi tới trang')} ${route}`;
  // }

  const renderMessageWithLinks = (text: string) => {
    const routeRegex = /<([A-Z_]+)>/g;

    const replacedText = text.replace(routeRegex, (match, routeName) => {
      // Kiểm tra xem route có tồn tại trong NAVIGATE_ROUTES không
      const routePath = NAVIGATE_ROUTES[routeName as keyof typeof NAVIGATE_ROUTES];
      if (routePath) {
        return `<a href="${routePath}" 
               class="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
               onclick="event.preventDefault(); window.location.href='${routePath}'">
               ${routeName.replace(/_/g, ' ')}
             </a>`;
      }
      return match;
    });

    return DOMPurify.sanitize(replacedText);
  };

  return (
    <>
      <div className="chat-box flex w-[397px] h-[70vh] max-h-[72vh] fixed bottom-16 right-10 bg-white flex-col rounded-2xl shadow-md z-[999]">
        <div className="chat-box__header flex p-2 rounded-tl-2xl rounded-tr-2xl bg-[#0C4762] border-b border-[#ddd]">
          <div className="chat-box__header-img mt-4 mr-1 mb-3 ml-3">
            <Image className="rounded-[50%] mr-3" src={chatBoxLogo} width={36} height={28.39} alt="chat-box-logo" />
          </div>
          <div className="chat-box__header-info mt-3">
            <h2 className="chat-box-name text-xl font-semibold leading-[27.28px] text-left text-[#F4EEEE]">{transWithFallback('eveBoxAssistant', 'Trợ lý EveBox')}</h2>
            <div className="chat-box-status">
              <div className={`action items-center flex flex-row ${!isLoading ? 'text-[#9EF5CF]' : (isErrorFetch ? 'text-danger-500' : 'text-[#F4EEEE]')}`}>
                {!isLoading ?
                  <>
                    <Icon className="mr-1" icon="material-symbols:circle" width="10px" height="10px" />
                    Online
                  </>
                  :
                  ((isErrorFetch) ?
                    <>
                      <Icon className="" icon="material-symbols:circle" width="10px" height="10px" />
                      {isErrorFetch ? transWithFallback('failedToFetchContent', 'Lấy dữ liệu thất bại') : transWithFallback('errorHappened', 'Có lỗi xảy ra')}
                    </>
                    :
                    <div className="flex flex-row">
                      <div className="dot-pulse">
                        <span></span>
                      </div>
                      <span className='ml-3'>{transWithFallback('typing', 'Đang nhập')}</span>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
          <button
            className="close-btn flex text-[#F4EEEE] items-center justify-center text-center border-none p-0 cursor-pointer ml-auto w-8 h-8 min-w-0 
                    hover:bg-[#F4EEEE] hover:text-[#0C4762] hover:rounded
                    active:bg-[#F4EEEE] active:text-[#0C4762] active:scale-95 active:rounded transition-all ease-in-out"
            onClick={handleOpen}
          >
            <Icon icon="mdi:close" width="24px" height="24px" />
          </button>
        </div>
        <div className="chat-box__body flex flex-col flex-1 overflow-auto">
          {chatHistory.length > 1 && (
            <div className="flex justify-start px-4 py-2">
              <button className="text-sm text-blue-600 hover:underline" onClick={handleGoBack}>
                ← {transWithFallback('back', 'Quay lại')}
              </button>
            </div>
          )}

          <PerfectScrollbar
            className="perfect-scroll-bar-chat-box h-full relative whitespace-nowrap overflow-hidden max-h-[calc(70vh-150px)]"
            ref={scrollRef}
          >
            {chatBoxContents.map((message) => (
              <div key={message.id} className={`chat-box__body-item ${message.isBot ? 'justify-start bot' : 'justify-end user'} flex flex-col px-4 py-2`}>
                <div className={`general-content ${message.isBot ? 'justify-start bot' : 'justify-end user'} flex flex-row items-start`}>
                  {message.isBot && (
                    <div className="chat-box__body-item-img">
                      <Image src={chatBoxLogo} width={36} height={28.39} alt="chat-bot-avatar" className="rounded-full mr-6" />
                    </div>
                  )}
                  <div
                    // className={`chat-box__body-item-content max-w-[88%] leading-[17.73px] gap-3 rounded-xl px-3 py-2 text-sm
                    //             ${message.isBot ? 'bg-[#f1f1f1] text-[#505050] bot'
                    //   : 'flex items-center min-h-14 bg-[#0C4762] text-[#F4EEEE] user'}`}
                    className={`chat-box__body-item-content max-w-[88%] leading-[17.73px] gap-3 rounded-xl px-3 py-2 text-sm
                        ${message.isBot ? 'bg-[#f1f1f1] text-[#505050] bot'
                        : 'flex items-center min-h-14 bg-[#0C4762] text-[#F4EEEE] user'}`}
                  >
                    {message.isBot && (
                      <p className="font-semibold mb-1">{transWithFallback('eveBoxAssistant', 'Trợ lý EveBox')}</p>
                    )}
                    {/* {message.message && <p>{message.message}</p>} */}
                    {message.message && (
                      <div className="message-content"
                        dangerouslySetInnerHTML={{ __html: renderMessageWithLinks(message.message) }} />
                    )}
                  </div>
                </div>
                {message.Child.length > 0 && (
                  <div className="chat-box__default-options w-[85%] flex flex-col mt-3 ml-14 gap-2">
                    {message.Child.map((child) => (
                      <div
                        key={child.id}
                        onClick={() => {
                          if (child.route) {
                            handleChildClick(child);
                          } else handleSelectStep(child);
                        }}
                        // className="chat-box__default-options-input relative cursor-pointer flex-grow-[0.1] flex items-center text-left text-sm px-4 py-2 border border-gray-300 rounded-full hover:bg-[#0C4762] hover:text-[#F4EEEE] transition"
                        className="chat-box__default-options-input relative cursor-pointer flex-grow-[0.1] flex items-center text-left text-sm px-4 py-2 border border-gray-300 rounded-full 
                        hover:bg-[#0C4762] hover:text-[#F4EEEE] 
                        active:bg-[#0C4762]/90 active:scale-95 
                        transition-all duration-200 ease-in-out"
                      >
                        <span className="default-content box-border focus:border-none focus:outline-none">{child.context}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectStep(child);
                          }}
                          className="chat-box__default-options-btn ml-auto flex items-center justify-center hover:text-[#0C4762] hover:bg-[#F4EEEE] rounded-full p-1 transition-colors">
                          <Icon icon="lucide:send" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </PerfectScrollbar>
        </div>
        <div className="chat-box__footer flex w-full h-20 border-t-1 border-[#ddd] gap-3 bg-white py-0 px-4 rounded-bl-2xl rounded-br-2xl">
          <div className="chat-box__footer-input flex items-center justify-between flex-grow relative w-full h-fit min-h-16 max-h-[4rem] bg-white shadow-md border-none rounded-3xl mt-1 py-1 px-2">
            <textarea
              id="chatTextArea"
              className="textarea-auto-resize w-[88.5%] max-h-[4rem] min-h-16 p-[15px_10px_10px_10px] text-[13px] text-[#667085] bg-transparent border-none resize-none overflow-y-auto box-border outline-none font-sans font-medium"
              placeholder={transWithFallback('enterYourMessage', 'Nhập tin nhắn của bạn')}
              rows={1}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = target.scrollHeight + "px";
                handleInputChange(e);
              }}
              onKeyDown={handleKeyDown}
            />
            <button
              className={`w-8 h-8 min-w-0 mr-[9px] rounded-full flex items-center justify-center p-0 transition-colors ${chatContent && chatContent !== '' && !isLoading
                ? 'bg-[#9EF5CF] text-[#0C4762] hover:bg-[#0C4762] hover:text-[#9EF5CF]'
                : 'bg-transparent text-[#98A2B3]'
                }`}
              onClick={handleSendChat}
              disabled={!chatContent || isLoading}
            >
              <Icon icon="lucide:send" className="w-[19.52px] h-[19.21px] mt-[3px] mr-[2px]" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}