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
        'Graph-based retrieval-augmented generation that turns text into knowledge triples with LLMs. An entropy-based conflict-detection module cuts hallucination on multi-hop question answering.',
      tags: ['Python', 'LangChain', 'Neo4j', 'GPT-4o', 'HuggingFace'],
      article: '/articles/graph-rag',
      github: githubUrl,
    },
    {
      index: 2,
      title: 'RajNLP-50K Corpus',
      description:
        "India's first open Rajasthani-Hindi code-switched corpus of 50K sentences. Fine-tuned MuRIL beats GPT-4o on NER, sentiment, and toxicity detection.",
      tags: ['Python', 'PyTorch', 'HuggingFace', 'MuRIL'],
      article: '/articles/rajnlp-50k',
      github: `${githubUrl}/rajnlp-50k`,
    },
    {
      index: 3,
      title: 'Cardiac Edge AI',
      description:
        '140x compressed deep-learning model for real-time 5-class arrhythmia detection on an Arduino Nano 33 BLE. Hits ~99% F1 in under 256KB using spectral knowledge distillation and ECG+PPG sensor fusion.',
      tags: ['Python', 'PyTorch', 'TFLite Micro', 'C++', 'Arduino'],
      article: '/articles/cardiac-edge-ai',
      github: `${githubUrl}/cardiac-edge-ai`,
    },
    {
      index: 4,
      title: 'Reversible Data Hiding: Paper Implementations',
      description:
        'Reproductions of recent reversible-data-hiding papers (IEEE TMM, SPL, and TCE, 2024 to 2026): encryption, embedding, and extraction pipelines benchmarked for capacity and reconstruction fidelity.',
      tags: ['MATLAB', 'Python', 'Image Processing', 'Cryptography'],
      github: githubUrl,
    },
    {
      index: 5,
      title: 'ShopHub: MERN E-Commerce',
      description:
        'Full e-commerce platform with a product catalog, shopping cart, checkout, user authentication, and order management.',
      tags: ['MongoDB', 'Express', 'React', 'Node.js'],
      github: `${githubUrl}/ecommerce-mern-shophub`,
    },
    {
      index: 6,
      title: 'E-Commerce: PHP + MongoDB',
      description:
        'The same store rebuilt on a PHP backend with MongoDB, keeping a React-compatible frontend.',
      tags: ['PHP', 'MongoDB', 'React'],
      github: `${githubUrl}/ecommerce-php-mongodb`,
    },
    {
      index: 7,
      title: 'Distributed File Storage',
      description: 'A distributed file-storage system with node-based storage.',
      tags: ['TypeScript', 'Node.js'],
      github: `${githubUrl}/distributed-file-storage`,
    },
    {
      index: 8,
      title: 'SERN Stack Web App',
      description: 'A full-stack web application built on the SERN stack.',
      tags: ['SQL', 'Express', 'React', 'Node.js'],
      github: `${githubUrl}/SERN`,
    },
    {
      index: 9,
      title: 'Leclerc (CL16) Website Replica',
      description:
        "A faithful replica of Charles Leclerc's website: a smooth-scroll, animation-driven experience.",
      tags: ['JavaScript', 'GSAP', 'HTML', 'CSS'],
      github: `${githubUrl}/leclerc-replica`,
    },
  ];

  return json({ projects, githubUrl });
}

export function meta({ matches }) {
  const canonicalUrl = matches.find(m => m.id === 'root')?.data?.canonicalUrl;
  return baseMeta({
    title: 'Projects',
    description:
      'Projects by Eesh Saxena across NLP, edge computing, and graph-based reasoning.',
    canonicalUrl,
  });
}

export { Projects as default } from './projects';
