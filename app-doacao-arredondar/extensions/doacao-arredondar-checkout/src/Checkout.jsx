import '@shopify/ui-extensions/preact';
import {render} from 'preact';
import {useState} from 'preact/hooks';

export default function extension() {
  render(<Extension />, document.body);
}

function Extension() {
  // Se não puder alterar atributos, mostra só um aviso
  if (!shopify.instructions.value.attributes.canUpdateAttributes) {
    return (
      <s-banner heading="Doações indisponíveis" tone="warning">
        <s-text>
          Neste tipo de checkout não é possível adicionar doações.
        </s-text>
      </s-banner>
    );
  }

  const [tipo, setTipo] = useState('fixo');   // "fixo" ou "percentual"
  const [valor, setValor] = useState('5');    // valor ou percentual
  const [mensagem, setMensagem] = useState(''); // feedback visual

  async function aplicarDoacao() {
    setMensagem('Salvando doação...');

    const result = await shopify.applyAttributeChange({
      type: 'updateAttribute',
      key: 'doacao_arredondar',
      value: JSON.stringify({ tipo, valor }),
    });

    if (result.type === 'success') {
      setMensagem('Doação aplicada!');
    } else {
      console.log('Erro ao aplicar doação:', result);
      setMensagem('Erro ao aplicar doação.');
    }
  }

  async function removerDoacao() {
    setMensagem('Removendo doação...');

    const result = await shopify.applyAttributeChange({
      type: 'updateAttribute',
      key: 'doacao_arredondar',
      value: '',
    });

    if (result.type === 'success') {
      setMensagem('Doação removida.');
    } else {
      console.log('Erro ao remover doação:', result);
      setMensagem('Erro ao remover doação.');
    }
  }

  function handleValorChange(event) {
    // @ts-ignore – simplifica o acesso ao value
    const novoValor = event.target && event.target.value ? event.target.value : '';
    setValor(novoValor);
  }

  return (
    <s-banner heading="Doe para o Instituto Arredondar">
      <s-stack gap="base">
        <s-text>
          Ajude mais de 200 ONGs com uma pequena doação junto com a sua compra.
        </s-text>

        <s-text>
          Escolha o tipo de doação:
        </s-text>

        {/* Botões para escolher Fixo ou Percentual (um embaixo do outro mesmo) */}
        <s-button
          variant={tipo === 'fixo' ? 'primary' : 'secondary'}
          onClick={() => setTipo('fixo')}
        >
          Valor fixo (R$)
        </s-button>

        <s-button
          variant={tipo === 'percentual' ? 'primary' : 'secondary'}
          onClick={() => setTipo('percentual')}
        >
          Percentual da compra (%)
        </s-button>

        {/* Campo de valor */}
        <s-text-field
          label={
            tipo === 'fixo'
              ? 'Valor da doação (R$)'
              : 'Percentual da compra (%)'
          }
          value={valor}
          onInput={handleValorChange}
        />

        {/* Botões de aplicar/remover */}
        <s-button variant="primary" onClick={aplicarDoacao}>
          Aplicar doação
        </s-button>

        <s-button tone="critical" onClick={removerDoacao}>
          Remover doação
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
