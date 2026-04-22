export const BANK_GUIDES = {
  nubank: {
    id: 'nubank',
    name: 'Nubank',
    recommended: true,
    color: 'bg-purple-600',
    lightColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    title: 'Como baixar seu extrato Nubank',
    uploadTitle: 'Envie seu extrato Nubank',
    steps: [
      "Abra o app Nubank",
      "Acesse sua conta",
      "Procure a opção de extrato ou exportação de movimentações",
      "Escolha um período de pelo menos 90 dias",
      "Baixe o arquivo",
      "Envie o extrato aqui no VYNEX"
    ],
    observation: "Quanto maior o período enviado, melhor será a análise. Recomendamos pelo menos 90 dias."
  },
  inter: { id: 'inter', name: 'Inter', comingSoon: true },
  c6: { id: 'c6', name: 'C6 Bank', comingSoon: true },
  itau: { id: 'itau', name: 'Itaú', comingSoon: true },
  caixa: { id: 'caixa', name: 'Caixa', comingSoon: true },
  santander: { id: 'santander', name: 'Santander', comingSoon: true },
  picpay: { id: 'picpay', name: 'PicPay', comingSoon: true },
  other: {
    id: 'other',
    name: 'Outro banco',
    warning: "Você pode enviar seu extrato. A análise pode variar conforme o formato do arquivo."
  }
};
