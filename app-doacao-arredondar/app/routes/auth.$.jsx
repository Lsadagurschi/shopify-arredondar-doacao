import { json } from "@remix-run/node";
import { boundary } from "@shopify/shopify-app-react-router/server";
import shopify, { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  // 1️⃣ Autentica o admin e obtém sessão + cliente REST
  const { session, admin } = await authenticate.admin(request);

  console.log("Auth loader executado para a loja:", session.shop);

  // 2️⃣ Verifica se já existe o produto de doação cadastrado para esta loja
  const existing = await prisma.donationConfig.findUnique({
    where: { shop: session.shop },
  });

  if (!existing) {
    console.log("Nenhum produto de doação encontrado. Criando agora...");

    // 3️⃣ Cria automaticamente o produto na Shopify
    const productResponse = await admin.rest.Product.create({
      product: {
        title: "Doação Arredondar",
        body_html: "Produto interno gerado automaticamente pelo app de doações.",
        vendor: "Arredondar",
        product_type: "Donation",
        status: "active",
        handle: "doacao-arredondar",
        variants: [
          {
            price: "1.00",
            sku: "DOACAO-ARREDONDAR",
            inventory_management: null,
          },
        ],
      },
    });

    const variantId = String(productResponse.data.variants[0].id);

    console.log("Produto de doação criado. Variant ID:", variantId);

    // 4️⃣ Salva no Prisma para ser consumido pela Checkout Extension
    await prisma.donationConfig.create({
      data: {
        shop: session.shop,
        variantId,
      },
    });
  } else {
    console.log("Produto de doação já registrado:", existing.variantId);
  }

  // 5️⃣ Retorna OK
  return json({ status: "ok" });
};

export const headers = (headersArgs) => boundary.headers(headersArgs);
