# 12 — AI Providers

> **Module:** AI & RAG
> **Status:** Frozen
> **Version:** 1.0
> **Architecture Review:** Approved
> **Applies To:** Notebook Application

---

## 1. Purpose

The AI Providers document establishes the conceptual approach for integrating with diverse inference engines without locking the Notebook architecture into a single ecosystem.

---

## 2. Conceptual Identities

- **Provider:** An abstract interface or endpoint representing an entity capable of executing AI models.
- **Capability:** A conceptual feature advertised by a Provider (e.g., streaming support). Providers advertise conceptual capabilities. Notebook depends on provider abstractions rather than provider implementations.
- **Inference Request:** The abstract payload sent to the Provider.
- **Inference Result:** The abstract response received from the Provider.

### 2.1 Provider Abstraction

- An adapter layer implements the `IModelProvider` contract, translating the internal standard Inference Request into the specific REST, WebSocket, or RPC format required by the backend.

### 2.1 Examples
- **Local Models:** Integrating with local execution engines like Ollama, Llama.cpp, or ONNX Runtime. This is the preferred, privacy-first default.
- **Remote Models:** Integrating with cloud commercial APIs (e.g., OpenAI, Anthropic) for users who explicitly opt-in and provide their own API keys.
- **Future Providers:** The system can accommodate custom corporate endpoints or novel local inference accelerators simply by registering a new Provider.

---

## 3. Capability Negotiation

Not all models or providers support the same features. Providers must explicitly advertise their capabilities to the core system:
- `SupportsStreaming`: Can return tokens incrementally.
- `ContextWindowSize`: Maximum tokens supported.
- `SupportsFunctionCalling`: Can output structured JSON for tool use.

The Prompt Construction phase queries these capabilities to determine how to format the Context Package (e.g., omitting system instructions if a very basic model does not support a distinct system role).

---

## 4. Provider Independence

- **Notebook Core never depends on one provider.**
- If a remote provider undergoes an outage, or a user is offline, the application seamlessly switches to a local provider (if configured) because the core architecture only relies on the abstract `IModelProvider` interface.

---

## 5. Business Rules

- **The user must explicitly opt-in to use Remote Models, acknowledging the departure from the local-first, privacy-first default.**
- **No provider-specific logic may leak into the Context Assembly or Prompt Construction phases.**

---

## 6. Acceptance Criteria

- Adding support for a newly released commercial AI API requires zero modifications to the core RAG pipeline or Conversation Memory logic.

---

## 7. Cross References

- [06-ModelAbstraction.md](./06-ModelAbstraction.md)
- [01-AIArchitecture.md](./01-AIArchitecture.md)
