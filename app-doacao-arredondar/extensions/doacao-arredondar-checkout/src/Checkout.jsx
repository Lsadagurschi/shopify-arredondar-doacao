import '@shopify/ui-extensions/preact';
import {render} from 'preact';
import {useState} from 'preact/hooks';

// Ponto de entrada da extensão
export default function extension() {
  render(<Extension />, document.body);
}

function Extension() {
  // ✅ Variant ID da sua variante de doação
  const DONATION_VARIANT_ID = "gid://shopify/ProductVariant/50806589030695";

  const [tipo, setTipo] = useState('fixo');
  const [valor, setValor] = useState('');
  const [mensagem, setMensagem] = useState('');

  // Converte texto ("10", "10,50") em número
  function parseValorBr(valorTexto) {
    if (!valorTexto) return 0;
    const limpo = valorTexto.replace('.', '').replace(',', '.').trim();
    const num = Number(limpo);
    return Number.isNaN(num) ? 0 : num;
  }

  async function aplicarDoacao() {
    const numero = parseValorBr(valor);

    if (!numero || numero <= 0) {
      setMensagem('Informe um valor de doação válido.');
      return;
    }

    // 🧮 Regra simples: 1 unidade do produto de doação = R$ 1,00
    // Ex: usuário digita "5" => quantity = 5 => R$ 5,00
    const quantity = Math.round(numero);

    setMensagem('Aplicando doação...');

    try {
      const result = await shopify.applyCartLinesChange({
        type: 'addCartLine',
        merchandiseId: DONATION_VARIANT_ID,
        quantity,
      });

      console.log('Resultado applyCartLinesChange:', result);

      if (result.type === 'success') {
        setMensagem('Doação aplicada ao seu pedido!');
      } else {
        setMensagem('Não foi possível aplicar a doação.');
      }
    } catch (error) {
      console.error('Erro ao aplicar doação:', error);
      setMensagem('Erro inesperado ao aplicar a doação.');
    }
  }

  function handleValorChange(event) {
    const novoValor = event?.target?.value ?? '';
    setValor(novoValor);
  }

  return (
    <s-banner heading="Doe para o Instituto Arredondar">
      <s-stack gap="base">
        <s-text>
          Ajude dezenas de ONGs apoiadas pelo Instituto Arredondar com uma pequena doação junto com a sua compra.
        </s-text>

        <s-text>Escolha o tipo de doação:</s-text>

        {/* Botão: Valor fixo */}
        <s-button
          variant={tipo === 'fixo' ? 'primary' : 'secondary'}
          onClick={() => setTipo('fixo')}
        >
          Valor fixo (R$)
        </s-button>

        {/* Botão: Percentual (ainda não altera o cálculo, mas já deixa pronto visualmente) */}
        <s-button
          variant={tipo === 'percentual' ? 'primary' : 'secondary'}
          onClick={() => setTipo('percentual')}
        >
          Percentual da compra (%)
        </s-button>

        {/* Campo de valor */}
        <s-text-field
          label={tipo === 'fixo' ? 'Valor da doação (R$)' : 'Percentual da compra (%)'}
          value={valor}
          onInput={handleValorChange}
        />

        {/* Botão de aplicar doação */}
        <s-button variant="primary" onClick={aplicarDoacao}>
          Aplicar doação
        </s-button>

        {mensagem && (
          <s-text tone="info">
            {mensagem}
          </s-text>
        )}
      </s-stack>
    </s-banner>
  );
}
