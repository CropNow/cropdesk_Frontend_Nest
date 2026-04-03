export const mockPestData = [
  {
    id: '1',
    crop: 'Chilli',
    cropEmoji: '🌶',
    image:
      'https://images.unsplash.com/photo-1627844642677-9b2f5b5b4e05?w=600&q=80',
    capturedAt: '2025-06-10 06:20 AM',
    zone: 'Zone A',
    roverId: 'Rover-001',
    gps: '17.3851° N, 78.4868° E',
    pestName: 'Thrips',
    type: 'insect',
    density: 'High',
    zonesAffected: ['Zone A', 'Zone B'],
    description:
      'Scirtothrips dorsalis — chilli thrips are tiny insects that feed on young leaves and flowers causing silvering, scarring and distortion of leaf tissue.',
    whenToAct:
      'Act immediately when silver streaking is visible on more than 10% of leaves',
    whatToUse: 'Spinosad 45% SC at 0.3ml/L or Fipronil 5% SC at 1.5ml/L',
    applicationMethod:
      'Foliar spray targeting the underside of leaves and growing tips',
    timing:
      'Early morning before 8 AM or after 5 PM to avoid sunlight degradation',
    safetyNotes:
      'Re-entry interval: 24 hours. Wear full protective gear including gloves, mask and goggles.',
    resistanceWarning:
      'Resistance to synthetic pyrethroids widely reported. Rotate chemical classes each spray cycle.',
  },
  {
    id: '2',
    crop: 'Tomato',
    cropEmoji: '🍅',
    image:
      'https://images.unsplash.com/photo-1587841328405-23c2a61324cc?w=600&q=80',
    capturedAt: '2025-06-10 07:10 AM',
    zone: 'Zone C',
    roverId: 'Rover-002',
    gps: '17.3863° N, 78.4881° E',
    pestName: 'Two-Spotted Spider Mite',
    type: 'insect',
    density: 'Severe',
    zonesAffected: ['Zone C', 'Zone D'],
    description:
      'Tetranychus urticae — spider mites colonise the underside of tomato leaves causing stippling, bronzing and premature defoliation in hot dry conditions.',
    whenToAct:
      'Treat when more than 5 mites per leaflet are observed or bronze discolouration covers 15% of canopy',
    whatToUse: 'Abamectin 1.8% EC at 0.5ml/L or Spiromesifen 240 SC at 1ml/L',
    applicationMethod:
      'High-volume foliar spray targeting leaf undersides. Ensure full canopy coverage.',
    timing:
      'Apply in early morning. Repeat after 7 days. Do not apply in temperatures above 35°C.',
    safetyNotes:
      'Re-entry interval: 12 hours. Avoid spraying near water sources.',
    resistanceWarning:
      'High resistance risk. Never use the same acaricide more than twice consecutively.',
  },
];
