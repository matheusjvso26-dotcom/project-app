// Este arquivo serve como um Atalho (Forwarder) para a Rota Verdadeira.
// Isso evita que o Client (Meta) receba 404 caso a URL não seja alterada no painel.
export { GET, POST } from '../../whatsapp/webhook/route'
