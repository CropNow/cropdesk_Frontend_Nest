export const mockWeedData = [
  {
    id: '1',
    crop: 'Chilli',
    cropEmoji: '🌶',
    image: '',
    capturedAt: '2025-06-10 06:30 AM',
    zone: 'Zone A',
    roverId: 'Rover-001',
    gps: '17.3852° N, 78.4869° E',
    weedPressure: 'High',
    species: 'Parthenium hysterophorus',
    commonName: 'Congress Weed',
    growthStage: 'Flowering',
    coverage: '31%',
    threat:
      'Critical — highly allelopathic, suppresses chilli germination and early growth',
    description:
      'A highly invasive annual weed that competes aggressively for nutrients and releases allelopathic chemicals that inhibit crop growth. Also causes human allergic reactions.',
    controlMethod:
      'Chemical — pre and post-emergence herbicide combined with manual uprooting before flowering',
    herbicide:
      'Atrazine 50% WP at 1.5kg/ha as pre-emergence OR Glyphosate 41% SL at 1.6L/ha (directed spray only — non-selective)',
    applicationTiming:
      'Apply post-emergence herbicide at 2–4 leaf stage of weed. Never allow to reach flowering stage.',
    cropSafety:
      'Glyphosate is non-selective — use directed spray only away from chilli plants. Atrazine safe as pre-emergence before transplanting.',
    resistanceStatus:
      'No confirmed herbicide resistance in India. However, monitor for shifts due to high seed production.',
  },
  {
    id: '2',
    crop: 'Tomato',
    cropEmoji: '🍅',
    image:
      'https://images.unsplash.com/photo-1597848212624-a19eb35e265c?w=600&q=80',
    capturedAt: '2025-06-10 07:20 AM',
    zone: 'Zone C',
    roverId: 'Rover-002',
    gps: '17.3865° N, 78.4883° E',
    weedPressure: 'Moderate',
    species: 'Cynodon dactylon',
    commonName: 'Bermuda Grass',
    growthStage: 'Vegetative',
    coverage: '19%',
    threat:
      'Medium — competes for water and nutrients, hosts several tomato pests',
    description:
      'A perennial grass weed with an extensive rhizome system. Very difficult to control once established. Acts as an alternate host for whitefly and thrips that spread tomato viruses.',
    controlMethod:
      'Chemical — selective grass herbicide. Do not use non-selective as it will damage tomato plants.',
    herbicide:
      'Quizalofop-ethyl 5% EC at 1L/ha in 300L water — graminicide safe on tomato',
    applicationTiming:
      'Apply when grass is actively growing at 3–5 leaf stage. Avoid drought or heat stress periods.',
    cropSafety:
      'Quizalofop-ethyl is selective for grasses — fully safe on tomato at recommended dose.',
    resistanceStatus:
      'Resistance to ACCase inhibitors reported in some regions. Rotate with propaquizafop if regrowth observed.',
  },
];
