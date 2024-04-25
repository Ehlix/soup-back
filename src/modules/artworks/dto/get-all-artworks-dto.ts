export class GetAllArtworksDto {
  readonly offset?: number;
  readonly limit?: number;
  readonly order?: Order;
  readonly userId?: string;
  readonly medium?: string;
  readonly subject?: string;
}

type Order = 'trending' | 'popular' | 'newest';
