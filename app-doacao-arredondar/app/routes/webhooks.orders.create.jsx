import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  // Autentica o webhook e obtém dados
  const { shop, topic, payload } = await authenticate.webhook(request);

  console.log(`Webhook recebido: ${topic} da loja ${shop}`);

  // Em orders/create, o payload é o objeto do pedido
  // Os atributos do checkout vêm em note_attributes
  const noteAttributes = payload.note_attributes || [];

  const attrDoacao = noteAttributes.find(
    (attr) => attr.name === "doacao_arredondar"
  );

  if (attrDoacao && attrDoacao.value) {
    try {
      const dadosDoacao = JSON.parse(attrDoacao.value);
      console.log("✅ Doação capturada no pedido:");
      console.log("   Tipo:", dadosDoacao.tipo);
      console.log("   Valor:", dadosDoacao.valor);
      console.log("   ID do pedido:", payload.id);
      console.log("   Número:", payload.name);

      // 🔜 Aqui depois vamos chamar a API da Asaas, ex:
      // await enviarDoacaoParaAsaas({
      //   shop,
      //   orderId: payload.id,
      //   orderNumber: payload.name,
      //   tipo: dadosDoacao.tipo,
      //   valor: dadosDoacao.valor,
      //   totalPedido: payload.total_price,
      // });

    } catch (error) {
      console.error("Erro ao interpretar doacao_arredondar:", error);
      console.error("Valor bruto:", attrDoacao.value);
    }
  } else {
    console.log("ℹ️ Pedido sem doação registrada.");
  }

  return new Response();
};
