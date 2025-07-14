export interface StandardPayload<T = any> {
    data: T;
    method?: string;
    timestamp?: number;
    meta?: Record<string, any>;
}

export interface PendingRequest {
    resolve: (payload: any) => void;
}

export interface RuntimeMessage {
    __mailbox__?: boolean;
    type: string;
    payload: StandardPayload;
    source: SourceType;
    dest: SourceType;
    requestId?: string;
}

export interface RuntimeResponse {
    __mailbox__?: boolean;
    source?: SourceType;
    dest?: SourceType;
    requestId?: string;
    type?: string;
    payload?: StandardPayload;
    ok: boolean;
    error?: string;
}

export interface MessageEventData extends MessageEvent {
    data: {
        __mailbox__: boolean;
        source: SourceType;
        type: string;
        payload: StandardPayload;
        dest: SourceType;
        requestId?: string;
    };
}


// Standardized payload structure
export interface StandardPayload<T = any> {
  data: T;
  method?: string;
  timestamp?: number;
  meta?: Record<string, any>;
}

export interface MailboxMessage {
  __mailbox__: true;
  type: string;
  payload: StandardPayload;
  source: string;
  dest: string;
  requestId?: string;
  [key: string]: any;
}

export interface MessageEventData extends MessageEvent {
  data: MailboxMessage;
}

export type SourceType = "DOM" | "CONTENT SCRIPT" | "BACKGROUND" | "EXTENSION";