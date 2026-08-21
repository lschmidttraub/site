import type { WritingEntry } from './writing';

export interface Publication extends WritingEntry {
  authors: string;
}

export const publications: Publication[] = [
  {
    title: 'Geometric Iterative Retrieval for Neural Audio Codec Resynthesis',
    url: 'https://arxiv.org/abs/2608.19141',
    date: new Date('2026-08-19'),
    venue: 'ISMIR 2026',
    authors: 'Schmidt-Traub et al.',
  },
  {
    title: 'On Repulsive and Attractive Teachers',
    url: 'https://antonbaumann.com/blog/repulsive-attractive-teachers/',
    // Only "August 2026" is given on the post; day is not published.
    date: new Date('2026-08-01'),
    venue: 'LAS Group',
    authors: 'Baumann et al.',
  },
];
