import { getCurrentTab } from "./utils/utils.ts";
import { SourceType, MessageEventData, MailboxMessage } from "./utils/types.ts"


export class Message {
  protected source: string;
  protected listeners: Map<string, (payload: any, event: MessageEventData) => void>;

  constructor(source: SourceType) {
    this.source = source;
    this.listeners = new Map();
    globalThis.addEventListener("message", this._internalHandler);
  }

  log(...args: any[]): void {
    console.log(`[${this.source}]`, ...args);
  }

  listen = (type: string, handler: (payload: any, event: MessageEventData) => void): void => {
    this.listeners.set(type, handler);
  };

  unlisten = (type: string): void => {
    this.listeners.delete(type);
  };

  send = (
    type: string, 
    payload: any = {}, 
    dest: SourceType, 
    targetOrigin: string = "*", 
    meta: Record<string, any> = {}
  ): void => {
    const message: MailboxMessage = {
      __mailbox__: true,
      type,
      payload,
      source: this.source,
      dest,
      ...meta,
    };

    if (
      this.source === "DOM" ||
      (this.source === "CONTENT SCRIPT" && dest !== "BACKGROUND")
    ) {
      globalThis.postMessage(message, targetOrigin);
    } else if (dest === "CONTENT SCRIPT" && this.source !== "DOM") {
      getCurrentTab().then((id) => 
        chrome.tabs.sendMessage(id, message, () => this.log(`${type} send`))
      );
    } else {
      chrome.runtime.sendMessage(message);
    }
  };

  private _internalHandler = (event: MessageEvent): void => {
    if (
      !event.data ||
      event.data.__mailbox__ !== true ||
      event.data.source === this.source ||
      event.data.dest !== this.source
    ) {
      return;
    }
    this.log("Message accepted");
    const handler = this.listeners.get(event.data.type);
    if (typeof handler === "function") {
      handler(event.data.payload, event as MessageEventData);
    }
  };
}