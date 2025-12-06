import '@shopify/ui-extensions/preact';
import {render} from 'preact';

export default function extension() {
  render(<Extension />, document.body);
}

function Extension() {
  return (
    <s-banner heading="Doe para o Instituto Arredondar">
      <s-stack gap="base">
        <s-text>
          Ajude a apoiar mais de 200 ONGs com uma pequena doação junto à sua compra.
        </s-text>
        <s-text tone="neutral">
          Esta é apenas a primeira versão (MVP). Em breve, este app fará o split automático via gateway
          e enviará o valor da doação diretamente para o Instituto Arredondar.
        </s-text>
      </s-stack>
    </s-banner>
  );
}
