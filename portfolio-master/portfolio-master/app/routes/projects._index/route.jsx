import { json } from '@remix-run/cloudflare';
import { baseMeta } from '~/utils/meta';
import config from '~/config.json';

export async function loader() {
  const githubUrl = `https://github.com/${config.github}`;

  const projects = [
    {
      index: 1,
      title: 'Conflict-Aware Graph RAG',
      description:
        'Graph-based retrieval-augmented generation pipeline converting unstructured text into knowledge triples via LLMs. An entropy-based conflict-detection module reduces hallucination on multi-hop question answering.',
      tags: ['LLMs', 'Knowledge Graphs', 'RAG', 'NLP'],
      article: '/articles/graph-rag',
      github: githubUrl,
    },
    {
      index: 2,
      title: 'RajNLP-50K Corpus',
      description:
        "India's first open Rajasthani–Hindi code-switched corpus — 50K sentences. Fine-tuned MuRIL outperforms GPT-4o on NER, sentiment, and toxicity detection tasks.",
      tags: ['NLP', 'MuRIL', 'Code-Switching', 'Corpus'],
      article: '/articles/rajnlp-50k',
      github: githubUrl,
    },
    {
      index: 3,
      title: 'Cardiac Edge AI',
      description:
        '140× compressed deep-learning model for real-time 5-class arrhythmia detection on an Arduino Nano 33 BLE — ~99% F1 in under 256KB via spectral knowledge distillation and ECG+PPG sensor fusion.',
      tags: ['Edge AI', 'TinyML', 'Knowledge Distillation', 'Arduino'],
      article: '/articles/cardiac-edge-ai',
      github: githubUrl,
    },
  ];

  return json({ projects, githubUrl });
}

export function meta({ matches }) {
  const canonicalUrl = matches.find(m => m.id === 'root')?.data?.canonicalUrl;
  return baseMeta({
    title: 'Projects',
    description:
      'All projects by Eesh Saxena — AI research at the intersection of NLP, edge computing, and graph-based reasoning.',
    canonicalUrl,
  });
}

export { Projects as default } from './projects';
