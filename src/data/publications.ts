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
    title: 'On Repulsive and Attractive Teachers: Separating Correctness from Behavior in Self-Distillation',
    url: 'https://arxiv.org/abs/2609.21561',
    date: new Date('2026-09-18'),
    venue: 'NeurIPS 2026 FLLMPT Workshop',
    authors: 'Baumann et al.',
  },
];
