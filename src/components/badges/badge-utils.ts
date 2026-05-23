/**
 * Formate les critères JSON en texte lisible
 */
export function formatCriteria(criteriaJson: string): string {
  try {
    const criteria = JSON.parse(criteriaJson);
    const parts: string[] = [];
    
    if (criteria.minDonations) {
      parts.push(`${criteria.minDonations} dons`);
    }
    if (criteria.livesSaved) {
      parts.push(`${criteria.livesSaved} vies`);
    }
    if (criteria.referrals) {
      parts.push(`${criteria.referrals} parrainages`);
    }
    if (criteria.consecutiveDonations) {
      parts.push(`${criteria.consecutiveDonations} consécutifs`);
    }
    if (criteria.season) {
      parts.push(criteria.season);
    }
    
    return parts.length > 0 ? parts.join(', ') : 'Personnalisé';
  } catch {
    return 'Personnalisé';
  }
}