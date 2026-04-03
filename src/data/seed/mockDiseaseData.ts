export const mockDiseaseData = [
  {
    id: '1',
    crop: 'Chilli',
    cropEmoji: '🌶',
    image: '',
    capturedAt: '2025-06-10 06:14 AM',
    zone: 'Zone A',
    roverId: 'Rover-001',
    gps: '17.3850° N, 78.4867° E',
    disease: 'Chilli Leaf Curl Virus',
    confidence: 91,
    severity: 'High',
    affectedArea: '42%',
    symptoms:
      'Upward curling and crinkling of leaves observed. Yellowing along leaf margins with stunted shoot growth visible in rover imagery.',
    treatment:
      'Remove and destroy infected plants immediately. Apply imidacloprid 17.8% SL at 0.3ml/L to control whitefly vector. Repeat after 10 days.',
  },
  {
    id: '2',
    crop: 'Chilli',
    cropEmoji: '🌶',
    image: '',
    capturedAt: '2025-06-10 06:38 AM',
    zone: 'Zone B',
    roverId: 'Rover-001',
    gps: '17.3855° N, 78.4871° E',
    disease: 'Anthracnose',
    confidence: 84,
    severity: 'Medium',
    affectedArea: '21%',
    symptoms:
      'Circular sunken lesions with dark borders detected on fruit and lower leaves. Orange spore masses visible under high-zoom rover camera.',
    treatment:
      'Apply mancozeb 75% WP at 2.5g/L or copper oxychloride 50% WP at 3g/L. Improve field drainage to reduce humidity.',
  },
  {
    id: '3',
    crop: 'Tomato',
    cropEmoji: '🍅',
    image: '',
    capturedAt: '2025-06-10 07:02 AM',
    zone: 'Zone C',
    roverId: 'Rover-002',
    gps: '17.3862° N, 78.4880° E',
    disease: 'Early Blight',
    confidence: 88,
    severity: 'High',
    affectedArea: '37%',
    symptoms:
      'Dark brown concentric ring lesions (target board pattern) detected on lower and middle leaves. Yellowing of surrounding leaf tissue confirmed by rover imaging.',
    treatment:
      'Apply chlorothalonil 75% WP at 2g/L. Remove and destroy affected lower leaves. Ensure adequate plant spacing for air circulation.',
  },
  {
    id: '4',
    crop: 'Tomato',
    cropEmoji: '🍅',
    image:
      'https://images.unsplash.com/photo-1518531933067-c838169eed24?w=600&q=80',
    capturedAt: '2025-06-10 07:29 AM',
    zone: 'Zone D',
    roverId: 'Rover-002',
    gps: '17.3870° N, 78.4890° E',
    disease: 'Tomato Mosaic Virus',
    confidence: 79,
    severity: 'Critical',
    affectedArea: '58%',
    symptoms:
      'Mosaic pattern of light and dark green patches across leaf surface. Leaf distortion and fern-like appearance of new growth detected. Severe stunting observed.',
    treatment:
      'No chemical cure. Remove all infected plants immediately. Disinfect tools with 10% bleach solution. Plant resistant varieties in next cycle.',
  },
];
