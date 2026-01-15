
import { Profile, UserRole } from './types';

export const COLORS = {
  ORANGE: '#FFA45B',
  CORAL: '#F26A8D',
  PURPLE: '#7B4AE2',
  WHITE: '#FFFFFF',
  GOLD: '#FFC83D',
  GREEN: '#4CD964',
  RED: '#FF5A5F',
  ACCENT_PURPLE: '#6A1FB0'
};

export const MOCK_PROFILES: Profile[] = [
  {
    id: '1',
    name: 'Anna Schmidt',
    role: UserRole.CAREGIVER,
    photo: 'https://picsum.photos/seed/anna/600/800',
    location: 'Berlin, 5km',
    bio: 'Experienced nurse with a heart for elderly care. Love walks in the park.',
    tags: ['Medical Care', 'Night Shifts', 'Friendly'],
    rating: 5
  },
  {
    id: '2',
    name: 'Thomas Müller',
    role: UserRole.CARESEEKER,
    photo: 'https://picsum.photos/seed/thomas/600/800',
    location: 'Munich, 2km',
    bio: 'Looking for someone to help with daily errands and light cleaning.',
    tags: ['Shopping', 'Cleaning', 'Weekly'],
    rating: 4
  },
  {
    id: '3',
    name: 'Elena K.',
    role: UserRole.CAREGIVER,
    photo: 'https://picsum.photos/seed/elena/600/800',
    location: 'Hamburg, 10km',
    bio: 'Student looking for part-time care opportunities. Valid drivers license.',
    tags: ['Flexible', 'Driver', 'Cooking'],
    rating: 5
  }
];
