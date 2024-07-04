export class GetArtworksLikeDto {
  readonly userId: string;
  readonly offset?: number;
  readonly limit?: number;
  readonly dateStart?: string;
}
