export interface WritingEntry {
  title: string;
  url: string;
  date: Date;
  venue?: string;
}

export const writing: WritingEntry[] = [
  {
    title: 'Probabilistic, Reformative Justice',
    url: 'https://www.lesswrong.com/posts/dqbhcm6g7CMWvhoid/probabilistic-reformative-justice',
    date: new Date('2026-05-12'),
  },
];
