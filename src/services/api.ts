const QUOTE_API = 'https://dummyjson.com/quotes/random';

const CATEGORIES: { id: number; name: string; icon: string }[] = [
  { id: 1,  name: 'Estudos',      icon: '📚' },
  { id: 2,  name: 'Trabalho',     icon: '💼' },
  { id: 3,  name: 'Saúde',        icon: '🏃' },
  { id: 4,  name: 'Pessoal',      icon: '🧠' },
  { id: 5,  name: 'Finanças',     icon: '💰' },
  { id: 6,  name: 'Casa',         icon: '🏠' },
  { id: 7,  name: 'Lazer',        icon: '🎮' },
  { id: 8,  name: 'Alimentação',  icon: '🥗' },
];

interface QuoteResponse {
  content: string;
  author: string;
}

export async function fetchMotivationalQuote(): Promise<QuoteResponse> {
  const response = await fetch(QUOTE_API);

  if (!response.ok) {
    throw new Error('Falha ao buscar frase motivacional.');
  }

  const data = await response.json();

  return {
    content: data.quote,
    author: data.author,
  };
}

export async function fetchCategories(): Promise<typeof CATEGORIES> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return CATEGORIES;
}