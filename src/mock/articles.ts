import type { Article } from '../state/types'

export const mockArticles: Article[] = [
  {
    id: 'art-001',
    title: 'Mediterranean Diet Linked to Improved Heart Health',
    source: 'Global Health Wire',
    publishedAt: '2025-11-20T09:00:00Z',
    author: 'Dr. Riya Mehta',
    url: 'https://example.com/mediterranean-heart-health',
    content:
      'A multi-center clinical study following 5,500 adults across three continents found that participants adhering to a Mediterranean-style diet reduced their risk of major cardiovascular events by 23% over four years. Researchers highlight that the dietary pattern—rich in olive oil, legumes, whole grains, leafy greens, and moderate fish intake—improves lipid profiles and lowers inflammatory markers. The study also notes improved blood pressure control and better adherence compared with low-fat diets. Healthcare providers are encouraged to pair dietary counseling with hands-on cooking education to enhance patient compliance.'
  },
  {
    id: 'art-002',
    title: 'AI Tool Speeds Up Rare Disease Diagnosis',
    source: 'MedTech Daily',
    publishedAt: '2025-11-18T15:30:00Z',
    author: 'Jason Clark',
    url: 'https://example.com/ai-rare-disease',
    content:
      'Clinicians at the University of Leiden released a study on an AI-driven platform that analyzes genomic data and electronic health records to flag probable rare diseases. In a cohort of 1,200 patients, the system delivered preliminary diagnoses 40% faster than traditional workflows. Investigators caution that the tool is meant to augment, not replace, clinician judgment, and emphasized the need for diverse data inputs to prevent biased recommendations. Regulatory review is underway, and early adopters are focusing on expanding datasets for underrepresented populations.'
  },
  {
    id: 'art-003',
    title: 'Short Walks After Meals May Lower Blood Sugar Spikes',
    source: 'Everyday Health Watch',
    publishedAt: '2025-11-10T07:45:00Z',
    author: 'Lena Ortiz',
    url: 'https://example.com/post-meal-walks',
    content:
      'A meta-analysis covering eight small randomized trials suggests that walking for even 7–10 minutes within 30 minutes of eating can blunt postprandial glucose spikes in people with prediabetes. Participants who did brief walks after each meal saw average glucose reductions of 12 mg/dL compared to those who remained sedentary. Scientists say the movement activates muscle glucose uptake without requiring vigorous exercise. The review calls for larger trials to see if the strategy prevents progression to type 2 diabetes.'
  }
]

