import { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import "./styles.css";

interface ChatMessage {
  id: number;
  author: "user" | "bot";
  text: string;
}

const BOT_REPLIES = [
  "Entendi! Nossa equipe pode ajudar com pedidos, entregas e pagamentos.",
  "Obrigado pela mensagem. Em produção, isso abriria um ticket de suporte.",
  "Você também pode acompanhar pedidos em Minha conta → Pedidos.",
  "Para trocas ou reembolsos, use o botão na página de detalhes do pedido.",
  "Horário de atendimento simulado: seg a sex, 9h às 18h.",
];

const INITIAL_MESSAGE: ChatMessage = {
  id: 1,
  author: "bot",
  text: "Olá! Sou o assistente da NEXUS Store. Como posso ajudar hoje?",
};

export function SupportChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const nextIdRef = useRef(2);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) {
      return;
    }

    const userMessage: ChatMessage = {
      id: nextIdRef.current++,
      author: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    window.setTimeout(() => {
      const reply =
        BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)];

      setMessages((prev) => [
        ...prev,
        {
          id: nextIdRef.current++,
          author: "bot",
          text: reply,
        },
      ]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="support-chat-widget">
      {isOpen && (
        <section
          className="support-chat-panel"
          aria-label="Chat de suporte"
        >
          <header className="support-chat-panel__header">
            <div>
              <strong>Suporte NEXUS</strong>
              <span>Atendimento simulado</span>
            </div>
            <Button
              type="button"
              icon="pi pi-times"
              rounded
              text
              aria-label="Fechar chat"
              onClick={() => setIsOpen(false)}
            />
          </header>

          <div className="support-chat-panel__messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`support-chat-message support-chat-message--${message.author}`}
              >
                {message.text}
              </div>
            ))}
            {isTyping && (
              <div className="support-chat-message support-chat-message--bot support-chat-message--typing">
                Digitando...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            className="support-chat-panel__composer"
            onSubmit={(event) => {
              event.preventDefault();
              handleSend();
            }}
          >
            <InputText
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Digite sua mensagem..."
              className="support-chat-panel__input"
            />
            <Button
              type="submit"
              icon="pi pi-send"
              aria-label="Enviar mensagem"
              disabled={!input.trim() || isTyping}
            />
          </form>
        </section>
      )}

      <Button
        type="button"
        icon={isOpen ? "pi pi-times" : "pi pi-headphones"}
        className="support-chat-widget__toggle surface-icon-button"
        rounded
        text
        aria-label={isOpen ? "Fechar suporte" : "Abrir suporte"}
        tooltip={isOpen ? "Fechar suporte" : "Suporte"}
        tooltipOptions={{ position: "top" }}
        onClick={() => setIsOpen((open) => !open)}
      />
    </div>
  );
}
