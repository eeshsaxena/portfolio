// Server-only module (never bundled to the client) so the gated content
// is not exposed before the password is entered.

export const ACTIVITIES = [
  {
    role: 'Technical Club Lead',
    org: 'IIIT Senapati',
    period: '2024 - Present',
    note: 'Organised coding workshops and intra-college hackathons, and mentored juniors getting started with DSA and web dev.',
  },
  {
    role: 'Competitive Programming Mentor',
    org: 'Peer study group',
    period: '2023 - Present',
    note: 'Run weekly problem-solving sessions and post-contest editorials for Codeforces and LeetCode rounds.',
  },
  {
    role: 'Open Source Contributor',
    org: 'Hacktoberfest',
    period: '2024',
    note: 'Merged pull requests across DSA and web repositories during the event.',
  },
  {
    role: 'Volunteer',
    org: 'NSS',
    period: '2023',
    note: 'Took part in community outreach and on-campus drives.',
  },
  {
    role: 'Volunteer',
    org: 'RSA, Kota',
    note: 'Volunteered with RSA in Kota.',
  },
  {
    role: 'Lawn Tennis (Under-17)',
    org: 'State Championship',
    note: 'Placed 4th in the Under-17 category at the state level.',
  },
  {
    role: 'Article Writer',
    org: 'The Indian Express',
    note: 'Contribute articles and opinion pieces.',
  },
  {
    role: 'Book Reviews',
    note: 'Write reviews of the books I read.',
  },
];

export const INTERESTS = [
  'Formula 1',
  'Chess',
  'Music production',
  'Photography',
  'Stocks & investing',
];

// Competitive programming profiles. Handles are best-guess (eeshsaxena);
// update the URLs if your handle differs on any platform.
export const CP = [
  {
    platform: 'Codeforces',
    rank: 'Specialist',
    rating: 'max 1582',
    url: 'https://codeforces.com/profile/eeshsaxena',
  },
  {
    platform: 'LeetCode',
    rank: 'Guardian',
    rating: 'max 1873',
    url: 'https://leetcode.com/u/eeshsaxena',
  },
  {
    platform: 'CodeChef',
    rank: '4 Star',
    rating: 'max 1866',
    url: 'https://www.codechef.com/users/eeshsaxena',
  },
];
